// Skeleton placeholder shown while products load. Mirrors ProductCard layout.
function Shimmer({ className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded bg-white/10 ${className}`}>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export default function ProductCardSkeleton() {
  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-3xl">
      <Shimmer className="aspect-square !rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Shimmer className="h-2.5 w-1/3" />
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-2/3" />
        <Shimmer className="mt-1 h-3 w-1/2" />
        <Shimmer className="mt-1 h-5 w-1/3" />
        <Shimmer className="mt-auto h-11 w-full !rounded-xl" />
      </div>
    </div>
  );
}
