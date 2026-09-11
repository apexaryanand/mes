import Link from "next/link";
import { WrEmpty, WrPanel } from "@/components/war-room/primitives";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { getSessionProfile } from "@/lib/auth";
import {
  getAllMediaAdmin,
  getAllResultSets,
  getRecentPublished,
} from "@/lib/data/admin-queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";

export default async function WarRoomDashboard() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profile = await getSessionProfile();
  const events = await getScheduledEvents();
  const live = events.filter((e) => e.status === "live");
  const completed = events.filter((e) => e.status === "completed");
  const resultSets = await getAllResultSets();
  const awaitingEntry = events.filter(
    (e) =>
      e.status === "completed" &&
      !resultSets.some((s) => s.scheduled_event_id === e.id && s.status !== "archived"),
  );
  const awaitingVerification = resultSets.filter((s) => s.status === "entered");
  const pendingMedia = (await getAllMediaAdmin()).filter((m) => m.status === "pending");
  const published = await getRecentPublished(6);

  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted">
        {t.signedInAs}{" "}
        <span className="font-bold text-fest-ink">{profile?.display_name}</span>
        <span className="text-muted"> · </span>
        <span className="font-bold text-fest-red">{profile?.role?.replace(/_/g, " ")}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard label={t.happeningNow} value={live.length} accent="red" />
        <StatCard label={t.completed} value={completed.length} accent="green" />
        <StatCard label={t.awaitingEntry} value={awaitingEntry.length} accent="gold" />
        <StatCard label={t.awaitingVerification} value={awaitingVerification.length} accent="gold" />
        <StatCard label={t.awaitingModeration} value={pendingMedia.length} accent="indigo" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <WrPanel title={t.happeningNow} accent="red">
          {live.length ? (
            <ul className="divide-y-2 divide-fest-ink/10">
              {live.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-bold">{tName(locale, e.programme)}</span>
                    <span className="text-muted"> · {tName(locale, e.stage)}</span>
                  </span>
                  <StatusBadge status="live" label={t.live} />
                </li>
              ))}
            </ul>
          ) : (
            <WrEmpty label={t.noItems} />
          )}
        </WrPanel>

        <WrPanel title={t.awaitingVerification} accent="gold">
          {awaitingVerification.length ? (
            <ul className="divide-y-2 divide-fest-ink/10">
              {awaitingVerification.map((s) => {
                const event = events.find((e) => e.id === s.scheduled_event_id);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/war-room/results/${s.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-fest-yellow-soft"
                    >
                      <span className="min-w-0 truncate font-bold">
                        {event ? tName(locale, event.programme) : s.id}
                      </span>
                      <StatusBadge status="entered" label={t.entered} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <WrEmpty label={t.noItems} />
          )}
        </WrPanel>

        <WrPanel title={t.recentPublished} accent="green">
          {published.length ? (
            <ul className="divide-y-2 divide-fest-ink/10">
              {published.map((p) => (
                <li key={p.result_set.id} className="px-4 py-2.5 text-sm">
                  <span className="font-bold">{tName(locale, p.event.programme)}</span>
                  <span className="text-muted"> · {tName(locale, p.event.category)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <WrEmpty label={t.noItems} />
          )}
        </WrPanel>

        <WrPanel title={t.awaitingModeration} accent="violet">
          {pendingMedia.length ? (
            <ul className="divide-y-2 divide-fest-ink/10">
              {pendingMedia.slice(0, 5).map((m) => (
                <li key={m.id} className="px-4 py-2.5 text-sm">
                  <span className="font-bold text-fest-ink">
                    {locale === "ml" ? m.title_ml : m.title_en}
                  </span>
                  <span className="text-muted"> · {m.submitted_by_name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <WrEmpty label={t.noItems} />
          )}
        </WrPanel>
      </div>
    </div>
  );
}
