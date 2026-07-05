// Server-side data access – used by Server Components to read directly from DB

import { prisma } from "@/lib/prisma";
import { categories, products } from "./data";

const useDummy =
  process.env.USE_DUMMY_DB === "true" ||
  (process.env.DATABASE_URL &&
    process.env.DATABASE_URL.startsWith("file:"));

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Yeh include har jagah use hoga — stock hamesha aayega
const productInclude = {
  category: true,
  brand: true,
  inventory: true,
};

/* -------------------- FEATURED -------------------- */
export async function getFeaturedProducts() {
  if (useDummy) return products.filter((p) => p.featured);

  return prisma.product.findMany({
    where: { featured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

/* -------------------- DEALS -------------------- */
export async function getDeals(limit = 4) {
  if (useDummy)
    return products.filter((p) => p.salePrice != null).slice(0, limit);

  return prisma.product.findMany({
    where: {
      salePrice: { not: null },
    },
    include: productInclude, // ✅ stock ab aayega
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

/* -------------------- ALL PRODUCTS -------------------- */
export async function getAllProducts() {
  if (useDummy) return products;

  return prisma.product.findMany({
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
}

/* -------------------- SEARCH -------------------- */
export async function searchProducts(q = "") {
  const query = q.toLowerCase();

  if (useDummy) {
    return products.filter((p) =>
      (p.name + " " + p.brand + " " + p.description)
        .toLowerCase()
        .includes(query)
    );
  }

  return prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          brand: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: productInclude, // ✅ stock ab aayega
  });
}

/* -------------------- CATEGORY -------------------- */
export async function getProductsByCategory(categorySlug) {
  if (useDummy)
    return products.filter((p) => p.category === categorySlug);

  return prisma.product.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
    },
    include: productInclude, // ✅ stock ab aayega
  });
}

/* -------------------- CATEGORIES -------------------- */
export async function getCategories() {
  if (useDummy) return categories;

  return prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

/* -------------------- SINGLE PRODUCT -------------------- */
export async function getProductById(idOrSlug) {
  if (useDummy) {
    const byId = products.find((p) => p.id === idOrSlug);
    if (byId) return byId;

    return products.find((p) => slugify(p.name) === idOrSlug);
  }

  return prisma.product.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: true,
      brand: true,
      inventory: true,
      images: true,
      variants: true,
      reviews: true,
    },
  });
}

/* -------------------- RELATED PRODUCTS -------------------- */
export async function getRelatedProducts(
  categorySlug,
  excludeId,
  limit = 4
) {
  if (useDummy)
    return products
      .filter(
        (p) =>
          (p.category === categorySlug ||
            p.category?.slug === categorySlug) &&
          p.id !== excludeId
      )
      .slice(0, limit);

  return prisma.product.findMany({
    where: {
      category: {
        slug: categorySlug,
      },
      NOT: { id: excludeId },
    },
    include: productInclude, // ✅ stock ab aayega
    take: limit,
  });
}