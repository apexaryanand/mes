"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { ScheduledEventView } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const accentByStatus: Record<string, string> = {
  live: "before:bg-live",
  delayed: "before:bg-amber-500",
  next: "before:bg-kerala",
  upcoming: "before:bg-kerala",
};

export function HappeningNow({ events }: { events: ScheduledEventView[] }) {
  const { locale, t } = useI18n();
  const live = events.filter((e) => e.status === "live");
  const delayed = events.filter((e) => e.status === "delayed");
  const next = events.filter((e) => e.status === "upcoming").slice(0, 4);
  const cards = [...live, ...delayed, ...next];

  if (!cards.length) {
    return (
      <div className="card p-8 text-center text-muted">{t.noItems}</div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              "card card-hover relative overflow-hidden p-5 pl-6",
              "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5",
              accentByStatus[status] ?? "before:bg-kerala",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {tName(locale, event.stage)}
              </p>
              <StatusBadge status={status} label={label} />
            </div>
            <h3 className="font-display mt-3 text-xl font-bold leading-snug">
              {tName(locale, event.programme)}
            </h3>
            <p className="mt-1 text-sm text-muted">{tName(locale, event.category)}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-kerala-dark">
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
