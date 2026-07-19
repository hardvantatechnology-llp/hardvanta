// Next.js App Router convention — generates /sitemap.xml at build/request time.
import { prisma } from "@/lib/prisma";

// Public marketing/informational pages — account-gated routes (cart,
// checkout, orders, account, wishlist, compare, admin, search, login,
// register) are intentionally excluded, matching src/app/robots.js.
const STATIC_ROUTES = [
  "",
  "/products",
  "/about",
  "/contact",
  "/b2b",
  "/bulk-enquiry",
  "/atl-kits-enquiry",
  "/blogs",
  "/faq",
  "/careers",
  "/csr",
  "/ewaste",
  "/investor-relations",
  "/payment-options",
  "/privacy-policy",
  "/shipping-refund",
  "/terms",
  "/sell",
  "/tools",
  "/videos",
];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const [products, blogs, categories] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { id: true, updatedAt: true } }),
    prisma.blog.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productEntries = products.map((p) => ({
    url: `${base}/products/${p.id}`,
    lastModified: p.updatedAt,
  }));

  const categoryEntries = categories.map((c) => ({
    url: `${base}/products?category=${c.slug}`,
    lastModified: c.updatedAt,
  }));

  const blogEntries = blogs.map((b) => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: b.updatedAt,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries, ...blogEntries];
}
