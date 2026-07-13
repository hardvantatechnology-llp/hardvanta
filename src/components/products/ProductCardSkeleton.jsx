// Skeleton placeholder shown while products load. Mirrors ProductCard layout.
export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(10,31,68,0.08)]">
      <div className="aspect-square animate-pulse bg-silver-light/60" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-silver-light/70" />
        <div className="h-3.5 w-full animate-pulse rounded bg-silver-light/70" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-silver-light/70" />
        <div className="mt-1 h-3 w-1/2 animate-pulse rounded bg-silver-light/70" />
        <div className="mt-1 h-5 w-1/3 animate-pulse rounded bg-silver-light/70" />
        <div className="mt-auto h-11 w-full animate-pulse rounded-xl bg-silver-light/70" />
      </div>
    </div>
  );
}
