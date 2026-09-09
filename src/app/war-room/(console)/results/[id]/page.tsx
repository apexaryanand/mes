import { notFound } from "next/navigation";
import {
  saveResultDraftForm,
  startCorrectionForm,
  transitionResultForm,
} from "@/domains/admin/actions";
import { can, getSessionProfile } from "@/lib/auth";
import { getResultEntries, getResultSetById } from "@/lib/data/admin-queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getParticipants, getScheduledEvents, getSchools } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { suggestGrade } from "@/domains/results/scoring";
import { statusLabel } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

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
  const [events, schools, participants] = await Promise.all([
    getScheduledEvents(),
    getSchools(),
    getParticipants(),
  ]);
  const event = events.find((e) => e.id === set.scheduled_event_id);
  if (!event) notFound();
  const entries = await getResultEntries(set.id);
  const locked = set.status === "published";
  const operator = can(profile?.role, ["results_operator"]);
  const verifier = can(profile?.role, ["results_verifier"]);
  const defaultSchoolId = schools[0]?.id ?? "";

  const steps: Array<{ key: string; label: string }> = [
    { key: "draft", label: t.draft },
    { key: "entered", label: t.entered },
    { key: "verified", label: t.verified },
    { key: "published", label: t.published },
  ];
  const normalized = set.status === "correction_draft" ? "draft" : set.status;
  const activeStep = steps.findIndex((s) => s.key === normalized);
  const inputCls =
    "rounded-lg border border-line bg-paper-white px-2.5 py-1.5 text-sm focus:border-gold disabled:bg-paper disabled:text-muted";

  const rows = entries.length
    ? entries
    : [
        {
          id: "",
          school_id: defaultSchoolId,
          participant_id: null,
          participant_name: "",
          marks: null,
          grade: null,
          rank: 1,
          points: 0,
          result_set_id: set.id,
          school: schools[0],
        },
      ];

  return (
    <div className="grid gap-3 sm:gap-5">
      <div className="card p-3 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold sm:text-2xl">{tName(locale, event.programme)}</h2>
            <p className="text-sm text-muted">
              {tName(locale, event.category)} · {tName(locale, event.stage)}
            </p>
          </div>
          <StatusBadge status={set.status} label={statusLabel(locale, set.status)} />
        </div>

        <ol className="mt-4 flex items-center gap-0.5 sm:mt-5 sm:gap-1">
          {steps.map((step, i) => {
            const done = activeStep >= 0 && i <= activeStep;
            return (
              <li key={step.key} className="flex flex-1 items-center gap-0.5 last:flex-none sm:gap-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold sm:h-7 sm:w-7 sm:text-xs",
                      done ? "bg-kerala-dark text-white" : "bg-line text-muted",
                    )}
                    title={step.label}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden text-xs font-semibold sm:inline",
                      done ? "text-kerala-dark" : "text-muted",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 ? (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded",
                      activeStep > i ? "bg-kerala-dark" : "bg-line",
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <form action={saveResultDraftForm} className="card mobile-bleed p-3 max-sm:rounded-none max-sm:border-x-0 sm:p-4">
        <input type="hidden" name="resultSetId" value={set.id} />
        <input type="hidden" name="count" value={Math.max(rows.length, 1)} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-paper">
              <tr className="text-left">
                <th className="rounded-l-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t.rank}</th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">Registered</th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t.participant}</th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t.school}</th>
                <th className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t.marks}</th>
                <th className="rounded-r-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted">{t.grade}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id || i} className="border-t border-line">
                  <td className="px-3 py-2">
                    <input type="hidden" name={`id_${i}`} defaultValue={row.id} />
                    <input name={`rank_${i}`} defaultValue={row.rank ?? i + 1} disabled={locked} className={cn(inputCls, "w-16")} />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      name={`participant_${i}`}
                      defaultValue={row.participant_id ?? ""}
                      disabled={locked}
                      className={cn(inputCls, "min-w-36")}
                    >
                      <option value="">Manual entry</option>
                      {participants
                        .filter((p) => p.school_id === row.school_id || !row.school_id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input name={`name_${i}`} defaultValue={row.participant_name ?? ""} disabled={locked} className={cn(inputCls, "min-w-40 w-full")} />
                  </td>
                  <td className="px-3 py-2">
                    <select name={`school_${i}`} defaultValue={row.school_id} disabled={locked} className={inputCls}>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {tName(locale, s)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input name={`marks_${i}`} defaultValue={row.marks ?? ""} disabled={locked} className={cn(inputCls, "w-20")} />
                  </td>
                  <td className="px-3 py-2">
                    <select name={`grade_${i}`} defaultValue={row.grade ?? suggestGrade(row.marks) ?? ""} disabled={locked} className={inputCls}>
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
        </div>
        {operator && !locked ? (
          <button className="mt-4 min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            {t.saveDraft}
          </button>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        {operator && (set.status === "draft" || set.status === "correction_draft") ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="entered" />
            <button className="min-h-11 rounded-full bg-amber-600 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90">{t.submitForVerification}</button>
          </form>
        ) : null}
        {verifier && set.status === "entered" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="verified" />
            <button className="min-h-11 rounded-full bg-sky-700 px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90">{t.verify}</button>
          </form>
        ) : null}
        {verifier && set.status === "verified" ? (
          <form action={transitionResultForm}>
            <input type="hidden" name="id" value={set.id} />
            <input type="hidden" name="next" value="published" />
            <ConfirmSubmit
              className="min-h-11 rounded-full bg-kerala-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-kerala-deep"
              label={t.publish}
              message={t.confirmPublish}
            />
          </form>
        ) : null}
        {verifier && set.status === "published" ? (
          <form action={startCorrectionForm}>
            <input type="hidden" name="id" value={set.id} />
            <ConfirmSubmit
              className="min-h-11 rounded-full border border-live px-5 text-sm font-semibold text-live transition-colors hover:bg-live-soft"
              label={t.startCorrection}
              message={t.confirmDestructive}
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}
