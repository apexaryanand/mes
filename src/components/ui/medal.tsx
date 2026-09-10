import { cn } from "@/lib/utils";

const podium: Record<number, string> = {
  1: "bg-fest-yellow text-fest-ink",
  2: "bg-[#d6d3cd] text-fest-ink",
  3: "bg-[#d9915b] text-fest-ink",
};

export function Medal({
  rank,
  className,
}: {
  rank: number | null | undefined;
  className?: string;
}) {
  const value = rank ?? 0;
  const isPodium = value >= 1 && value <= 3;
  return (
    <span
      className={cn(
        "font-display tabular inline-flex shrink-0 items-center justify-center border-2 border-fest-ink font-black",
        isPodium
          ? cn(podium[value], "shadow-[var(--shadow-hard-xs)]")
          : "bg-paper text-muted",
        className ?? "h-11 w-11 text-lg",
      )}
    >
      {value || "—"}
    </span>
  );
}
