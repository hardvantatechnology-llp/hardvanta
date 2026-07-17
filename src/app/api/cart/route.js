// Cart API — server-side cart for logged-in users.
//   GET    /api/cart            → list cart items
//   POST   /api/cart            → add product
//   PATCH  /api/cart            → update quantity
//   DELETE /api/cart?productId= → remove product

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

const MAX_QUANTITY = 99;

async function requireUser() {
  const { getAuthOptions } = await import("@/lib/auth");
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  return session?.user?.id ?? null;
}

function serialize(items) {
  return items.map((it) => ({
    id: it.product.id,
    name: it.product.name,
    price: it.product.price,
    salePrice: it.product.salePrice,
    image: it.product.image,
    slug: it.product.slug,
    stock: it.product.stock,
    quantity: it.quantity,
  }));
}

export async function GET() {
  try {
    const userId = await requireUser();

    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const { prisma } = await import("@/lib/prisma");

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json({
      items: serialize(items),
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

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const ceiling = Math.min(product.stock, MAX_QUANTITY);

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    const newQuantity = Math.max(1, Math.min((existing?.quantity ?? 0) + quantity, ceiling));

    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      create: {
        userId,
        productId,
        quantity: newQuantity,
      },
      update: {
        quantity: newQuantity,
      },
    });

    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    return NextResponse.json({
      items: serialize(items),
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
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const clampedQuantity = Math.min(quantity, product.stock, MAX_QUANTITY);
      const existing = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });
      if (!existing) {
        return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
      }
      await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        data: {
          quantity: clampedQuantity,
        },
      });
    }

    const items = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      items: serialize(items),
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
    } else {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
        },
      });
    }

    const items = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json({
      items: serialize(items),
    });
  } catch (err) {
    console.error("DELETE /api/cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}