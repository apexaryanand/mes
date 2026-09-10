import { Skeleton, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-4 w-48" />
      <div className="mx-auto w-full max-w-3xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-full" />
        <Skeleton className="mt-2 h-10 w-2/3" />
        <div className="mt-6 flex items-center gap-3 border-y-2 border-fest-ink py-4">
          <Skeleton className="h-9 w-9 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        </div>
        <div className="mt-8 grid gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4" style={{ width: `${100 - (i % 4) * 8}%` }} />
          ))}
        </div>
      </div>
    </SkeletonScreen>
  );
}
