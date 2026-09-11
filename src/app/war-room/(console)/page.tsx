import Link from "next/link";
import {
  createDraftForEventForm,
  transitionResultForm,
  updateEventStatusForm,
} from "@/domains/admin/actions";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { WorkQueue, WorkQueueRow } from "@/components/admin/work-queue";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { StatusBadge } from "@/components/ui/status-badge";
import { getSessionProfile } from "@/lib/auth";
import { adminCopy } from "@/lib/admin/copy";
import {
  getPendingMediaAdmin,
  getAllResultSets,
  getRecentPublished,
} from "@/lib/data/admin-queries";
import { getScheduledEvents } from "@/lib/data/queries";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-2 border-fest-ink bg-paper-white px-4 py-4 shadow-[3px_3px_0_var(--fest-ink)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="tabular mt-2 text-3xl font-bold text-fest-ink">{value}</p>
    </div>
  );
}

export default async function OperationsPage() {
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

  const queueItems = [
    ...awaitingEntry.map((e) => (
      <WorkQueueRow
        key={`entry-${e.id}`}
        title={e.programme.name_en}
        meta={`${e.category.name_en} · ${e.stage.name_en}`}
        actions={
          <>
            <StatusBadge status="completed" label={adminCopy.awaitingEntry} />
            <form action={createDraftForEventForm}>
              <input type="hidden" name="eventId" value={e.id} />
              <input type="hidden" name="from" value="/war-room" />
              <AdminSubmit variant="secondary">{adminCopy.enterResults}</AdminSubmit>
            </form>
          </>
        }
      />
    )),
    ...awaitingVerification.map((s) => {
      const event = events.find((e) => e.id === s.scheduled_event_id);
      return (
        <WorkQueueRow
          key={`verify-${s.id}`}
          title={event?.programme.name_en ?? s.id}
          meta={adminCopy.awaitingVerification}
          actions={
            <>
              <Link href={`/war-room/results/${s.id}`} className="text-sm font-medium text-zinc-900 hover:underline">
                {adminCopy.edit}
              </Link>
              <form action={transitionResultForm}>
                <input type="hidden" name="id" value={s.id} />
                <input type="hidden" name="next" value="published" />
                <ConfirmSubmit
                  className="inline-flex min-h-9 items-center rounded-md bg-zinc-900 px-3 text-xs font-medium text-white"
                  label={adminCopy.confirmAndPublish}
                  message={adminCopy.confirmPublish}
                />
              </form>
            </>
          }
        />
      );
    }),
    ...pendingMedia.slice(0, 6).map((m) => (
      <WorkQueueRow
        key={`media-${m.id}`}
        title={m.title_en}
        meta={m.submitted_by_name ?? ""}
        actions={
          <Link href="/war-room/content?tab=moderation" className="text-sm font-medium text-zinc-900 hover:underline">
            {adminCopy.reviewNow}
          </Link>
        }
      />
    )),
  ];

  return (
    <AdminPage
      title={adminCopy.operations}
      description={`${adminCopy.signedInAs} ${profile?.display_name} · ${profile?.role?.replace(/_/g, " ")}`}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Stat label={adminCopy.happeningNow} value={live.length} />
        <Stat label={adminCopy.completed} value={completed.length} />
        <Stat label={adminCopy.awaitingEntry} value={awaitingEntry.length} />
        <Stat label={adminCopy.awaitingVerification} value={awaitingVerification.length} />
        <Stat label={adminCopy.awaitingModeration} value={pendingMedia.length} />
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-fest-red">Priority lane</p>
            <h2 className="mt-1 text-lg font-bold text-fest-ink">{adminCopy.workQueue}</h2>
          </div>
          <span className="text-xs font-semibold text-muted">Action required</span>
        </div>
        <WorkQueue items={queueItems} emptyLabel={adminCopy.noItems} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="overflow-hidden border-2 border-fest-ink bg-paper-white shadow-[3px_3px_0_var(--fest-ink)]">
          <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">{adminCopy.happeningNow}</h2>
          {live.length ? (
            <ul className="divide-y divide-zinc-100">
              {live.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                  <span>
                    <span className="font-medium">{e.programme.name_en}</span>
                    <span className="text-zinc-500"> · {e.stage.name_en}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status="live" label={adminCopy.live} />
                    <form action={updateEventStatusForm}>
                      <input type="hidden" name="eventId" value={e.id} />
                      <input type="hidden" name="status" value="completed" />
                      <AdminSubmit variant="secondary">{adminCopy.markCompleted}</AdminSubmit>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">{adminCopy.noItems}</p>
          )}
        </section>

        <section className="overflow-hidden border-2 border-fest-ink bg-paper-white shadow-[3px_3px_0_var(--fest-ink)]">
          <h2 className="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">{adminCopy.recentPublished}</h2>
          {published.length ? (
            <ul className="divide-y divide-zinc-100">
              {published.map((p) => (
                <li key={p.result_set.id}>
                  <Link href={`/events/${p.event.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-zinc-50">
                    <span>
                      <span className="font-medium">{p.event.programme.name_en}</span>
                      <span className="text-zinc-500"> · {p.event.category.name_en}</span>
                    </span>
                    <span className="text-xs font-medium text-zinc-600">{adminCopy.viewSite}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">{adminCopy.noItems}</p>
          )}
        </section>
      </div>
    </AdminPage>
  );
}
