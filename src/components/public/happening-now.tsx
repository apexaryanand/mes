"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { ScheduledEventView } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const accentByStatus: Record<string, string> = {
  live: "before:bg-fest-red",
  delayed: "before:bg-[var(--delayed)]",
  next: "before:bg-fest-green",
  upcoming: "before:bg-fest-green",
};

export function HappeningNow({ events }: { events: ScheduledEventView[] }) {
  const { locale, t } = useI18n();
  const live = events.filter((e) => e.status === "live");
  const delayed = events.filter((e) => e.status === "delayed");
  const next = events.filter((e) => e.status === "upcoming").slice(0, 4);
  const cards = [...live, ...delayed, ...next];

  if (!cards.length) {
    return <EmptyState title={t.noItems} description={t.emptyHint} />;
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
      {cards.map((event) => {
        const status = event.status === "upcoming" ? "next" : event.status;
        const label =
          status === "next"
            ? t.next
            : t[
                event.status === "live"
                  ? "live"
                  : event.status === "delayed"
                    ? "delayed"
                    : event.status === "completed"
                      ? "completed"
                      : "upcoming"
              ];
        return (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className={cn(
              "card card-hover relative flex flex-col overflow-hidden p-3 pl-4 sm:p-5 sm:pl-6",
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5 sm:before:w-2",
              accentByStatus[status] ?? "before:bg-fest-green",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="lines-1 line-clamp-1 text-[10px] font-bold uppercase tracking-wide text-muted sm:text-xs sm:tracking-wider">
                {tName(locale, event.stage)}
              </p>
              <StatusBadge status={status} label={label} />
            </div>
            <h3 className="font-display lines-2 mt-2 line-clamp-2 text-base font-black sm:mt-3 sm:text-xl">
              {tName(locale, event.programme)}
            </h3>
            <p className="lines-1 mt-0.5 line-clamp-1 text-xs text-muted sm:mt-1 sm:text-sm">
              {tName(locale, event.category)}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-fest-red sm:mt-4 sm:text-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              {formatTime(event.start_time, locale)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
