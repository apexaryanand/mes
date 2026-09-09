"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { ResultEntryView } from "@/lib/types";

export function ResultTable({ entries }: { entries: ResultEntryView[] }) {
  const { locale, t } = useI18n();

  return (
    <div className="overflow-x-auto rounded border border-line bg-paper-white">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-line bg-kerala-soft text-kerala-dark">
          <tr>
            <th className="px-3 py-2">{t.rank}</th>
            <th className="px-3 py-2">{t.participant}</th>
            <th className="px-3 py-2">{t.school}</th>
            <th className="px-3 py-2">{t.marks}</th>
            <th className="px-3 py-2">{t.grade}</th>
            <th className="px-3 py-2">{t.points}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row) => (
            <tr key={row.id} className="border-b border-line/70">
              <td className="px-3 py-2 tabular font-semibold">{row.rank}</td>
              <td className="px-3 py-2">{row.participant_name ?? "—"}</td>
              <td className="px-3 py-2">
                <Link href={`/schools/${row.school.slug}`} className="hover:underline">
                  {tName(locale, row.school)}
                </Link>
              </td>
              <td className="px-3 py-2 tabular">{row.marks ?? "—"}</td>
              <td className="px-3 py-2 font-semibold">{row.grade ?? "—"}</td>
              <td className="px-3 py-2 tabular">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
