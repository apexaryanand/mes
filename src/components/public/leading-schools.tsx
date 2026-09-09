"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { SchoolStanding } from "@/lib/types";

const medals = ["🥇", "🥈", "🥉"];

export function LeadingSchools({ standings }: { standings: SchoolStanding[] }) {
  const { locale, t } = useI18n();
  const top = standings.filter((s) => s.overall_rank).slice(0, 8);

  return (
    <ol className="grid gap-3">
      {top.map((row) => (
        <li key={row.school_id}>
          <Link
            href={`/schools/${row.school.slug}`}
            className="flex items-start gap-3 rounded border border-line bg-paper-white p-4"
          >
            <span className="w-10 text-center text-2xl">
              {row.overall_rank && row.overall_rank <= 3
                ? medals[row.overall_rank - 1]
                : `#${row.overall_rank}`}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{tName(locale, row.school)}</p>
              <p className="mt-1 text-sm text-muted">
                {row.grade_a_count} {t.aGrades} · {row.grade_b_count} {t.bGrades} ·{" "}
                {row.grade_c_count} {t.cGrades}
              </p>
            </div>
            <div className="text-right">
              <p className="tabular text-xl font-semibold text-kerala-dark">
                {row.total_points}
              </p>
              <p className="text-xs text-muted">{t.points}</p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
