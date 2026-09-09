import { cn } from "@/lib/utils";

const podium: Record<number, string> = {
  1: "[background:var(--grad-gold)] text-white shadow-[var(--shadow-gold)]",
  2: "bg-gradient-to-br from-zinc-300 to-zinc-400 text-white",
  3: "bg-gradient-to-br from-amber-600 to-amber-800 text-white",
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
        "inline-flex items-center justify-center rounded-full font-display font-bold tabular",
        isPodium ? podium[value] : "bg-kerala-soft text-kerala-dark",
        className ?? "h-11 w-11 text-lg",
      )}
    >
      {value || "—"}
    </span>
  );
}
