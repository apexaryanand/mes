"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { ScheduledEventView } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export function HappeningNow({ events }: { events: ScheduledEventView[] }) {
  const { locale, t } = useI18n();
  const live = events.filter((e) => e.status === "live");
  const delayed = events.filter((e) => e.status === "delayed");
  const next = events.filter((e) => e.status === "upcoming").slice(0, 4);
  const cards = [...live, ...delayed, ...next];

  if (!cards.length) {
    return <p className="text-muted">{t.noItems}</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((event) => {
        const status = event.status === "upcoming" ? "next" : event.status;
        return (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="rounded border border-line bg-paper-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-muted">
                {tName(locale, event.stage)}
              </p>
              <StatusBadge status={status} label={status === "next" ? t.next : t[event.status === "live" ? "live" : event.status === "delayed" ? "delayed" : event.status === "completed" ? "completed" : "upcoming"]} />
            </div>
            <h3 className="mt-2 font-display text-xl leading-snug">
              {tName(locale, event.programme)}
            </h3>
            <p className="text-sm text-muted">{tName(locale, event.category)}</p>
            <p className="mt-3 text-sm">
              {t.startTime}: {formatTime(event.start_time, locale)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
