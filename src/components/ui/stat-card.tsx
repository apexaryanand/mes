import { cn } from "@/lib/utils";

type Accent = "green" | "gold" | "red" | "indigo";

const accents: Record<Accent, string> = {
  green: "before:bg-fest-green",
  gold: "before:bg-fest-yellow",
  red: "before:bg-fest-red",
  indigo: "before:bg-fest-violet",
};

export function StatCard({
  label,
  value,
  hint,
  accent = "green",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: Accent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card festival-stat-card relative overflow-hidden p-3 pl-4 text-ink sm:p-4 sm:pl-5",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5",
        accents[accent],
        className,
      )}
    >
      {/* Two reserved lines keep every card the same height in both languages. */}
      <p className="lines-2 line-clamp-2 text-[10px] font-bold uppercase tracking-wide text-muted sm:text-xs">
        {label}
      </p>
      <p className="font-display tabular mt-1 text-2xl font-black leading-none text-fest-ink sm:text-3xl md:text-4xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
