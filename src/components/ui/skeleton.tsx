import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <span className={cn("skeleton block", className)} style={style} aria-hidden />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="mt-2 h-3" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

/**
 * The placeholders below mirror the real page shapes so the skeleton does not
 * jump when the server tree arrives. Each screen wraps them in one live region
 * rather than announcing every block.
 */
export function SkeletonScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-5 sm:gap-8" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      {children}
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="festival-page-header">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-64 max-w-full" />
    </div>
  );
}

export function SkeletonGrid({
  count = 6,
  className = "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="card divide-y-2 divide-fest-ink/15 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3.5 sm:gap-4 sm:px-4">
          <Skeleton className="h-8 w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-2 h-3 w-1/3" />
          </div>
          <Skeleton className="h-7 w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonFilterBar({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>
  );
}
