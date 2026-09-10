import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid gap-5 sm:gap-8 md:gap-10" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      {/* Holds the hero's bleed and height so the page does not jump on arrival. */}
      <section className="festival-hero relative -mt-3 mx-[calc(50%-50vw)] w-screen overflow-hidden sm:-mt-6">
        <div className="festival-streamer" aria-hidden="true">
          <span>കലോത്സവം</span>
          <span>LET THE ARTS ROAR</span>
          <span>കലോത്സവം</span>
          <span>LET THE ARTS ROAR</span>
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-3 pb-8 pt-12 sm:px-4 sm:pb-16 sm:pt-16 md:px-6">
          <Skeleton className="h-7 w-40 opacity-20" />
          <Skeleton className="mt-7 h-[clamp(3rem,11vw,7rem)] w-3/4 max-w-2xl opacity-20" />
          <Skeleton className="mt-5 h-8 w-2/3 max-w-xl opacity-20" />
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 opacity-20" />
            ))}
          </div>
        </div>
      </section>
      <Skeleton className="h-8 w-56" />
      <SkeletonGrid count={3} />
      <Skeleton className="h-8 w-56" />
      <SkeletonGrid count={3} />
    </div>
  );
}
