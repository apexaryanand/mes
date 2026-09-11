"use client";

import { useState } from "react";
import { saveResultDraftForm } from "@/domains/admin/actions";
import { TableCard, Th, Td, WrSubmit } from "@/components/war-room/primitives";
import { suggestGrade } from "@/domains/results/scoring";
import { cn } from "@/lib/utils";
import type { House, Participant, ResultEntryView } from "@/lib/types";

type DraftRow = {
  id: string;
  house_id: string;
  participant_id: string;
  participant_name: string;
  marks: string;
  grade: string;
  rank: string;
};

function toDraft(row: ResultEntryView, fallbackHouse: string): DraftRow {
  return {
    id: row.id ?? "",
    house_id: row.house_id || fallbackHouse,
    participant_id: row.participant_id ?? "",
    participant_name: row.participant_name ?? "",
    marks: row.marks != null ? String(row.marks) : "",
    grade: row.grade ?? "",
    rank: row.rank != null ? String(row.rank) : "",
  };
}

function emptyRow(houseId: string, rank: number): DraftRow {
  return {
    id: "",
    house_id: houseId,
    participant_id: "",
    participant_name: "",
    marks: "",
    grade: "",
    rank: String(rank),
  };
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
  localeHouseName,
}: {
  resultSetId: string;
  locked: boolean;
  saveLabel: string;
  addRowLabel: string;
  removeLabel: string;
  houses: House[];
  participants: Participant[];
  initialRows: ResultEntryView[];
  localeHouseName: (house: House) => string;
}) {
  const defaultHouse = houses[0]?.id ?? "";
  const [rows, setRows] = useState<DraftRow[]>(() => {
    if (initialRows.length) return initialRows.map((r) => toDraft(r, defaultHouse));
    return [1, 2, 3].map((rank) => emptyRow(defaultHouse, rank));
  });

  const inputCls = "field-input min-h-9 w-auto px-2.5 py-1.5 text-sm";

  return (
    <form action={saveResultDraftForm}>
      <input type="hidden" name="resultSetId" value={resultSetId} />
      <input type="hidden" name="count" value={rows.length} />
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
            {rows.map((row, i) => (
              <tr key={`${row.id}-${i}`}>
                <Td>
                  <input type="hidden" name={`id_${i}`} defaultValue={row.id} />
                  <input
                    name={`rank_${i}`}
                    defaultValue={row.rank || i + 1}
                    disabled={locked}
                    className={cn(inputCls, "w-16")}
                  />
                </Td>
                <Td>
                  <select
                    name={`participant_${i}`}
                    defaultValue={row.participant_id}
                    disabled={locked}
                    className={cn(inputCls, "min-w-36")}
                  >
                    <option value="">Manual entry</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <input
                    name={`name_${i}`}
                    defaultValue={row.participant_name}
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
                      <option key={h.id} value={h.id}>
                        {localeHouseName(h)}
                      </option>
                    ))}
                  </select>
                </Td>
                <Td>
                  <input
                    name={`marks_${i}`}
                    defaultValue={row.marks}
                    disabled={locked}
                    className={cn(inputCls, "w-20")}
                  />
                </Td>
                <Td>
                  <select
                    name={`grade_${i}`}
                    defaultValue={
                      row.grade ||
                      suggestGrade(row.marks ? Number(row.marks) : null) ||
                      ""
                    }
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
                      onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                      disabled={rows.length <= 1}
                    >
                      {removeLabel}
                    </button>
                  </Td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
      {!locked ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="chip hover:bg-fest-yellow"
            onClick={() =>
              setRows((prev) => [...prev, emptyRow(defaultHouse, prev.length + 1)])
            }
          >
            {addRowLabel}
          </button>
          <WrSubmit>{saveLabel}</WrSubmit>
        </div>
      ) : null}
    </form>
  );
}
