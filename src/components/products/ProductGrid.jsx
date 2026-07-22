import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

// Responsive grid: 2 cols (mobile & tablet), 4 cols (desktop),
// equal-height cards (auto-rows-fr), consistent 16px gap.
const GRID = "grid grid-cols-2 gap-4 lg:grid-cols-4 auto-rows-fr";

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ProductGrid({ products, loading = false }) {
  if (loading) return <ProductGridSkeleton />;

  if (!products?.length) {
    return (
      <div className="glass-brand-card flex flex-col items-center gap-3 rounded-3xl py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-navy/20 shadow-brand-glow">
          <PackageSearch size={30} className="text-brand-blue" />
        </div>
        <p className="font-semibold text-brand-text">No products found</p>
        <p className="text-sm text-brand-muted">
          Try a different category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {products.map((p, i) => (
        // First row (above the fold on most viewports) skips lazy-loading so
        // it doesn't compete with the LCP image for priority.
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
