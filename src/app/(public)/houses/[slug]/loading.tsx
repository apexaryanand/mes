import { Skeleton, SkeletonRows, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-4 w-48" />
      <div className="card flex flex-wrap items-center gap-4 p-5">
        <Skeleton className="h-16 w-16 shrink-0" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-8 w-48 max-w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 border-2 border-fest-ink" />
        ))}
      </div>
      <SkeletonRows count={5} />
    </SkeletonScreen>
  );
}
