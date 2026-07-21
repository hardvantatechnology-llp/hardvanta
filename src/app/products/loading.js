import { ProductGridSkeleton } from "@/components/products/ProductGrid";

export default function LoadingProducts() {
  return (
    <div className="bg-gradient-to-b from-graphite to-obsidian">
      <div className="container-page py-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
