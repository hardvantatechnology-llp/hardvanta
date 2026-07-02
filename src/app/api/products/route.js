// GET /api/products?category=<slug>&featured=true&q=<search>
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");

  const where = {};
  if (category) {
    where.category = {
      slug: category,
    };
  }
  if (featured === "true") where.featured = true;
  if (q) {
    where.OR = [
      {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        brand: {
          name: {
            contains: q,
            mode: "insensitive",
          },
        },
      },
    ];
  }

  const { prisma } = await import("@/lib/prisma");
  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      brand: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

// POST /api/products — create a product (admin only).
export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const {
    name,
    description,
    price,
    salePrice,
    stock,
    image,
    featured,
    categoryId,
    brandId,
    sku,
  } = body;

  if (
    !name ||
    !description ||
    !price ||
    !categoryId ||
    !brandId ||
    !sku ||
    !image
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  let slug = slugify(name);
  // Ensure slug is unique.
  const { prisma } = await import("@/lib/prisma");
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  // Ensure SKU is unique.
  const existingSku = await prisma.product.findUnique({
    where: {
      sku,
    },
  });

  if (existingSku) {
    return NextResponse.json(
      { error: "SKU already exists" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      slug,
      sku,
      name,
      description,
      price: Number(price),
      salePrice:
        salePrice !== null &&
        salePrice !== undefined &&
        salePrice !== ""
          ? Number(salePrice)
          : null,
      stock: Number(stock),
      image,
      featured: Boolean(featured),

      category: {
        connect: {
          id: categoryId,
        },
      },

      brand: {
        connect: {
          id: brandId,
        },
      },
    },
  });
  return NextResponse.json({ product }, { status: 201 });
}