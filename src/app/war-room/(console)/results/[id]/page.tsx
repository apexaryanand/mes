import { notFound } from "next/navigation";
import { startCorrectionForm, transitionResultForm } from "@/domains/admin/actions";
import { ResultEntriesEditor } from "@/components/war-room/result-entries-editor";
import { can, getSessionProfile } from "@/lib/auth";
import { getResultEntries, getResultSetById } from "@/lib/data/admin-queries";
import { getDictionary, tName, statusLabel } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses, getParticipantsLite, getScheduledEventById } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { ButtonLink } from "@/components/ui/button";
import { WrStepBar, WrSubmit } from "@/components/war-room/primitives";
import { isCertificateEligible, certificatePagePath } from "@/lib/certificates";

export default async function ResultEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profile = await getSessionProfile();
  const set = await getResultSetById(id);
  if (!set) notFound();
  const [event, houses, participants, entries] = await Promise.all([
    getScheduledEventById(set.scheduled_event_id),
    getHouses(),
    getParticipantsLite(),
    getResultEntries(set.id),
  ]);
  if (!event) notFound();
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
          locale={locale}
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
          <div className="card flex flex-wrap items-center gap-3 border-fest-green p-4">
            <p className="min-w-0 flex-1 text-sm font-bold">
              {t.published}
              {entries[0]?.participant_name ? ` · ${entries[0].participant_name}` : ""}
            </p>
            <ButtonLink href={`/events/${event.slug}`} variant="outline" size="sm">
              {t.viewSite}
            </ButtonLink>
            {entries
              .filter((e) => isCertificateEligible(e.rank))
              .map((e) => (
                <ButtonLink
                  key={e.id}
                  href={certificatePagePath(e.id)}
                  variant="gold"
                  size="sm"
                >
                  {t.downloadCertificate}
                  {e.rank ? ` · ${e.rank}` : ""}
                </ButtonLink>
              ))}
            <form action={startCorrectionForm}>
              <input type="hidden" name="id" value={set.id} />
              <ConfirmSubmit
                className="festival-button inline-flex min-h-9 items-center border-fest-red bg-paper-white px-4 text-xs font-bold text-fest-red"
                label={t.startCorrection}
                message={t.confirmDestructive}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
