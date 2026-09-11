"use client";

import { useMemo, useState } from "react";
import { saveResultDraftForm } from "@/domains/admin/actions";
import { TableCard, Th, Td, WrSubmit } from "@/components/war-room/primitives";
import { suggestGrade } from "@/domains/results/scoring";
import { tName } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { House, Locale, ResultEntryView } from "@/lib/types";

export type ParticipantLite = {
  id: string;
  full_name: string;
  house_id: string;
};

type DraftRow = {
  key: string;
  id: string;
  house_id: string;
  participant_id: string;
  participant_name: string;
  marks: string;
  grade: string;
  rank: string;
  query: string;
};

function newKey() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `row-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toDraft(row: ResultEntryView, fallbackHouse: string): DraftRow {
  return {
    key: row.id || newKey(),
    id: row.id ?? "",
    house_id: row.house_id || fallbackHouse,
    participant_id: row.participant_id ?? "",
    participant_name: row.participant_name ?? "",
    marks: row.marks != null ? String(row.marks) : "",
    grade: row.grade ?? "",
    rank: row.rank != null ? String(row.rank) : "",
    query: "",
  };
}

function emptyRow(houseId: string, rank: number): DraftRow {
  return {
    key: newKey(),
    id: "",
    house_id: houseId,
    participant_id: "",
    participant_name: "",
    marks: "",
    grade: "",
    rank: String(rank),
    query: "",
  };
}

function isBlank(row: DraftRow) {
  return (
    !row.participant_id &&
    !row.participant_name.trim() &&
    !row.marks.trim() &&
    !row.grade
  );
}

function isIncomplete(row: DraftRow) {
  if (isBlank(row)) return false;
  return !row.house_id || !(row.participant_name.trim() || row.participant_id);
}

export function ResultEntriesEditor({
  resultSetId,
  locked,
  saveLabel,
  addRowLabel,
  removeLabel,
  houses,
  participants,
  initialRows,
  locale,
}: {
  resultSetId: string;
  locked: boolean;
  saveLabel: string;
  addRowLabel: string;
  removeLabel: string;
  houses: House[];
  participants: ParticipantLite[];
  initialRows: ResultEntryView[];
  locale: Locale;
}) {
  const defaultHouse = houses[0]?.id ?? "";
  const [rows, setRows] = useState<DraftRow[]>(() => {
    if (initialRows.length) return initialRows.map((r) => toDraft(r, defaultHouse));
    return [1, 2, 3].map((rank) => emptyRow(defaultHouse, rank));
  });
  const [formError, setFormError] = useState<string | null>(null);

  const byId = useMemo(() => new Map(participants.map((p) => [p.id, p])), [participants]);

  const inputCls = "field-input min-h-9 w-auto px-2.5 py-1.5 text-sm";

  function patch(key: string, next: Partial<DraftRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...next } : row)));
  }

  function pickParticipant(key: string, participantId: string) {
    const p = byId.get(participantId);
    patch(key, {
      participant_id: participantId,
      participant_name: p?.full_name ?? "",
      house_id: p?.house_id || defaultHouse,
      query: "",
    });
  }

  return (
    <form
      action={saveResultDraftForm}
      onSubmit={(e) => {
        const bad = rows.find(isIncomplete);
        if (bad) {
          e.preventDefault();
          setFormError("Each filled row needs a participant name (or registered pick) and a house.");
          return;
        }
        setFormError(null);
      }}
    >
      <input type="hidden" name="resultSetId" value={resultSetId} />
      <input type="hidden" name="count" value={rows.length} />
      {formError ? (
        <p role="alert" className="mb-3 border-2 border-fest-red bg-live-soft px-4 py-2 text-sm font-bold text-fest-red">
          {formError}
        </p>
      ) : null}
      <TableCard>
        <table className="min-w-[860px] text-sm">
          <thead>
            <tr>
              <Th>Rank</Th>
              <Th>Registered</Th>
              <Th>Participant</Th>
              <Th>House</Th>
              <Th>Marks</Th>
              <Th>Grade</Th>
              {!locked ? <Th /> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const q = row.query.trim().toLowerCase();
              const matches = q
                ? participants.filter((p) => p.full_name.toLowerCase().includes(q)).slice(0, 8)
                : [];
              return (
                <tr key={row.key}>
                  <Td>
                    <input type="hidden" name={`id_${i}`} value={row.id} />
                    <input
                      name={`rank_${i}`}
                      value={row.rank}
                      onChange={(e) => patch(row.key, { rank: e.target.value })}
                      disabled={locked}
                      className={cn(inputCls, "w-16")}
                    />
                  </Td>
                  <Td>
                    <input type="hidden" name={`participant_${i}`} value={row.participant_id} />
                    {row.participant_id ? (
                      <div className="flex min-w-36 items-center gap-2">
                        <span className="truncate text-sm font-bold">
                          {byId.get(row.participant_id)?.full_name ?? row.participant_name}
                        </span>
                        {!locked ? (
                          <button
                            type="button"
                            className="text-xs font-bold text-fest-red hover:underline"
                            onClick={() =>
                              patch(row.key, { participant_id: "", query: "", participant_name: row.participant_name })
                            }
                          >
                            Clear
                          </button>
                        ) : null}
                      </div>
                    ) : (
                      <div className="relative min-w-36">
                        <input
                          value={row.query}
                          onChange={(e) => patch(row.key, { query: e.target.value })}
                          disabled={locked}
                          placeholder="Search or skip"
                          className={cn(inputCls, "w-full")}
                          autoComplete="off"
                        />
                        {matches.length ? (
                          <ul className="absolute z-20 mt-1 max-h-44 w-full overflow-auto border-2 border-fest-ink bg-paper-white shadow-[var(--shadow-hard-xs)]">
                            {matches.map((p) => (
                              <li key={p.id}>
                                <button
                                  type="button"
                                  className="w-full px-2.5 py-1.5 text-left text-sm font-bold hover:bg-fest-yellow"
                                  onClick={() => pickParticipant(row.key, p.id)}
                                >
                                  {p.full_name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    )}
                  </Td>
                  <Td>
                    <input
                      name={`name_${i}`}
                      value={row.participant_name}
                      onChange={(e) => patch(row.key, { participant_name: e.target.value })}
                      disabled={locked || Boolean(row.participant_id)}
                      className={cn(inputCls, "min-w-40 w-full")}
                    />
                  </Td>
                  <Td>
                    <select
                      name={`house_${i}`}
                      value={row.house_id}
                      onChange={(e) => patch(row.key, { house_id: e.target.value })}
                      disabled={locked}
                      className={inputCls}
                    >
                      {houses.map((h) => (
                        <option key={h.id} value={h.id}>
                          {tName(locale, h)}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td>
                    <input
                      name={`marks_${i}`}
                      value={row.marks}
                      onChange={(e) => {
                        const marks = e.target.value;
                        const suggested = suggestGrade(marks ? Number(marks) : null);
                        patch(row.key, {
                          marks,
                          grade: suggested || row.grade,
                        });
                      }}
                      disabled={locked}
                      className={cn(inputCls, "w-20")}
                    />
                  </Td>
                  <Td>
                    <select
                      name={`grade_${i}`}
                      value={row.grade}
                      onChange={(e) => patch(row.key, { grade: e.target.value })}
                      disabled={locked}
                      className={inputCls}
                    >
                      <option value="">—</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </Td>
                  {!locked ? (
                    <Td className="text-right">
                      <button
                        type="button"
                        className="text-xs font-bold text-fest-red hover:underline"
                        onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                        disabled={rows.length <= 1}
                      >
                        {removeLabel}
                      </button>
                    </Td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>
      {!locked ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="chip hover:bg-fest-yellow"
            onClick={() => setRows((prev) => [...prev, emptyRow(defaultHouse, prev.length + 1)])}
          >
            {addRowLabel}
          </button>
          <WrSubmit>{saveLabel}</WrSubmit>
        </div>
      ) : null}
    </form>
  );
}
