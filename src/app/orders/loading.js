import Skeleton from "@/components/ui/Skeleton";

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
