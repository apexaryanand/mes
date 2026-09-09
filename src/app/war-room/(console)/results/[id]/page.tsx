import { notFound } from "next/navigation";
import {
  saveResultDraftForm,
  startCorrectionForm,
  transitionResultForm,
} from "@/domains/admin/actions";
import { can, getSessionProfile } from "@/lib/auth";
import * as demo from "@/lib/data/demo";
import { hydrateEntries } from "@/lib/data/queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { suggestGrade } from "@/domains/results/scoring";

export default async function ResultEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const profile = await getSessionProfile();
  const set = demo.resultSets.find((s) => s.id === id);
  if (!set) notFound();
  const events = await getScheduledEvents();
  const event = events.find((e) => e.id === set.scheduled_event_id);
  if (!event) notFound();
  const entries = hydrateEntries(set.id);
  const locked = set.status === "published";
  const operator = can(profile?.role, ["results_operator"]);
  const verifier = can(profile?.role, ["results_verifier"]);

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="font-display text-3xl">{tName(locale, event.programme)}</h1>
        <p className="text-sm text-muted">
          {tName(locale, event.category)} · {tName(locale, event.stage)}
        </p>
        <StatusBadge status={set.status} label={set.status} />
      </div>

      <form action={saveResultDraftForm} className="overflow-x-auto rounded border border-line bg-white p-3">
        <input type="hidden" name="resultSetId" value={set.id} />
        <input type="hidden" name="count" value={Math.max(entries.length, 1)} />
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">{t.rank}</th>
              <th className="p-2">{t.participant}</th>
              <th className="p-2">{t.school}</th>
              <th className="p-2">{t.marks}</th>
              <th className="p-2">{t.grade}</th>
            </tr>
          </thead>
          <tbody>
            {(entries.length ? entries : [{ id: "", school_id: demo.schools[0].id, participant_name: "", marks: null, grade: null, rank: 1, points: 0, result_set_id: set.id, school: demo.schools[0] }]).map((row, i) => (
              <tr key={row.id || i}>
                <td className="p-2">
                  <input type="hidden" name={`id_${i}`} defaultValue={row.id} />
                  <input name={`rank_${i}`} defaultValue={row.rank ?? i + 1} disabled={locked} className="w-16 rounded border border-line px-2 py-1" />
                </td>
                <td className="p-2">
                  <input name={`name_${i}`} defaultValue={row.participant_name ?? ""} disabled={locked} className="min-w-40 rounded border border-line px-2 py-1" />
                </td>
                <td className="p-2">
                  <select name={`school_${i}`} defaultValue={row.school_id} disabled={locked} className="rounded border border-line px-2 py-1">
                    {demo.schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {tName(locale, s)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input name={`marks_${i}`} defaultValue={row.marks ?? ""} disabled={locked} className="w-20 rounded border border-line px-2 py-1" />
                </td>
                <td className="p-2">
                  <select name={`grade_${i}`} defaultValue={row.grade ?? suggestGrade(row.marks) ?? ""} disabled={locked} className="rounded border border-line px-2 py-1">
                    <option value="">—</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {operator && !locked ? (
          <button className="mt-3 min-h-10 rounded bg-zinc-800 px-4 text-white">{t.saveDraft}</button>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        {operator && set.status === "draft" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="entered" />
            <button className="min-h-10 rounded bg-amber-700 px-4 text-white">{t.submitForVerification}</button>
          </form>
        ) : null}
        {verifier && set.status === "entered" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="verified" />
            <button className="min-h-10 rounded bg-sky-800 px-4 text-white">{t.verify}</button>
          </form>
        ) : null}
        {verifier && set.status === "verified" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="published" />
            <ConfirmSubmit
              className="min-h-10 rounded bg-kerala px-4 text-white"
              label={t.publish}
              message={t.confirmPublish}
            />
          </form>
        ) : null}
        {verifier && set.status === "published" ? (
          <form action={startCorrectionForm}>
            <input type="hidden" name="id" value={set.id} />
            <ConfirmSubmit
              className="min-h-10 rounded border border-live px-4 text-live"
              label={t.startCorrection}
              message={t.confirmDestructive}
            />
          </form>
        ) : null}
        {operator && set.status === "correction_draft" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="entered" />
            <button className="min-h-10 rounded bg-amber-700 px-4 text-white">{t.submitForVerification}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
