import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSessionProfile } from "@/lib/auth";
import * as demo from "@/lib/data/demo";
import { hydratePublishedResults } from "@/lib/data/queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getLiveUpdates, getScheduledEvents } from "@/lib/data/queries";

export default async function WarRoomDashboard() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profile = await getSessionProfile();
  const events = await getScheduledEvents();
  const live = events.filter((e) => e.status === "live");
  const completed = events.filter((e) => e.status === "completed");
  const awaitingEntry = events.filter(
    (e) =>
      e.status === "completed" &&
      !demo.resultSets.some((s) => s.scheduled_event_id === e.id && s.status !== "archived"),
  );
  const awaitingVerification = demo.resultSets.filter((s) => s.status === "entered");
  const published = hydratePublishedResults().slice(0, 6);
  const pendingMedia = demo.mediaItems.filter((m) => m.status === "pending");
  const updates = await getLiveUpdates();

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="font-display text-3xl">{t.dashboard}</h1>
        <p className="text-sm text-muted">{profile?.display_name} · {profile?.role}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label={t.happeningNow} value={String(live.length)} />
        <Stat label={t.completed} value={String(completed.length)} />
        <Stat label={t.awaitingEntry} value={String(awaitingEntry.length)} />
        <Stat label={t.awaitingVerification} value={String(awaitingVerification.length)} />
        <Stat label={t.awaitingModeration} value={String(pendingMedia.length)} />
      </div>

      <section>
        <h2 className="mb-2 font-semibold">{t.happeningNow}</h2>
        <ul className="grid gap-2">
          {live.map((e) => (
            <li key={e.id} className="flex items-center justify-between rounded border border-line bg-white px-3 py-2 text-sm">
              <span>
                {tName(locale, e.stage)} · {tName(locale, e.programme)}
              </span>
              <StatusBadge status="live" label={t.live} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">{t.awaitingVerification}</h2>
        <ul className="grid gap-2">
          {awaitingVerification.map((s) => {
            const event = events.find((e) => e.id === s.scheduled_event_id);
            return (
              <li key={s.id}>
                <Link href={`/war-room/results/${s.id}`} className="block rounded border border-line bg-white px-3 py-2 text-sm hover:bg-kerala-soft">
                  {event ? tName(locale, event.programme) : s.id} · {s.status}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">{t.recentPublished}</h2>
        <ul className="grid gap-2">
          {published.map((p) => (
            <li key={p.result_set.id} className="rounded border border-line bg-white px-3 py-2 text-sm">
              {tName(locale, p.event.programme)} · {tName(locale, p.event.category)}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">{t.recentReports}</h2>
        <ul className="grid gap-2 text-sm">
          {updates.slice(0, 5).map((u) => (
            <li key={u.id} className="rounded border border-line bg-white px-3 py-2">
              {u.reporter_name}: {u.body.slice(0, 120)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}
