import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-5" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
