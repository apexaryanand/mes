import { notFound } from "next/navigation";
import {
  saveResultDraftForm,
  startCorrectionForm,
  transitionResultForm,
} from "@/domains/admin/actions";
import { can, getSessionProfile } from "@/lib/auth";
import { getResultEntries, getResultSetById } from "@/lib/data/admin-queries";
import { getDictionary, tName, statusLabel } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses, getParticipants, getScheduledEvents } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmSubmit } from "@/components/ui/confirm-submit";
import { Button } from "@/components/ui/button";
import { WrStepBar, WrSubmit, TableCard, Th, Td } from "@/components/war-room/primitives";
import { suggestGrade } from "@/domains/results/scoring";
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
  const defaultHouseId = houses[0]?.id ?? "";

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

  const inputCls = "field-input min-h-9 w-auto px-2.5 py-1.5 text-sm";

  const rows = entries.length
    ? entries
    : [
        {
          id: "",
          house_id: defaultHouseId,
          participant_id: null,
          participant_name: "",
          marks: null,
          grade: null,
          rank: 1,
          points: 0,
          result_set_id: set.id,
          house: houses[0],
        },
      ];

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

      <form action={saveResultDraftForm}>
        <input type="hidden" name="resultSetId" value={set.id} />
        <input type="hidden" name="count" value={Math.max(rows.length, 1)} />
        <TableCard>
          <table className="min-w-[860px] text-sm">
            <thead>
              <tr>
                <Th>{t.rank}</Th>
                <Th>Registered</Th>
                <Th>{t.participant}</Th>
                <Th>{t.house}</Th>
                <Th>{t.marks}</Th>
                <Th>{t.grade}</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id || i}>
                  <Td>
                    <input type="hidden" name={`id_${i}`} defaultValue={row.id} />
                    <input
                      name={`rank_${i}`}
                      defaultValue={row.rank ?? i + 1}
                      disabled={locked}
                      className={cn(inputCls, "w-16")}
                    />
                  </Td>
                  <Td>
                    <select
                      name={`participant_${i}`}
                      defaultValue={row.participant_id ?? ""}
                      disabled={locked}
                      className={cn(inputCls, "min-w-36")}
                    >
                      <option value="">Manual entry</option>
                      {participants
                        .filter((p) => p.house_id === row.house_id || !row.house_id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>{p.full_name}</option>
                        ))}
                    </select>
                  </Td>
                  <Td>
                    <input
                      name={`name_${i}`}
                      defaultValue={row.participant_name ?? ""}
                      disabled={locked}
                      className={cn(inputCls, "min-w-40 w-full")}
                    />
                  </Td>
                  <Td>
                    <select
                      name={`house_${i}`}
                      defaultValue={row.house_id}
                      disabled={locked}
                      className={inputCls}
                    >
                      {houses.map((h) => (
                        <option key={h.id} value={h.id}>{tName(locale, h)}</option>
                      ))}
                    </select>
                  </Td>
                  <Td>
                    <input
                      name={`marks_${i}`}
                      defaultValue={row.marks ?? ""}
                      disabled={locked}
                      className={cn(inputCls, "w-20")}
                    />
                  </Td>
                  <Td>
                    <select
                      name={`grade_${i}`}
                      defaultValue={row.grade ?? suggestGrade(row.marks) ?? ""}
                      disabled={locked}
                      className={inputCls}
                    >
                      <option value="">—</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
        {editor && !locked ? (
          <div className="mt-4">
            <WrSubmit>{t.saveDraft}</WrSubmit>
          </div>
        ) : null}
      </form>

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
