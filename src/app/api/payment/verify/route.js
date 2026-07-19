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
import { checkServiceability } from "@/lib/delivery";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // RAZORPAY_KEY_ID/SECRET are only ever set together (see getRazorpay()) —
  // reuse that same guard here instead of handing an undefined secret to
  // crypto.createHmac, which would throw instead of failing gracefully.
  if (!getRazorpay()) {
    return NextResponse.json({ error: "Online payments are not configured yet." }, { status: 503 });
  }

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
    // Already completed — most likely the webhook (which claims the order
    // atomically and can fire near-simultaneously with this call) won the
    // race, or the browser retried verify after a dropped response. The
    // payment itself is genuinely valid, so hand back the existing order
    // instead of erroring a customer who has already paid.
    const existing = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
    return NextResponse.json({ order: existing }, { status: 200 });
  }

  // Hard business requirement: we only ship within Delhi NCR. create-order
  // already checks this before the customer pays, but verify is the step
  // that actually persists the shipping address on the order — re-check
  // here too so a client can't bypass that earlier gate by supplying a
  // different, unserviceable address at this later step.
  const addressToPersist = address ?? order.address ?? {};
  if (!addressToPersist?.pincode) {
    return NextResponse.json({ error: "Shipping address required." }, { status: 400 });
  }
  const serviceability = await checkServiceability(addressToPersist.pincode);
  if (!serviceability.serviceable) {
    return NextResponse.json(
      { error: "We currently deliver only within Delhi NCR. This address isn't serviceable." },
      { status: 400 }
    );
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}-${order.id.slice(-8).toUpperCase()}`;

  let completedOrder;
  try {
    completedOrder = await prisma.$transaction(async (tx) => {
      // Atomically claim the PENDING -> PROCESSING transition (mirrors the
      // webhook's own `updateMany` claim). If another request — most likely
      // the webhook — already flipped this order's status in the window
      // between the pre-check above and this transaction, `claim.count` is
      // 0 and we must NOT re-run stock/coupon/payment side effects a second
      // time; just return the order as already-completed.
      const claim = await tx.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: {
          ...buildOrderStatusPatch(order, "PROCESSING"),
          paymentMethod: "ONLINE",
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpaySignature: razorpay_signature,
          invoiceNumber,
          address: addressToPersist,
        },
      });

      if (claim.count === 0) {
        return tx.order.findUnique({ where: { id: order.id }, include: { items: true } });
      }

      const updated = await tx.order.findUnique({ where: { id: order.id }, include: { items: true } });

      await applyStockDeltas(tx, updated.items.map((item) => ({ productId: item.productId, quantity: item.quantity })), -1);

      // Claim the coupon use now that payment is confirmed (mirrors the COD
      // flow's atomic claim in api/orders). If the usage limit was exhausted
      // by another order in the window between create-order and this verify
      // call, the payment has already been captured by Razorpay — we can't
      // retroactively charge more, so the order still completes and this is
      // only logged, never failed, to avoid leaving a paid customer stranded.
      if (updated.couponCode) {
        const couponRecord = await tx.coupon.findUnique({ where: { code: updated.couponCode } });
        const couponClaim = couponRecord
          ? await tx.coupon.updateMany({
              where: buildUsageClaimWhere(couponRecord.id, couponRecord.usageLimit),
              data: { usedCount: { increment: 1 } },
            })
          : { count: 0 };
        if (couponClaim.count === 0) {
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
