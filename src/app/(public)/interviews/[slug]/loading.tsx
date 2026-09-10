import { Skeleton, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-64 max-w-full" />
      <Skeleton className="aspect-video w-full border-[var(--border-w)] border-fest-ink" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </SkeletonScreen>
  );
}
