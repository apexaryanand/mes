import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  live: "bg-fest-red text-white",
  next: "bg-fest-green text-white",
  upcoming: "bg-fest-yellow-soft text-fest-ink",
  completed: "bg-paper text-muted",
  delayed: "bg-amber-200 text-amber-950",
  cancelled: "bg-line text-fest-ink",
  published: "bg-fest-green text-white",
  verified: "bg-fest-cyan text-white",
  entered: "bg-fest-yellow text-fest-ink",
  draft: "bg-paper text-muted",
  pending: "bg-fest-yellow text-fest-ink",
  approved: "bg-fest-green text-white",
  rejected: "bg-fest-red text-white",
};

const darkStyles: Record<string, string> = {
  live: "bg-white text-fest-red",
  next: "bg-fest-green text-white",
  upcoming: "bg-fest-yellow text-fest-ink",
  completed: "bg-white/90 text-fest-ink",
  delayed: "bg-amber-200 text-amber-950",
  cancelled: "bg-white/70 text-fest-ink",
  published: "bg-fest-green text-white",
  verified: "bg-fest-cyan text-white",
  entered: "bg-fest-yellow text-fest-ink",
  draft: "bg-white/80 text-fest-ink",
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
  const live = status === "live" || pulse;
  return (
    <span
      className={cn(
        "festival-status inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        palette[status] ?? (dark ? "bg-white/80 text-fest-ink" : "bg-paper text-muted"),
      )}
    >
      {live ? <span className={cn("live-dot", dark && "bg-fest-red")} /> : null}
      {status === "next" ? <span className="status-dot-next bg-white" /> : null}
      {status === "delayed" ? <span className="status-dot-delayed" /> : null}
      {label}
    </span>
  );
}
