// Shared order-cancellation logic used by both the customer cancel endpoint
// (api/orders/[id]/cancel) and the admin status-update endpoint
// (api/orders/[id] PATCH), so every path that lands an order on CANCELLED
// restores stock exactly once and refunds any captured online payment.
// Not a route — this file has no default export named GET/POST/etc.
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { applyStockDeltas } from "@/lib/stock";
import { buildPaymentCancelPatch } from "@/lib/orderStatus";
import { sendOrderCancelledEmail, sendRefundInitiatedEmail } from "@/lib/email";

export const CANCELLABLE_STATUSES = ["PENDING", "PROCESSING"];

/**
 * @param {object} order - must include { items: true, payment: true, user: { select: { email, name } } }
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
export async function cancelOrder(order) {
  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return { ok: false, reason: "not-cancellable" };
  }

  // Atomic conditional update: claims the cancellation so two concurrent
  // requests (double-click, client retry) can't both pass the check and
  // double-credit stock — only one updateMany can match the still-cancellable row.
  const claim = await prisma.order.updateMany({
    where: { id: order.id, status: { in: CANCELLABLE_STATUSES } },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });
  if (claim.count === 0) {
    return { ok: false, reason: "already-processed" };
  }

  if (order.items.length > 0) {
    // A single batched UPDATE is already atomic on its own — no $transaction
    // wrapper needed for one statement (previously N separate ones).
    await applyStockDeltas(prisma, order.items.map((item) => ({ productId: item.productId, quantity: item.quantity })), 1);
  }

  // Symmetric with the stock restore above: a cancelled/refunded order
  // shouldn't permanently consume the customer's coupon usage-limit slot.
  if (order.couponCode) {
    await prisma.coupon.updateMany({
      where: { code: order.couponCode, usedCount: { gt: 0 } },
      data: { usedCount: { decrement: 1 } },
    }).catch((err) => {
      console.error("[cancelOrder] failed to restore coupon usedCount:", err?.message || err);
    });
  }

  const needsRefund =
    order.paymentMethod === "ONLINE" &&
    order.payment?.status === "SUCCESS" &&
    order.payment?.razorpayPaymentId;

  if (needsRefund) {
    const razorpay = getRazorpay();
    if (!razorpay) {
      console.error(
        "[cancelOrder] Razorpay not configured; refund not issued for order",
        order.id
      );
    } else {
      try {
        await razorpay.payments.refund(order.payment.razorpayPaymentId, {
          amount: order.total * 100,
        });
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { status: "REFUNDED", refundedAt: order.payment.refundedAt ?? new Date() },
        });
        if (order.user?.email) {
          try {
            await sendRefundInitiatedEmail(order.user.email, order);
          } catch (err) {
            console.error("[cancelOrder] refund email failed:", err?.message || err);
          }
        }
      } catch (err) {
        // The order stays CANCELLED and the payment stays SUCCESS (not REFUNDED)
        // so this is visible for manual refund follow-up rather than silently lost.
        console.error(
          "[cancelOrder] refund failed for order",
          order.id,
          err?.message || err
        );
      }
    }
  } else {
    // Never actually paid (COD, or an online attempt that never completed) —
    // record the payment as Cancelled instead of leaving it stuck at Pending.
    const paymentPatch = buildPaymentCancelPatch(order.payment);
    if (paymentPatch) {
      await prisma.payment.update({ where: { orderId: order.id }, data: paymentPatch });
    }
  }

  // Best-effort — a failed cancellation email must never undo the
  // already-committed cancellation.
  if (order.user?.email) {
    try {
      await sendOrderCancelledEmail(order.user.email, order);
    } catch (err) {
      console.error("[cancelOrder] cancellation email failed:", err?.message || err);
    }
  }

  return { ok: true };
}
