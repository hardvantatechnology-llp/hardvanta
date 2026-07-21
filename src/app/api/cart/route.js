// Cart API — server-side cart for logged-in users.
//   GET    /api/cart            → list cart items
//   POST   /api/cart            → add product
//   PATCH  /api/cart            → update quantity
//   DELETE /api/cart?productId= → remove product

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

async function requireUser() {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  return session?.user?.id ?? null;
}

// Only the fields the cart UI actually renders — avoids pulling full Product
// rows (description, sku, rating, etc.) on every cart read/mutation.
const cartProductSelect = {
  id: true,
  name: true,
  price: true,
  salePrice: true,
  image: true,
  slug: true,
  stock: true,
  brand: { select: { name: true } },
};

function serialize(items) {
  return items.map((it) => ({
    id: it.product.id,
    name: it.product.name,
    price: it.product.price,
    salePrice: it.product.salePrice,
    image: it.product.image,
    slug: it.product.slug,
    stock: it.product.stock,
    brand: it.product.brand,
    quantity: it.quantity,
  }));
}

async function loadCart(prisma, userId) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    select: { quantity: true, product: { select: cartProductSelect } },
  });
  return serialize(items);
}

export async function GET() {
  try {
    const userId = await requireUser();

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const { prisma } = await import("@/lib/prisma");

    return NextResponse.json({
      items: await loadCart(prisma, userId),
    });
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await requireUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(quantity) || !Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "quantity must be a positive integer" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Atomic increment — avoids a read-then-write race between two concurrent
    // "add to cart" requests for the same item (the old read-modify-write via
    // a separate findUnique could lose an update under concurrent requests).
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity },
      update: { quantity: { increment: quantity } },
    });

    return NextResponse.json({
      items: await loadCart(prisma, userId),
    });
  } catch (err) {
    console.error("POST /api/cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const userId = await requireUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(quantity) || !Number.isInteger(quantity)) {
      return NextResponse.json(
        { error: "quantity must be an integer" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    if (quantity < 1) {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId,
        },
      });
    } else {
      // A single scoped updateMany replaces the old find-product /
      // find-cart-item / update sequence — the product is guaranteed to
      // exist if the cart item does (Product→CartItem is an onDelete:
      // Cascade relation), so there's nothing left to check separately.
      const { count } = await prisma.cartItem.updateMany({
        where: { userId, productId },
        data: { quantity: Math.max(1, quantity) },
      });
      if (count === 0) {
        return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
      }
    }

    return NextResponse.json({
      items: await loadCart(prisma, userId),
    });
  } catch (err) {
    console.error("PATCH /api/cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await requireUser();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const { prisma } = await import("@/lib/prisma");

    if (productId) {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId,
        },
      });
      return NextResponse.json({
        items: await loadCart(prisma, userId),
      });
    }

    // Clearing the whole cart — the result is always empty, so there's no
    // need to re-query the (now-deleted) rows just to serialize them back.
    await prisma.cartItem.deleteMany({ where: { userId } });
    return NextResponse.json({ items: [] });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}