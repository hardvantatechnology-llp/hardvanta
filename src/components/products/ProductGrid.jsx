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
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-silver py-16 text-center">
        <PackageSearch size={40} className="text-silver-dark" />
        <p className="font-semibold text-navy">No products found</p>
        <p className="text-sm text-silver-dark">
          Try a different category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
