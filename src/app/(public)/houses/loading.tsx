import { SkeletonGrid, SkeletonPageHeader, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <SkeletonGrid count={3} className="grid grid-cols-3 gap-2 sm:gap-3" />
      <SkeletonGrid count={4} className="grid gap-3 sm:grid-cols-2" />
    </SkeletonScreen>
  );
}
