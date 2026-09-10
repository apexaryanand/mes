import { Skeleton } from "@/components/ui/skeleton";

// One boundary for the whole console: every screen here is a header plus a
// table or panel list, so a shared placeholder matches all of them.
export default function Loading() {
  return (
    <div className="grid gap-4 sm:gap-6" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-56 max-w-full" />
      <div className="card divide-y-2 divide-fest-ink/15 overflow-hidden">
        <Skeleton className="h-11 rounded-none" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24 shrink-0" />
            <Skeleton className="h-7 w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
