import { Skeleton, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card flex items-start gap-3 p-4">
            <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonScreen>
  );
}
