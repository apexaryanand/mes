import { notFound } from "next/navigation";
import { startCorrectionForm, transitionResultForm } from "@/domains/admin/actions";
import { ResultEntriesEditor } from "@/components/war-room/result-entries-editor";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminStepBar } from "@/components/admin/admin-step-bar";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { can, getSessionProfile } from "@/lib/auth";
import { getResultEntries, getResultSetById } from "@/lib/data/admin-queries";
import { adminCopy } from "@/lib/admin/copy";
import { adminStatusLabel } from "@/lib/admin/status";
import { getHouses, getParticipantsLite, getScheduledEventById } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { ButtonLink } from "@/components/ui/button";
import { isCertificateEligible, certificatePagePath } from "@/lib/certificates";

export default async function ResultEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
    { label: adminCopy.draft },
    { label: adminCopy.submitForConfirmation },
    { label: adminCopy.published },
  ];
  const normalized =
    set.status === "correction_draft"
      ? "draft"
      : set.status === "verified"
        ? "entered"
        : set.status;
  const activeStep = steps.findIndex((_, i) => ["draft", "entered", "published"][i] === normalized);

  return (
    <AdminPage
      title={event.programme.name_en}
      description={`${event.category.name_en} · ${event.stage.name_en}`}
      actions={<StatusBadge status={set.status} label={adminStatusLabel(set.status)} />}
    >
      <AdminStepBar steps={steps} activeIndex={activeStep} />

      {editor ? (
        <ResultEntriesEditor
          resultSetId={set.id}
          locked={locked}
          saveLabel={adminCopy.saveDraft}
          addRowLabel={adminCopy.addRow}
          removeLabel={adminCopy.remove}
          houses={houses}
          participants={participants}
          initialRows={entries}
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        {editor && (set.status === "draft" || set.status === "correction_draft") ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="entered" />
            <AdminSubmit>{adminCopy.submitForConfirmation}</AdminSubmit>
          </form>
        ) : null}
        {editor && set.status === "entered" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="published" />
            <ConfirmSubmit
              className="inline-flex min-h-10 items-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white"
              label={adminCopy.confirmAndPublish}
              message={adminCopy.confirmPublish}
            />
          </form>
        ) : null}
        {editor && set.status === "published" ? (
          <div className="flex w-full flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4">
            <p className="min-w-0 flex-1 text-sm font-medium text-zinc-900">
              {adminCopy.published}
              {entries[0]?.participant_name ? ` · ${entries[0].participant_name}` : ""}
            </p>
            <ButtonLink href={`/events/${event.slug}`} variant="outline" size="sm">
              {adminCopy.viewSite}
            </ButtonLink>
            {entries
              .filter((e) => isCertificateEligible(e.rank))
              .map((e) => (
                <ButtonLink key={e.id} href={certificatePagePath(e.id)} variant="gold" size="sm">
                  {adminCopy.downloadCertificate}
                  {e.rank ? ` · ${e.rank}` : ""}
                </ButtonLink>
              ))}
            <form action={startCorrectionForm}>
              <input type="hidden" name="id" value={set.id} />
              <ConfirmSubmit
                className="inline-flex min-h-9 items-center rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-700"
                label={adminCopy.startCorrection}
                message={adminCopy.confirmDestructive}
              />
            </form>
          </div>
        ) : null}
      </div>
    </AdminPage>
  );
}
