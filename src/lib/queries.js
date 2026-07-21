// Server-side data access – used by Server Components to read directly from DB
import { unstable_cache } from "next/cache";
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

// Lean shape for grid/card views (ProductCard/ProductGrid) — only the fields
// those components actually render. Cuts payload vs. the old `include` of
// full category+brand+inventory rows (inventory was never even read).
const productCardSelect = {
  id: true,
  name: true,
  image: true,
  price: true,
  salePrice: true,
  inStock: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
  brand: { select: { name: true } },
};

async function db() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

/* -------------------- FEATURED -------------------- */
export const getFeaturedProducts = unstable_cache(
  async function getFeaturedProducts(limit = 12) {
    if (useDummy) {
      return products.filter((p) => p.featured && p.active !== false).slice(0, limit);
    }
    const prisma = await db();
    return prisma.product.findMany({
      where: { featured: true, active: true },
      select: productCardSelect,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },
  ["getFeaturedProducts"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- DEALS -------------------- */
export const getDeals = unstable_cache(
  async function getDeals(limit = 4) {
    if (useDummy) {
      return products
        .filter((p) => p.salePrice != null && p.active !== false)
        .slice(0, limit);
    }
    const prisma = await db();
    return prisma.product.findMany({
      where: { salePrice: { not: null }, active: true },
      select: productCardSelect,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },
  ["getDeals"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- ALL PRODUCTS -------------------- */
export const getAllProducts = unstable_cache(
  async function getAllProducts({ page = 1, limit = 24 } = {}) {
    if (useDummy) {
      const start = (page - 1) * limit;
      return products
        .filter((p) => p.active !== false)
        .slice(start, start + limit);
    }
    const prisma = await db();
    return prisma.product.findMany({
      where: { active: true },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });
  },
  ["getAllProducts"],
  { revalidate: 60, tags: ["products"] }
);

export const countAllProducts = unstable_cache(
  async function countAllProducts() {
    if (useDummy) return products.filter((p) => p.active !== false).length;
    const prisma = await db();
    return prisma.product.count({ where: { active: true } });
  },
  ["countAllProducts"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- SEARCH -------------------- */
function searchWhere(q) {
  const query = q.toLowerCase();
  return {
    active: true,
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { brand: { name: { contains: query, mode: "insensitive" } } },
    ],
  };
}

export const searchProducts = unstable_cache(
  async function searchProducts(q = "", { page = 1, limit = 24 } = {}) {
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
      where: searchWhere(q),
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });
  },
  ["searchProducts"],
  { revalidate: 60, tags: ["products"] }
);

export const countSearchProducts = unstable_cache(
  async function countSearchProducts(q = "") {
    const query = q.toLowerCase();
    if (useDummy) {
      return products.filter(
        (p) =>
          p.active !== false &&
          (p.name + " " + p.brand + " " + p.description).toLowerCase().includes(query)
      ).length;
    }
    const prisma = await db();
    return prisma.product.count({ where: searchWhere(q) });
  },
  ["countSearchProducts"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- CATEGORY -------------------- */
export const getProductsByCategory = unstable_cache(
  async function getProductsByCategory(categorySlug, { page = 1, limit = 24 } = {}) {
    if (useDummy) {
      const start = (page - 1) * limit;
      return products
        .filter((p) => p.category === categorySlug && p.active !== false)
        .slice(start, start + limit);
    }
    const prisma = await db();
    return prisma.product.findMany({
      where: { category: { slug: categorySlug }, active: true },
      select: productCardSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });
  },
  ["getProductsByCategory"],
  { revalidate: 60, tags: ["products"] }
);

export const countProductsByCategory = unstable_cache(
  async function countProductsByCategory(categorySlug) {
    if (useDummy) {
      return products.filter((p) => p.category === categorySlug && p.active !== false).length;
    }
    const prisma = await db();
    return prisma.product.count({
      where: { category: { slug: categorySlug }, active: true },
    });
  },
  ["countProductsByCategory"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- CATEGORIES -------------------- */
export const getCategories = unstable_cache(
  async function getCategories() {
    if (useDummy) return categories;
    const prisma = await db();
    return prisma.category.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  },
  ["getCategories"],
  { revalidate: 300, tags: ["categories"] }
);

/* -------------------- SINGLE PRODUCT -------------------- */
export const getProductById = unstable_cache(
  async function getProductById(idOrSlug) {
    if (useDummy) {
      const byId = products.find((p) => p.id === idOrSlug && p.active !== false);
      if (byId) return byId;
      return products.find((p) => slugify(p.name) === idOrSlug && p.active !== false);
    }
    const prisma = await db();
    return prisma.product.findFirst({
      where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }], active: true },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        salePrice: true,
        inStock: true,
        rating: true,
        reviewCount: true,
        image: true,
        category: { select: { name: true, slug: true } },
        brand: { select: { name: true } },
        images: { select: { imageUrl: true } },
      },
    });
  },
  ["getProductById"],
  { revalidate: 60, tags: ["products"] }
);

/* -------------------- RELATED PRODUCTS -------------------- */
export const getRelatedProducts = unstable_cache(
  async function getRelatedProducts(categorySlug, excludeId, limit = 4) {
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
      select: productCardSelect,
      take: limit,
    });
  },
  ["getRelatedProducts"],
  { revalidate: 60, tags: ["products"] }
);
