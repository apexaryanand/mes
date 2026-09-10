import { Skeleton, SkeletonPageHeader, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <Skeleton className="aspect-video border-b-[var(--border-w)] border-fest-ink" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonScreen>
  );
}
