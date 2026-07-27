// FILE: src/app/search/page.js
//
// Full search results page — Flipkart style
// Route: /search?q=<term>
//
// • Server component — fetches products directly via Prisma (no extra API hop)
// • Uses your existing <ProductCard> and <ProductGrid> exactly as-is
// • Tailwind classes match the premium dark glass design system

import { prisma }      from "@/lib/prisma";
import ProductCard     from "@/components/products/ProductCard";
import SortDropdown    from "@/components/products/SortDropdown";
import { sortProducts } from "@/utils/sortProducts";
import { Search }      from "lucide-react";
import Link            from "next/link";

// ── Meta ─────────────────────────────────────────────────────────────────────
export function generateMetadata({ searchParams }) {
  const q = searchParams?.q?.trim() || "";
  return {
    title:       q ? `"${q}" — Search Results | HV KART` : "Search | HV KART",
    description: `Search results for ${q} on HV KART — India's electronics & robotics store.`,
  };
}

// ── Data fetching (server-side, direct Prisma) ────────────────────────────────
async function searchProducts(q) {
  if (!q?.trim()) return [];

  return prisma.product.findMany({
    where: {
      OR: [
        { name:        { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { sku:         { contains: q, mode: "insensitive" } },
        { brand:    { name: { contains: q, mode: "insensitive" } } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    // ProductCard only reads these fields — no need for full category/brand rows.
    select: {
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
    },
    orderBy: { createdAt: "desc" },
    take: 60,   // max 60 results per search
  });
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function SearchPage({ searchParams }) {
  const query    = searchParams?.q?.trim() || "";
  const sort     = searchParams?.sort;
  const raw      = await searchProducts(query);
  const products = sortProducts(raw, sort);

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-bg to-brand-silver">

      {/* ── Header bar ── */}
      <div className="sticky top-0 z-10 border-b border-brand-border bg-white/80 backdrop-blur-xl">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          {query ? (
            <p className="text-sm text-brand-muted">
              <span className="font-bold text-brand-text">{products.length}</span>
              <span className="text-brand-muted"> results for </span>
              <span className="font-semibold text-brand-blue">&quot;{query}&quot;</span>
            </p>
          ) : (
            <p className="text-sm text-brand-muted">Enter a search term above</p>
          )}

          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <SortDropdown current={sort || "relevance"} searchParams={searchParams} basePath="/search" />
            )}
            <Link
              href="/products"
              className="text-xs font-medium text-brand-blue underline-offset-2 hover:underline"
            >
              Browse all products →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container-page py-6">

        {/* No query */}
        {!query && (
          <EmptyState
            title="What are you looking for?"
            body="Use the search bar above to find Arduino boards, sensors, motors and more."
          />
        )}

        {/* No results */}
        {query && products.length === 0 && (
          <EmptyState
            title={`No results for "${query}"`}
            body="Check your spelling, try a shorter word, or browse by category."
          >
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Arduino", "ESP32", "Raspberry Pi", "Sensors", "Motors"].map((s) => (
                <Link
                  key={s}
                  href={`/search?q=${encodeURIComponent(s)}`}
                  className="glass-brand rounded-full px-3 py-1.5 text-xs
                             font-medium text-brand-muted hover:text-brand-text hover:shadow-brand-glow transition-all"
                >
                  {s}
                </Link>
              ))}
            </div>
          </EmptyState>
        )}

        {/* Results grid — uses your existing ProductCard exactly */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 6} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// ── Reusable empty-state block ────────────────────────────────────────────────
function EmptyState({ title, body, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow">
        <Search size={28} className="text-brand-blue" />
      </div>
      <h2 className="mb-2 text-lg font-bold text-brand-text">{title}</h2>
      <p className="text-sm text-brand-muted">{body}</p>
      {children}
    </div>
  );
}
