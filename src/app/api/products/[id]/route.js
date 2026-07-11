// GET /api/products/[id] — single product by id or slug.
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = params;
  const { prisma } = await import("@/lib/prisma");
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      category: true,
      brand: true,
    },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

// PUT /api/products/[id] — update a product (admin only).
export async function PUT(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const { prisma } = await import("@/lib/prisma");
  const data = {};

  if (body.name !== undefined) data.name = body.name;

  if (body.sku !== undefined) {
    const existingSku = await prisma.product.findFirst({
      where: {
        sku: body.sku,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingSku) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }

    data.sku = body.sku;
  }

  if (body.description !== undefined)
    data.description = body.description;

  if (body.image !== undefined)
    data.image = body.image;

  if (body.price !== undefined)
    data.price = Number(body.price);

  if (body.salePrice !== undefined)
    data.salePrice =
      body.salePrice !== null &&
      body.salePrice !== undefined &&
      body.salePrice !== ""
        ? Number(body.salePrice)
        : null;

  if (body.stock !== undefined)
    data.stock = Number(body.stock);

  if (body.featured !== undefined)
    data.featured = Boolean(body.featured);

  if (body.categoryId) {
    data.category = {
      connect: {
        id: body.categoryId,
      },
    };
  }

  if (body.brandId) {
    data.brand = {
      connect: {
        id: body.brandId,
      },
    };
  }

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { prisma } = await import("@/lib/prisma");
  try {
    const orderCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });

    if (orderCount > 0) {
      // Orders hain toh sirf deactivate karo
      await prisma.product.update({
        where: { id: params.id },
        data: { active: false },
      });
      return NextResponse.json({
        ok: true,
        message: "Product deactivated because it has existing orders.",
      });
    }

    // Koi orders nahi toh seedha delete karo
    await prisma.cartItem.deleteMany({ where: { productId: params.id } });
    await prisma.wishlist.deleteMany({ where: { productId: params.id } });
    await prisma.review.deleteMany({ where: { productId: params.id } });
    await prisma.inventory.deleteMany({ where: { productId: params.id } });
    await prisma.product.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}