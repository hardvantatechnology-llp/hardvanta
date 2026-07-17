// Server-side data access – used by Server Components to read directly from DB
import { categories, products } from "./data";

// Dummy/in-memory fallback is a local-dev-only convenience (e.g. running
// against `DATABASE_URL="file:..."` without a real Postgres instance). It is
// hard-disabled outside development so a misconfigured env var in production
// can never silently switch the storefront to fake data.
const useDummy =
  process.env.NODE_ENV !== "production" &&
  (process.env.USE_DUMMY_DB === "true" ||
    (process.env.DATABASE_URL &&
      process.env.DATABASE_URL.startsWith("file:")));

function slugify(str = "") {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

const productInclude = {
  category: true,
  brand: true,
  inventory: true,
};

async function db() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

/* -------------------- FEATURED -------------------- */
export async function getFeaturedProducts(limit = 12) {
  if (useDummy) {
    return products.filter((p) => p.featured && p.active !== false).slice(0, limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: { featured: true, active: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

/* -------------------- DEALS -------------------- */
export async function getDeals(limit = 4) {
  if (useDummy) {
    return products
      .filter((p) => p.salePrice != null && p.active !== false)
      .slice(0, limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: { salePrice: { not: null }, active: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

/* -------------------- ALL PRODUCTS -------------------- */
export async function getAllProducts({ page = 1, limit = 24 } = {}) {
  if (useDummy) {
    const start = (page - 1) * limit;
    return products
      .filter((p) => p.active !== false)
      .slice(start, start + limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: { active: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
}

/* -------------------- SEARCH -------------------- */
export async function searchProducts(q = "", { page = 1, limit = 24 } = {}) {
  const query = q.toLowerCase();
  if (useDummy) {
    const start = (page - 1) * limit;
    return products
      .filter(
        (p) =>
          p.active !== false &&
          (p.name + " " + p.brand + " " + p.description).toLowerCase().includes(query)
      )
      .slice(start, start + limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
}

/* -------------------- CATEGORY -------------------- */
export async function getProductsByCategory(categorySlug, { page = 1, limit = 24 } = {}) {
  if (useDummy) {
    const start = (page - 1) * limit;
    return products
      .filter((p) => p.category === categorySlug && p.active !== false)
      .slice(start, start + limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: { category: { slug: categorySlug }, active: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });
}

/* -------------------- CATEGORIES -------------------- */
export async function getCategories() {
  if (useDummy) return categories;
  const prisma = await db();
  return prisma.category.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
}

/* -------------------- SINGLE PRODUCT -------------------- */
export async function getProductById(idOrSlug) {
  if (useDummy) {
    const byId = products.find((p) => p.id === idOrSlug && p.active !== false);
    if (byId) return byId;
    return products.find((p) => slugify(p.name) === idOrSlug && p.active !== false);
  }
  const prisma = await db();
  return prisma.product.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], active: true },
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
export async function getRelatedProducts(categorySlug, excludeId, limit = 4) {
  if (useDummy) {
    return products
      .filter((p) =>
        (p.category === categorySlug || p.category?.slug === categorySlug) &&
        p.id !== excludeId &&
        p.active !== false
      )
      .slice(0, limit);
  }
  const prisma = await db();
  return prisma.product.findMany({
    where: {
      category: { slug: categorySlug },
      NOT: { id: excludeId },
      active: true,
    },
    include: productInclude,
    take: limit,
  });
}
