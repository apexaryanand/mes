import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  live: "bg-red-50 text-red-800 ring-2 ring-red-400/50 shadow-sm",
  next: "bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/40",
  upcoming: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-400/30",
  completed: "bg-line/60 text-muted ring-1 ring-line",
  delayed: "bg-amber-100 text-amber-950 ring-2 ring-amber-500/50 shadow-sm",
  cancelled: "bg-zinc-200 text-zinc-700 ring-1 ring-zinc-300",
  published: "bg-kerala-soft text-kerala-dark ring-1 ring-kerala/20",
  verified: "bg-sky-100 text-sky-900 ring-1 ring-sky-300",
  entered: "bg-amber-50 text-amber-900 ring-1 ring-amber-200",
  draft: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-300",
  pending: "bg-amber-100 text-amber-900 ring-1 ring-amber-300",
  approved: "bg-kerala-soft text-kerala-dark ring-1 ring-kerala/20",
  rejected: "bg-live-soft text-live ring-1 ring-live/30",
};

const darkStyles: Record<string, string> = {
  live: "bg-red-500/25 text-white ring-2 ring-red-300/60 shadow-[0_0_12px_rgba(239,68,68,0.35)]",
  next: "bg-emerald-500/20 text-emerald-50 ring-2 ring-emerald-300/50",
  upcoming: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-300/40",
  completed: "bg-white/12 text-white/85 ring-1 ring-white/20",
  delayed: "bg-amber-500/25 text-amber-50 ring-2 ring-amber-300/55",
  cancelled: "bg-white/10 text-white/60 ring-1 ring-white/15",
  published: "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30",
  verified: "bg-sky-400/15 text-sky-100 ring-1 ring-sky-300/30",
  entered: "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/30",
  draft: "bg-white/10 text-white/70 ring-1 ring-white/15",
};

export function StatusBadge({
  status,
  label,
  pulse = false,
  dark = false,
}: {
  status: string;
  label: string;
  pulse?: boolean;
  dark?: boolean;
}) {
  const palette = dark ? darkStyles : styles;
  return (
    <span
      className={cn(
        "festival-status inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
        palette[status] ?? (dark ? "bg-white/10 text-white/70" : "bg-line text-muted"),
      )}
    >
      {status === "live" || pulse ? <span className="live-dot" /> : null}
      {status === "next" ? <span className="status-dot-next" /> : null}
      {status === "delayed" ? <span className="status-dot-delayed" /> : null}
      {label}
    </span>
  );
}
