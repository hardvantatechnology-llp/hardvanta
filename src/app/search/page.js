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
    title:       q ? `"${q}" — Search Results | Hardvanta` : "Search | Hardvanta",
    description: `Search results for ${q} on Hardvanta — India's electronics & robotics store.`,
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
    include: {
      category: true,
      brand:    true,
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
    <main className="min-h-screen bg-gradient-to-b from-graphite to-obsidian">

      {/* ── Header bar ── */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-obsidian/80 backdrop-blur-xl">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          {query ? (
            <p className="text-sm text-white/70">
              <span className="font-bold text-white">{products.length}</span>
              <span className="text-white/40"> results for </span>
              <span className="font-semibold text-electric-light">&quot;{query}&quot;</span>
            </p>
          ) : (
            <p className="text-sm text-white/40">Enter a search term above</p>
          )}

          <div className="flex items-center gap-3">
            {products.length > 0 && (
              <SortDropdown current={sort || "relevance"} searchParams={searchParams} basePath="/search" />
            )}
            <Link
              href="/products"
              className="text-xs font-medium text-electric-light underline-offset-2 hover:underline"
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
                  className="glass rounded-full px-3 py-1.5 text-xs
                             font-medium text-white/70 hover:text-white hover:shadow-glow-electric transition-all"
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
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
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-electric/20 to-liquid/20 shadow-glow-electric">
        <Search size={28} className="text-electric-light" />
      </div>
      <h2 className="mb-2 text-lg font-bold text-white">{title}</h2>
      <p className="text-sm text-white/50">{body}</p>
      {children}
    </div>
  );
}
