import Skeleton from "@/components/ui/Skeleton";

export default function OrderDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-silver to-brand-bg">
      <div className="border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 py-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-48 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
