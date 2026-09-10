import { Skeleton, SkeletonPageHeader, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <Skeleton className="aspect-video border-b-[var(--border-w)] border-fest-ink" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonScreen>
  );
}
