import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListDetailSkeleton() {
  return (
    <main className="min-h-screen bg-linear-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Back button skeleton */}
          <Skeleton className="h-5 w-32" />

          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-9 w-32" />
          </div>

          {/* Members skeleton */}
          <Card className="p-6">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </Card>

          {/* Tabs skeleton */}
          <div className="flex justify-between">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Items skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-5 w-5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
