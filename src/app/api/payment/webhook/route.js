// POST /api/payment/webhook
// Razorpay webhook — the authoritative order-completion path. Independent of
// the browser calling /api/payment/verify: if the tab closes or the network
// drops after Razorpay captures a payment but before /verify runs, this route
// reconciles the order instead of leaving it PENDING forever.
//
// Configure in the Razorpay Dashboard: Settings -> Webhooks -> add this URL,
// subscribe to `payment.captured` (and/or `order.paid`), and set the webhook
// secret as RAZORPAY_WEBHOOK_SECRET. This uses the webhook secret, NOT
// RAZORPAY_KEY_SECRET — they are different values in Razorpay.
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { applyStockDeltas } from "@/lib/stock";

export async function POST(request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[payment/webhook] RAZORPAY_WEBHOOK_SECRET not configured.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected);
  const givenBuf = Buffer.from(signature);
  const signatureValid =
    expectedBuf.length === givenBuf.length &&
    crypto.timingSafeEqual(expectedBuf, givenBuf);

  if (!signatureValid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const type = event.event;
  if (type !== "payment.captured" && type !== "order.paid") {
    // Ack anything we don't act on (refund/failure events etc.) so Razorpay stops retrying.
    return NextResponse.json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  const razorpayOrderId = payment?.order_id;
  const razorpayPaymentId = payment?.id;
  if (!razorpayOrderId || !razorpayPaymentId) {
    return NextResponse.json({ error: "Malformed payload." }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { razorpayOrderId },
    include: { items: true },
  });
  if (!order) {
    // Unknown order id — ack so Razorpay doesn't retry forever.
    return NextResponse.json({ received: true });
  }

  const invoiceNumber = `INV-${new Date().getFullYear()}-${order.id.slice(-8).toUpperCase()}`;

  let completedOrder = null;
  try {
    completedOrder = await prisma.$transaction(async (tx) => {
      // Idempotent + race-safe: only proceed if we're the one flipping PENDING -> PROCESSING.
      // Handles both duplicate webhook deliveries and a race with /api/payment/verify.
      const claim = await tx.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: {
          status: "PROCESSING",
          paymentMethod: "ONLINE",
          paymentId: razorpayPaymentId,
          razorpayOrderId,
          invoiceNumber,
        },
      });
      if (claim.count === 0) return null;

      const fresh = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      });

      await applyStockDeltas(tx, fresh.items.map((item) => ({ productId: item.productId, quantity: item.quantity })), -1);

      await tx.payment.upsert({
        where: { orderId: order.id },
        create: {
          orderId: order.id,
          method: "ONLINE",
          transactionId: razorpayPaymentId,
          razorpayOrderId,
          razorpayPaymentId,
          amount: fresh.total,
          status: "SUCCESS",
        },
        update: {
          transactionId: razorpayPaymentId,
          razorpayOrderId,
          razorpayPaymentId,
          status: "SUCCESS",
        },
      });

      await tx.cartItem.deleteMany({ where: { userId: fresh.userId } });
      return fresh;
    });
  } catch (err) {
    console.error("[payment/webhook] reconciliation failed:", err?.message || err);
    return NextResponse.json({ error: "Reconciliation failed." }, { status: 500 });
  }

  if (completedOrder) {
    try {
      const user = await prisma.user.findUnique({ where: { id: completedOrder.userId } });
      if (user?.email) {
        await sendOrderConfirmationEmail(user.email, completedOrder);
      }
    } catch (err) {
      console.error("[payment/webhook] confirmation email failed:", err?.message || err);
    }
  }

  return NextResponse.json({ received: true });
}
