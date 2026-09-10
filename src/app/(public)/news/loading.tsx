import {
  Skeleton,
  SkeletonGrid,
  SkeletonPageHeader,
  SkeletonScreen,
} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <div className="card grid gap-4 overflow-hidden md:grid-cols-2">
        <Skeleton className="min-h-44 md:min-h-full" />
        <div className="p-5 sm:p-6">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="mt-4 h-8 w-full" />
          <Skeleton className="mt-2 h-8 w-2/3" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
        </div>
      </div>
      <SkeletonGrid count={3} />
    </SkeletonScreen>
  );
}
