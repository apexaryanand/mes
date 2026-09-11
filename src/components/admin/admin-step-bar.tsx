import { cn } from "@/lib/utils";

export function AdminStepBar({
  steps,
  activeIndex,
}: {
  steps: Array<{ label: string }>;
  activeIndex: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => {
        const done = activeIndex >= 0 && i <= activeIndex;
        const active = i === activeIndex;
        return (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                done ? (active ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-800") : "bg-zinc-100 text-zinc-400",
              )}
            >
              {i + 1}
            </span>
            <span className={cn("text-sm", done ? "font-medium text-zinc-900" : "text-zinc-500")}>{step.label}</span>
            {i < steps.length - 1 ? <span className="mx-1 text-zinc-300">→</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
