// Orders API.
//   GET  /api/orders → current user's orders (newest first)
//   POST /api/orders → create order from server cart { address }
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

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

  let order;
  try {
    order = await prisma.$transaction(
      async (tx) => {
        // STEP 1: Row-level lock ke saath stock check karo
        for (const it of cartItems) {
          const rows = await tx.$queryRaw`
            SELECT id, stock, name
            FROM "Product"
            WHERE id = ${it.productId}
            FOR UPDATE
          `;
          const product = rows[0];
          if (!product || product.stock < it.quantity) {
            throw new Error(`"${it.product.name}" out of stock.`);
          }
        }

        // STEP 2: Stock decrement karo
        for (const it of cartItems) {
          await tx.product.update({
            where: { id: it.productId },
            data: { stock: { decrement: it.quantity } },
          });
        }

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

        // STEP 4: ✅ Payment record banao (COD)
        await tx.payment.create({
          data: {
            orderId: created.id,
            method: "COD",
            amount: total,
            status: "PENDING",
          },
        });

        // STEP 5: Cart clear karo
        await tx.cartItem.deleteMany({ where: { userId } });

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