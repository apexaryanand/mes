import {
  Skeleton,
  SkeletonPageHeader,
  SkeletonRows,
  SkeletonScreen,
} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <div className="card grid gap-3 p-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11" />
        ))}
      </div>
      <SkeletonRows count={5} />
    </SkeletonScreen>
  );
}
