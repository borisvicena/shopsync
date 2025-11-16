import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Controls skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-10 w-full sm:max-w-xs" />
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Tabs skeleton */}
          <Skeleton className="h-10 w-full max-w-md" />

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
