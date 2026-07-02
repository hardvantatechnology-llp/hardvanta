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

  console.log("SESSION =", session);
  console.log("USER ID =", session?.user?.id);

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
}

export async function POST(request) {
  const userId = await requireUser();

  console.log("SESSION USER ID =", userId);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { prisma } = await import("@/lib/prisma");

  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("DATABASE USER =", dbUser);

  const { productId, quantity = 1 } = await request.json();

  if (!productId) {
    return NextResponse.json(
      { error: "productId required" },
      { status: 400 }
    );
  }

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
      quantity,
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
  });

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  return NextResponse.json({
    items: serialize(items),
  });
}

export async function PATCH(request) {
  const userId = await requireUser();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { productId, quantity } = await request.json();

  const { prisma } = await import("@/lib/prisma");

  if (quantity < 1) {
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  } else {
    await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity,
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
}

export async function DELETE(request) {
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
}