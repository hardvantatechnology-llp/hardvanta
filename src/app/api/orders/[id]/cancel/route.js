// POST /api/orders/[id]/cancel — user apna order cancel kar sakta hai
// Policy: sirf PENDING ya PROCESSING orders cancel ho sakte hain
// SHIPPED ke baad cancel nahi hoga

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cancelOrder } from "@/app/api/orders/_cancel";

export async function POST(request, { params }) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/prisma");

  // Order fetch karo
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true },
  });

  // Order exist nahi ya doosre user ka hai
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Stock restore + refund (if paid online) happen inside cancelOrder, guarded
  // against double-cancel races.
  let result;
  try {
    result = await cancelOrder(order);
  } catch (err) {
    console.error("[orders/cancel] error:", err?.message || err);
    return NextResponse.json(
      { error: "Could not cancel order. Please try again." },
      { status: 500 }
    );
  }

  if (!result.ok) {
    if (result.reason === "already-processed") {
      return NextResponse.json(
        { error: "This order cannot be cancelled." },
        { status: 409 }
      );
    }
    // ✅ Shipping policy check
    return NextResponse.json(
      {
        error:
          order.status === "SHIPPED"
            ? "Order already shipped. Cannot cancel after shipping."
            : order.status === "DELIVERED"
            ? "Order already delivered. Cannot cancel."
            : "This order cannot be cancelled.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
