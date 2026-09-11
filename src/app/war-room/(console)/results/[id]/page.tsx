import { notFound } from "next/navigation";
import { startCorrectionForm, transitionResultForm } from "@/domains/admin/actions";
import { ResultEntriesEditor } from "@/components/war-room/result-entries-editor";
import { can, getSessionProfile } from "@/lib/auth";
import { getResultEntries, getResultSetById } from "@/lib/data/admin-queries";
import { getDictionary, tName, statusLabel } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses, getParticipants, getScheduledEvents } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { WrStepBar, WrSubmit } from "@/components/war-room/primitives";

export default async function ResultEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profile = await getSessionProfile();
  const set = await getResultSetById(id);
  if (!set) notFound();
  const [events, houses, participants] = await Promise.all([
    getScheduledEvents(),
    getHouses(),
    getParticipants(),
  ]);
  const event = events.find((e) => e.id === set.scheduled_event_id);
  if (!event) notFound();
  const entries = await getResultEntries(set.id);
  const locked = set.status === "published";
  const editor = can(profile?.role, ["war_room"]);

  const steps = [
    { label: t.draft },
    { label: t.submitForConfirmation },
    { label: t.published },
  ];
  const normalized =
    set.status === "correction_draft"
      ? "draft"
      : set.status === "verified"
        ? "entered"
        : set.status;
  const activeStep = steps.findIndex((_, i) => ["draft", "entered", "published"][i] === normalized);

  return (
    <div className="grid gap-5">
      <div className="card p-4 lg:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-black lg:text-2xl">
              {tName(locale, event.programme)}
            </h2>
            <p className="text-sm text-muted">
              {tName(locale, event.category)} · {tName(locale, event.stage)}
            </p>
          </div>
          <StatusBadge status={set.status} label={statusLabel(locale, set.status)} />
        </div>
        <div className="mt-5">
          <WrStepBar steps={steps} activeIndex={activeStep} />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="border-2 border-fest-red bg-live-soft px-4 py-3 text-sm font-bold text-fest-red"
        >
          {error}
        </p>
      ) : null}

      {editor ? (
        <ResultEntriesEditor
          resultSetId={set.id}
          locked={locked}
          saveLabel={t.saveDraft}
          addRowLabel={t.addRow}
          removeLabel={t.remove}
          houses={houses}
          participants={participants}
          initialRows={entries}
          localeHouseName={(h) => tName(locale, h)}
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        {editor && (set.status === "draft" || set.status === "correction_draft") ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="entered" />
            <WrSubmit variant="gold">{t.submitForConfirmation}</WrSubmit>
          </form>
        ) : null}
        {editor && set.status === "entered" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="published" />
            <ConfirmSubmit
              className="festival-button inline-flex min-h-11 items-center bg-fest-ink px-5 text-sm font-bold text-fest-yellow"
              label={t.confirmAndPublish}
              message={t.confirmPublish}
            />
          </form>
        ) : null}
        {editor && set.status === "published" ? (
          <form action={startCorrectionForm}>
            <input type="hidden" name="id" value={set.id} />
            <ConfirmSubmit
              className="festival-button inline-flex min-h-11 items-center border-fest-red bg-paper-white px-5 text-sm font-bold text-fest-red"
              label={t.startCorrection}
              message={t.confirmDestructive}
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}
