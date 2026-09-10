import { Skeleton, SkeletonRows, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-4 w-56" />
      <div className="border-[var(--border-w)] border-fest-ink bg-fest-ink p-5 shadow-[var(--shadow-hard)] sm:p-6 md:p-8">
        <Skeleton className="h-7 w-24 opacity-25" />
        <Skeleton className="mt-4 h-10 w-3/4 opacity-25" />
        <Skeleton className="mt-3 h-5 w-1/3 opacity-25" />
      </div>
      <SkeletonRows count={4} />
    </SkeletonScreen>
  );
}
