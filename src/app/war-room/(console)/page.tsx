import Link from "next/link";
import {
  createDraftForEventForm,
  transitionResultForm,
  updateEventStatusForm,
} from "@/domains/admin/actions";
import { WrEmpty, WrPanel, WrSubmit } from "@/components/war-room/primitives";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { getSessionProfile } from "@/lib/auth";
import {
  getPendingMediaAdmin,
  getAllResultSets,
  getRecentPublished,
} from "@/lib/data/admin-queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";

export default async function WarRoomDashboard() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [profile, events, resultSets, pendingMedia, published] = await Promise.all([
    getSessionProfile(),
    getScheduledEvents(),
    getAllResultSets(),
    getPendingMediaAdmin(8),
    getRecentPublished(6),
  ]);
  const live = events.filter((e) => e.status === "live");
  const completed = events.filter((e) => e.status === "completed");
  const awaitingEntry = events.filter(
    (e) =>
      e.status === "completed" &&
      !resultSets.some((s) => s.scheduled_event_id === e.id && s.status !== "archived"),
  );
  const awaitingVerification = resultSets.filter((s) => s.status === "entered");
  const queueCount = awaitingEntry.length + awaitingVerification.length + pendingMedia.length;

  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted">
        {t.signedInAs}{" "}
        <span className="font-bold text-fest-ink">{profile?.display_name}</span>
        <span className="text-muted"> · </span>
        <span className="font-bold text-fest-red">{profile?.role?.replace(/_/g, " ")}</span>
      </p>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <StatCard label={t.happeningNow} value={live.length} accent="red" href="#live" />
        <StatCard label={t.completed} value={completed.length} accent="green" />
        <StatCard
          label={t.awaitingEntry}
          value={awaitingEntry.length}
          accent="gold"
          href="#queue"
        />
        <StatCard
          label={t.awaitingVerification}
          value={awaitingVerification.length}
          accent="gold"
          href="#queue"
        />
        <StatCard
          label={t.awaitingModeration}
          value={pendingMedia.length}
          accent="indigo"
          href="/war-room/media"
        />
      </div>

      <div id="queue" className="scroll-mt-20">
      <WrPanel title={`${t.workQueue}${queueCount ? ` · ${queueCount}` : ""}`} accent="gold">
        <div className="divide-y-2 divide-fest-ink/10">
          {awaitingEntry.map((e) => (
            <div key={e.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{tName(locale, e.programme)}</p>
                <p className="text-xs text-muted">
                  {tName(locale, e.category)} · {tName(locale, e.stage)}
                </p>
              </div>
              <StatusBadge status="completed" label={t.awaitingEntry} />
              <form action={createDraftForEventForm}>
                <input type="hidden" name="eventId" value={e.id} />
                <input type="hidden" name="from" value="/war-room" />
                <WrSubmit size="sm">{t.enterResults}</WrSubmit>
              </form>
            </div>
          ))}
          {awaitingVerification.map((s) => {
            const event = events.find((e) => e.id === s.scheduled_event_id);
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">
                    {event ? tName(locale, event.programme) : s.id}
                  </p>
                  <p className="text-xs text-muted">{t.awaitingVerification}</p>
                </div>
                <Link
                  href={`/war-room/results/${s.id}`}
                  className="text-sm font-bold text-fest-ink underline-offset-2 hover:underline"
                >
                  {t.edit}
                </Link>
                <form action={transitionResultForm}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="next" value="published" />
                  <ConfirmSubmit
                    className="festival-button inline-flex min-h-9 items-center bg-fest-ink px-3 text-xs font-bold text-fest-yellow"
                    label={t.confirmAndPublish}
                    message={t.confirmPublish}
                  />
                </form>
              </div>
            );
          })}
          {pendingMedia.slice(0, 6).map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold">{locale === "ml" ? m.title_ml : m.title_en}</p>
                <p className="text-xs text-muted">{m.submitted_by_name}</p>
              </div>
              <Link href="/war-room/media">
                <span className="festival-button inline-flex min-h-9 items-center border-fest-ink bg-paper-white px-3 text-xs font-bold">
                  {t.reviewNow}
                </span>
              </Link>
            </div>
          ))}
          {!awaitingEntry.length && !awaitingVerification.length && !pendingMedia.length ? (
            <WrEmpty label={t.noItems} />
          ) : null}
        </div>
      </WrPanel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <WrPanel title={t.happeningNow} accent="red" className="scroll-mt-20">
          <div id="live">
            {live.length ? (
              <ul className="divide-y-2 divide-fest-ink/10">
                {live.map((e) => (
                  <li
                    key={e.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-sm"
                  >
                    <span className="min-w-0 truncate">
                      <span className="font-bold">{tName(locale, e.programme)}</span>
                      <span className="text-muted"> · {tName(locale, e.stage)}</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="live" label={t.live} />
                      <form action={updateEventStatusForm}>
                        <input type="hidden" name="eventId" value={e.id} />
                        <input type="hidden" name="status" value="completed" />
                        <WrSubmit size="sm">{t.markCompleted}</WrSubmit>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <WrEmpty label={t.noItems} />
            )}
          </div>
        </WrPanel>

        <WrPanel title={t.recentPublished} accent="green">
          {published.length ? (
            <ul className="divide-y-2 divide-fest-ink/10">
              {published.map((p) => (
                <li key={p.result_set.id}>
                  <Link
                    href={`/events/${p.event.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-fest-yellow-soft"
                  >
                    <span>
                      <span className="font-bold">{tName(locale, p.event.programme)}</span>
                      <span className="text-muted"> · {tName(locale, p.event.category)}</span>
                    </span>
                    <span className="text-xs font-bold text-fest-red">{t.viewSite}</span>
                  </Link>
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
