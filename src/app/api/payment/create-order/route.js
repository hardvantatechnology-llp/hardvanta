// POST /api/payment/create-order
// Creates a Razorpay order from the logged-in user's server cart.
// Returns the Razorpay order id + amount + public key for the checkout widget.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json(
      { error: "Online payments are not configured yet." },
      { status: 503 }
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const subtotal = cartItems.reduce(
    (sum, it) => sum + (it.product.salePrice ?? it.product.price) * it.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 49;
  const total = subtotal + shipping;

  const pendingOrder = await prisma.order.create({
    data: {
      userId,
      total,
      address: {},
      paymentMethod: "ONLINE",
      status: "PENDING",
    },
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: pendingOrder.id,
  });

  await prisma.order.update({
    where: { id: pendingOrder.id },
    data: { razorpayOrderId: razorpayOrder.id },
  });

  return NextResponse.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    dbOrderId: pendingOrder.id,
  });
}
