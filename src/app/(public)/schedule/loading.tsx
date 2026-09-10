import {
  SkeletonFilterBar,
  SkeletonPageHeader,
  SkeletonRows,
  SkeletonScreen,
} from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SkeletonScreen>
      <SkeletonPageHeader />
      <SkeletonFilterBar />
      <SkeletonRows count={6} />
    </SkeletonScreen>
  );
}
