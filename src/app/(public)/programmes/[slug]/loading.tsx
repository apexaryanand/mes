import { Skeleton, SkeletonRows, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-9 w-64 max-w-full" />
      <SkeletonRows count={5} />
    </SkeletonScreen>
  );
}
