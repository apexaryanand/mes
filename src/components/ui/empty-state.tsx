import Link from "next/link";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  icon = "stage",
  className,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: "stage" | "results" | "media" | "search";
  className?: string;
}) {
  return (
    <div className={cn("card empty-state", className)}>
      <span className="empty-state-mark" aria-hidden>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={ICONS[icon]} />
        </svg>
      </span>
      <p className="font-display text-lg font-black text-fest-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="festival-button mt-2 inline-flex min-h-10 items-center bg-fest-ink px-4 text-[0.8125rem] font-bold text-fest-yellow"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

const ICONS: Record<string, string> = {
  stage: "M3 7h18l-2 5H5zM5 12v7M19 12v7",
  results: "M3 5h18M3 10h18M3 15h12",
  media: "M4 6h16v12H4zM8 6l1.5-2h5L16 6M12 15a3 3 0 100-6 3 3 0 000 6z",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-4-4",
};
