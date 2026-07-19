// POST /api/payment/verify
// Verifies the Razorpay signature, then completes the pending order.
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { applyStockDeltas } from "@/lib/stock";
import { buildOrderStatusPatch } from "@/lib/orderStatus";
import { buildUsageClaimWhere } from "@/lib/couponEngine";

export async function POST(request) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    address,
    dbOrderId,
  } = await request.json();

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Constant-time comparison to avoid a timing side-channel on the signature check.
  const expectedBuf = Buffer.from(expected);
  const givenBuf = Buffer.from(String(razorpay_signature || ""));
  const signatureValid =
    expectedBuf.length === givenBuf.length &&
    crypto.timingSafeEqual(expectedBuf, givenBuf);

  if (!signatureValid) {
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 }
    );
  }

  let order = null;
  if (dbOrderId) {
    order = await prisma.order.findUnique({
      where: { id: dbOrderId },
      include: { items: true },
    });
  }

  if (!order) {
    order = await prisma.order.findFirst({
      where: { userId, razorpayOrderId: razorpay_order_id },
      include: { items: true },
    });
  }

  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json({ error: "Order already processed." }, { status: 400 });
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}-${order.id.slice(-8).toUpperCase()}`;

  let completedOrder;
  try {
    completedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          ...buildOrderStatusPatch(order, "PROCESSING"),
          paymentMethod: "ONLINE",
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          invoiceNumber,
          address: address ?? order.address ?? {},
        },
        include: { items: true },
      });

      await applyStockDeltas(tx, updated.items.map((item) => ({ productId: item.productId, quantity: item.quantity })), -1);

      // Claim the coupon use now that payment is confirmed (mirrors the COD
      // flow's atomic claim in api/orders). If the usage limit was exhausted
      // by another order in the window between create-order and this verify
      // call, the payment has already been captured by Razorpay — we can't
      // retroactively charge more, so the order still completes and this is
      // only logged, never failed, to avoid leaving a paid customer stranded.
      if (updated.couponCode) {
        const couponRecord = await tx.coupon.findUnique({ where: { code: updated.couponCode } });
        const claim = couponRecord
          ? await tx.coupon.updateMany({
              where: buildUsageClaimWhere(couponRecord.id, couponRecord.usageLimit),
              data: { usedCount: { increment: 1 } },
            })
          : { count: 0 };
        if (claim.count === 0) {
          console.error(
            `[payment/verify] coupon ${updated.couponCode} usage limit exhausted after payment for order ${updated.id} — allowing order to complete anyway.`
          );
        }
      }

      // Mirror the COD flow's Payment record — the online path never had one before.
      const existingPayment = await tx.payment.findUnique({ where: { orderId: order.id } });
      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          method: "ONLINE",
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: updated.total,
          status: "SUCCESS",
          paidAt: new Date(),
        },
        update: {
          transactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "SUCCESS",
          paidAt: existingPayment?.paidAt ?? new Date(),
        },
      });

      // Scoped to exactly the products in this order (not a blanket delete-
      // by-userId), so an item added to the cart concurrently with this
      // payment isn't silently wiped out along with the purchased ones.
      await tx.cartItem.deleteMany({
        where: { userId, productId: { in: updated.items.map((i) => i.productId) } },
      });
      return updated;
    });
  } catch (err) {
    console.error("[payment/verify] transaction failed:", err?.message || err);
    return NextResponse.json(
      { error: "Could not complete the order. Please contact support with your payment ID." },
      { status: 500 }
    );
  }

  if (session.user?.email) {
    try {
      await sendOrderConfirmationEmail(session.user.email, completedOrder);
    } catch (err) {
      console.error("[payment] confirmation email failed:", err?.message || err);
    }
  }

  return NextResponse.json({ order: completedOrder }, { status: 201 });
}
