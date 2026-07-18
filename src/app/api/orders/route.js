// Orders API.
//   GET  /api/orders → current user's orders (newest first)
//   POST /api/orders → create order from server cart { address }
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { lockProductsForUpdate, applyStockDeltas } from "@/lib/stock";

export async function GET() {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prisma } = await import("@/lib/prisma");
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(request) {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { address } = await request.json();
  if (!address) {
    return NextResponse.json({ error: "Shipping address required." }, { status: 400 });
  }

  const { prisma } = await import("@/lib/prisma");

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
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  const COD_LIMIT = 10000;
  if (total > COD_LIMIT) {
    return NextResponse.json(
      { error: `Cash on Delivery is available only for orders up to ₹${COD_LIMIT.toLocaleString("en-IN")}. Please pay online instead.` },
      { status: 400 }
    );
  }

  let order;
  try {
    order = await prisma.$transaction(
      async (tx) => {
        // STEP 1: Row-level lock ke saath inStock check karo (single batched query)
        const lockedRows = await lockProductsForUpdate(tx, cartItems.map((it) => it.productId));
        const lockedById = new Map(lockedRows.map((p) => [p.id, p]));
        for (const it of cartItems) {
          const product = lockedById.get(it.productId);
          if (!product || product.inStock === false) {
            throw new Error(`"${it.product.name}" out of stock.`);
          }
        }

        // STEP 2: Stock decrement karo (single batched query)
        await applyStockDeltas(tx, cartItems.map((it) => ({ productId: it.productId, quantity: it.quantity })), -1);

        // STEP 3: Order banao
        const created = await tx.order.create({
          data: {
            userId,
            total,
            address,
            paymentMethod: "COD",
            items: {
              create: cartItems.map((it) => ({
                productId: it.productId,
                productName: it.product.name,
                quantity: it.quantity,
                price: it.product.salePrice ?? it.product.price,
              })),
            },
          },
          include: { items: true },
        });

        // STEP 4: Payment record banao (COD)
        await tx.payment.create({
          data: {
            orderId: created.id,
            method: "COD",
            amount: total,
            status: "PENDING",
          },
        });

        // STEP 5: Cart clear karo — scoped to exactly the products that were
        // just ordered (not a blanket delete-by-userId), so an item added to
        // the cart concurrently with this order (e.g. from another tab)
        // isn't silently wiped out along with the purchased ones.
        await tx.cartItem.deleteMany({
          where: { userId, productId: { in: cartItems.map((it) => it.productId) } },
        });

        return created;
      },
      {
        timeout: 10000,
      }
    );
  } catch (err) {
    if (err.message?.includes("out of stock")) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("[orders] error:", err?.message || err);
    return NextResponse.json({ error: "Order failed. Please try again." }, { status: 500 });
  }

  // Send confirmation email (best-effort)
  if (session.user?.email) {
    try {
      await sendOrderConfirmationEmail(session.user.email, order);
    } catch (err) {
      console.error("[orders] confirmation email failed:", err?.message || err);
    }
  }

  return NextResponse.json({ order }, { status: 201 });
}