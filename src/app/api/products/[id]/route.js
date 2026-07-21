// GET /api/products/[id] — single product by id or slug.
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
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

  // Replace the whole gallery when an images array is supplied.
  if (Array.isArray(body.images)) {
    data.image = body.images[0] ?? body.image ?? null;
    data.images = {
      deleteMany: {},
      create: body.images.map((imageUrl) => ({ imageUrl })),
    };
  }

  if (body.price !== undefined) {
    const priceNum = Number(body.price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number." }, { status: 400 });
    }
    data.price = priceNum;
  }

  if (body.salePrice !== undefined) {
    if (body.salePrice !== null && body.salePrice !== "") {
      const salePriceNum = Number(body.salePrice);
      if (!Number.isFinite(salePriceNum) || salePriceNum < 0) {
        return NextResponse.json({ error: "Sale price must be a non-negative number." }, { status: 400 });
      }
      data.salePrice = salePriceNum;
    } else {
      data.salePrice = null;
    }
  }

  if (body.stock !== undefined) {
    const stockNum = Number(body.stock);
    if (!Number.isInteger(stockNum) || stockNum < 0) {
      return NextResponse.json({ error: "Stock must be a non-negative whole number." }, { status: 400 });
    }
    data.stock = stockNum;
  }

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
    revalidateTag("products");
    return NextResponse.json({ product });
  } catch (err) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "field";
      return NextResponse.json(
        { error: `A product with this ${target} already exists.` },
        { status: 409 }
      );
    }
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    console.error(err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
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
      revalidateTag("products");
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

    revalidateTag("products");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}