// POST /api/payment/create-order
// Creates a Razorpay order from the logged-in user's server cart.
// Returns the Razorpay order id + amount + public key for the checkout widget.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import { getEligibility, computeDiscount } from "@/lib/couponEngine";
import { checkServiceability, getDeliverySettings } from "@/lib/delivery";

export async function POST(request) {
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

  const { couponCode, address } = await request.json().catch(() => ({}));

  // Hard business requirement: we only ship within Delhi NCR. Reject up
  // front — before the Razorpay order (and the payment prompt shown to the
  // customer) is even created — rather than only catching this later at
  // /api/payment/verify, once money may already have been captured.
  if (!address?.pincode) {
    return NextResponse.json({ error: "Shipping address required." }, { status: 400 });
  }
  const serviceability = await checkServiceability(address.pincode);
  if (!serviceability.serviceable) {
    return NextResponse.json(
      { error: "We currently deliver only within Delhi NCR. This address isn't serviceable." },
      { status: 400 }
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

  // Re-validate the coupon server-side — never trust a client-sent discount.
  // Not incremented here: usedCount is only claimed once payment is verified
  // (mirrors the existing precedent that stock is only decremented in verify,
  // not here, since the payment isn't confirmed yet).
  let couponCodeToStore = null;
  let discountAmount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
    const eligibility = getEligibility(coupon, subtotal);
    if (!eligibility.ok) {
      return NextResponse.json({ error: eligibility.reason }, { status: 400 });
    }
    discountAmount = computeDiscount(coupon, subtotal);
    couponCodeToStore = coupon.code;
  }

  const { freeShippingThreshold, deliveryCharge } = await getDeliverySettings();
  const shipping = (subtotal - discountAmount) >= freeShippingThreshold ? 0 : deliveryCharge;
  const total = subtotal - discountAmount + shipping;

  let pendingOrder;
  try {
    pendingOrder = await prisma.$transaction(async (tx) => {
      // Locked stock/availability check, same as the COD flow — reject up front
      // rather than charging the customer for something unavailable.
      for (const it of cartItems) {
        const rows = await tx.$queryRaw`
          SELECT id, stock, "inStock", name
          FROM "Product"
          WHERE id = ${it.productId}
          FOR UPDATE
        `;
        const product = rows[0];
        if (!product || product.inStock === false) {
          throw new Error(`"${it.product.name}" out of stock.`);
        }
        if (product.stock < it.quantity) {
          throw new Error(`Only ${product.stock} left in stock for "${it.product.name}". Please reduce the quantity.`);
        }
      }

      const itemsData = cartItems.map((it) => ({
        productId: it.productId,
        productName: it.product.name,
        quantity: it.quantity,
        price: it.product.salePrice ?? it.product.price,
      }));

      // Reuse an existing orphaned PENDING online order for this user (e.g. the
      // customer retried checkout) instead of accumulating a new row every time.
      const existing = await tx.order.findFirst({
        where: { userId, paymentMethod: "ONLINE", status: "PENDING" },
      });

      if (existing) {
        await tx.orderItem.deleteMany({ where: { orderId: existing.id } });
        return tx.order.update({
          where: { id: existing.id },
          data: {
            total,
            couponCode: couponCodeToStore,
            discountAmount,
            razorpayOrderId: null,
            items: { create: itemsData },
          },
          include: { items: true },
        });
      }

      return tx.order.create({
        data: {
          userId,
          total,
          couponCode: couponCodeToStore,
          discountAmount,
          address: {},
          paymentMethod: "ONLINE",
          status: "PENDING",
          items: { create: itemsData },
        },
        include: { items: true },
      });
    });
  } catch (err) {
    if (err.message?.includes("stock")) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("[payment/create-order] error:", err?.message || err);
    return NextResponse.json(
      { error: "Could not create order. Please try again." },
      { status: 500 }
    );
  }

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: pendingOrder.id,
    });
  } catch (err) {
    console.error("[payment/create-order] razorpay error:", err?.message || err);
    // Don't leave an orphaned pending order behind if we couldn't even start the payment.
    await prisma.order.delete({ where: { id: pendingOrder.id } }).catch(() => {});
    return NextResponse.json(
      { error: "Could not initiate payment. Please try again." },
      { status: 502 }
    );
  }

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
