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
    <div className="card p-4" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="mt-2 h-3" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}
