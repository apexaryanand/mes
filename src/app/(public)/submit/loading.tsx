import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-lg gap-5" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <div>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-9 w-64 max-w-full" />
      </div>
      <div className="card grid gap-4 p-5 sm:p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-11 w-full" />
          </div>
        ))}
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
