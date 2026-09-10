import { SkeletonGrid, SkeletonPageHeader, SkeletonScreen } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <SkeletonGrid count={9} />
    </SkeletonScreen>
  );
}
