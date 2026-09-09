import { cn } from "@/lib/utils";

type Accent = "green" | "gold" | "red" | "indigo";

const accents: Record<Accent, string> = {
  green: "before:bg-kerala",
  gold: "before:[background:var(--grad-gold)]",
  red: "before:bg-live",
  indigo: "before:bg-indigo",
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
        "card relative overflow-hidden p-3 pl-4 text-ink sm:p-4 sm:pl-5",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
        accents[accent],
        className,
      )}
    >
      <p className="line-clamp-2 text-[10px] font-semibold uppercase leading-tight tracking-wide text-muted sm:text-xs sm:tracking-wider">
        {label}
      </p>
      <p className="font-display mt-0.5 text-2xl font-bold tabular leading-none text-kerala-dark sm:mt-1 sm:text-3xl md:text-4xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
