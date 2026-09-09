import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  live: "bg-live text-white",
  next: "bg-kerala text-white",
  upcoming: "bg-kerala-soft text-kerala-dark",
  completed: "bg-line text-muted",
  delayed: "bg-amber-100 text-amber-900",
  cancelled: "bg-zinc-200 text-zinc-700",
  published: "bg-kerala-soft text-kerala-dark",
  verified: "bg-sky-100 text-sky-900",
  entered: "bg-amber-50 text-amber-900",
  draft: "bg-zinc-100 text-zinc-700",
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-kerala-soft text-kerala-dark",
  rejected: "bg-live-soft text-live",
};

export function StatusBadge({
  status,
  label,
  pulse = false,
}: {
  status: string;
  label: string;
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        styles[status] ?? "bg-line text-muted",
      )}
    >
      {pulse || status === "live" ? <span className="live-dot" /> : null}
      {label}
    </span>
  );
}
