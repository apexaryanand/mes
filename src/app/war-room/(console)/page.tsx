import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/ui/stat-card";
import { getSessionProfile } from "@/lib/auth";
import {
  getAllLiveUpdatesAdmin,
  getAllMediaAdmin,
  getAllResultSets,
  getRecentPublished,
} from "@/lib/data/admin-queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLiveUpdates, getScheduledEvents } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

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
  const updates = await getLiveUpdates();
  const allUpdates = await getAllLiveUpdatesAdmin();

  return (
    <div className="grid gap-4 sm:gap-6">
      <div>
        <p className="text-sm text-muted">
          {t.signedInAs} <span className="font-medium text-ink">{profile?.display_name}</span> ·{" "}
          <span className="text-gold-deep">{profile?.role?.replace(/_/g, " ")}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-5">
        <StatCard label={t.happeningNow} value={live.length} accent="red" />
        <StatCard label={t.completed} value={completed.length} accent="green" />
        <StatCard label={t.awaitingEntry} value={awaitingEntry.length} accent="gold" />
        <StatCard label={t.awaitingVerification} value={awaitingVerification.length} accent="gold" />
        <StatCard label={t.awaitingModeration} value={pendingMedia.length} accent="indigo" />
      </div>

      <div className="grid gap-3 sm:gap-5 lg:grid-cols-2">
        <Panel title={t.happeningNow} accent="red">
          {live.length ? (
            <ul className="divide-y divide-line">
              {live.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm sm:px-4 sm:py-3"
                >
                  <span className="min-w-0 truncate">
                    <span className="font-medium">{tName(locale, e.programme)}</span>
                    <span className="text-muted"> · {tName(locale, e.stage)}</span>
                  </span>
                  <StatusBadge status="live" label={t.live} />
                </li>
              ))}
            </ul>
          ) : (
            <Empty label={t.noItems} />
          )}
        </Panel>

        <Panel title={t.awaitingVerification} accent="gold">
          {awaitingVerification.length ? (
            <ul className="divide-y divide-line">
              {awaitingVerification.map((s) => {
                const event = events.find((e) => e.id === s.scheduled_event_id);
                return (
                  <li key={s.id}>
                    <Link
                      href={`/war-room/results/${s.id}`}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-kerala-soft/40 sm:px-4 sm:py-3"
                    >
                      <span className="min-w-0 truncate font-medium">
                        {event ? tName(locale, event.programme) : s.id}
                      </span>
                      <StatusBadge status="entered" label={t.entered} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty label={t.noItems} />
          )}
        </Panel>

        <Panel title={t.recentPublished} accent="green">
          {published.length ? (
            <ul className="divide-y divide-line">
              {published.map((p) => (
                <li key={p.result_set.id} className="px-3 py-2.5 text-sm sm:px-4 sm:py-3">
                  <span className="font-medium">{tName(locale, p.event.programme)}</span>
                  <span className="text-muted"> · {tName(locale, p.event.category)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty label={t.noItems} />
          )}
        </Panel>

        <Panel title={t.recentReports} accent="indigo">
          {allUpdates.length ? (
            <ul className="divide-y divide-line">
              {allUpdates.slice(0, 5).map((u) => (
                <li key={u.id} className="px-3 py-2.5 text-sm sm:px-4 sm:py-3">
                  <span className="font-medium text-kerala-dark">{u.reporter_name}: </span>
                  <span className="text-muted">{u.body.slice(0, 120)}</span>
                </li>
              ))}
            </ul>
          ) : updates.length ? (
            <ul className="divide-y divide-line">
              {updates.slice(0, 5).map((u) => (
                <li key={u.id} className="px-3 py-2.5 text-sm sm:px-4 sm:py-3">
                  <span className="font-medium text-kerala-dark">{u.reporter_name}: </span>
                  <span className="text-muted">{u.body.slice(0, 120)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <Empty label={t.noItems} />
          )}
        </Panel>
      </div>
    </div>
  );
}

const accentBar: Record<string, string> = {
  red: "before:bg-live",
  green: "before:bg-kerala",
  gold: "before:[background:var(--grad-gold)]",
  indigo: "before:bg-indigo",
};

function Panel({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <h2
        className={cn(
          "relative border-b border-line px-3 py-2.5 pl-4 text-sm font-semibold sm:px-4 sm:py-3 sm:pl-5 sm:text-base",
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1 sm:before:w-1.5",
          accentBar[accent],
        )}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="px-3 py-6 text-center text-sm text-muted sm:px-4 sm:py-8">{label}</p>;
}
