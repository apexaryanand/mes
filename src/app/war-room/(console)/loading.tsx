import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-5" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div className="flex items-end justify-between gap-4 border-b-2 border-fest-ink/15 pb-4">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="card festival-table-card overflow-hidden">
        <Skeleton className="h-10 rounded-none" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-t-2 border-fest-ink/10 px-4 py-2.5">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
