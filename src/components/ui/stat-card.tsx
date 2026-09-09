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
        "card relative overflow-hidden p-4 pl-5",
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5",
        accents[accent],
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="font-display mt-1 text-3xl font-bold tabular leading-none md:text-4xl">
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
