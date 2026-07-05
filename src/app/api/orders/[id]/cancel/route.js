// POST /api/orders/[id]/cancel — user apna order cancel kar sakta hai
// Policy: sirf PENDING ya PROCESSING orders cancel ho sakte hain
// SHIPPED ke baad cancel nahi hoga

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

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
    include: { items: true },
  });

  // Order exist nahi ya doosre user ka hai
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // ✅ Shipping policy check
  const cancellableStatuses = ["PENDING", "PROCESSING"];
  if (!cancellableStatuses.includes(order.status)) {
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

  // ✅ Stock wapas karo (cancel hone pe stock restore)
  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Order status CANCELLED kar do
    await tx.order.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });
  });

  return NextResponse.json({ success: true });
}