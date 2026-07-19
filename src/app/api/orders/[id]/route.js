// PATCH /api/orders/[id] — update order status (admin only).
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { cancelOrder } from "@/app/api/orders/_cancel";
import { buildOrderStatusPatch, buildPaymentSyncPatch } from "@/lib/orderStatus";

const VALID = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

// Explicit allowed forward transitions: no jumping backwards out of a
// terminal state, and no skipping straight from PENDING to DELIVERED.
const ALLOWED_TRANSITIONS = {
  PENDING: ["PROCESSING", "SHIPPED", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export async function PATCH(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { status } = await request.json();
    if (!VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, payment: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (existing.status === status) {
      return NextResponse.json({ order: existing });
    }

    if (!ALLOWED_TRANSITIONS[existing.status]?.includes(status)) {
      return NextResponse.json(
        { error: `Cannot change order from ${existing.status} to ${status}.` },
        { status: 400 }
      );
    }

    // Cancelling through the admin route must restore stock (and refund online
    // payments) exactly like the customer-facing cancel endpoint does.
    if (status === "CANCELLED") {
      const result = await cancelOrder(existing).catch((err) => {
        console.error("[orders/[id] PATCH] cancel failed:", err?.message || err);
        return { ok: false, reason: "error" };
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: "This order could not be cancelled." },
          { status: 409 }
        );
      }
      const order = await prisma.order.findUnique({ where: { id: params.id }, include: { payment: true } });
      return NextResponse.json({ order });
    }

    const orderPatch = buildOrderStatusPatch(existing, status);
    const paymentPatch = buildPaymentSyncPatch(existing, status);

    const order = await prisma
      .$transaction(async (tx) => {
        await tx.order.update({ where: { id: params.id }, data: orderPatch });
        if (paymentPatch) {
          await tx.payment.update({ where: { orderId: params.id }, data: paymentPatch });
        }
        return tx.order.findUnique({ where: { id: params.id }, include: { payment: true } });
      })
      .catch(() => null);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Could not update order." }, { status: 500 });
  }
}
