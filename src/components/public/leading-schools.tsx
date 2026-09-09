"use client";

import Link from "next/link";
import { Medal } from "@/components/ui/medal";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { SchoolStanding } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LeadingSchools({ standings }: { standings: SchoolStanding[] }) {
  const { locale, t } = useI18n();
  const top = standings.filter((s) => s.overall_rank).slice(0, 8);

  if (!top.length) {
    return <div className="card p-6 text-center text-sm text-muted sm:p-8">{t.noResults}</div>;
  }

  const podium = top.slice(0, 3);
  const rest = top.slice(3);

  return (
    <div className="grid gap-2 sm:gap-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {podium.map((row) => (
          <Link
            key={row.school_id}
            href={`/schools/${row.school.slug}`}
            className={cn(
              "card card-hover relative flex flex-col items-center gap-1 overflow-hidden p-2.5 text-center sm:gap-2 sm:p-5",
              row.overall_rank === 1 && "sm:order-2 ring-1 ring-gold/40",
              row.overall_rank === 2 && "sm:order-1 sm:mt-4",
              row.overall_rank === 3 && "sm:order-3 sm:mt-4",
            )}
          >
            <Medal rank={row.overall_rank ?? 0} className="h-9 w-9 text-sm sm:h-14 sm:w-14 sm:text-2xl" />
            <p className="font-display line-clamp-2 text-[11px] font-bold leading-tight sm:mt-1 sm:text-base">
              {tName(locale, row.school)}
            </p>
            <p className="font-display gradient-text text-xl font-black tabular sm:text-3xl">
              {row.total_points}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted">{t.points}</p>
          </Link>
        ))}
      </div>

      {rest.length ? (
        <ol className="card divide-y divide-line overflow-hidden">
          {rest.map((row) => (
            <li key={row.school_id}>
              <Link
                href={`/schools/${row.school.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-kerala-soft/50 sm:gap-4 sm:px-4 sm:py-3"
              >
                <Medal rank={row.overall_rank ?? 0} className="h-9 w-9 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{tName(locale, row.school)}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {row.grade_a_count} {t.aGrades} · {row.grade_b_count} {t.bGrades} ·{" "}
                    {row.grade_c_count} {t.cGrades}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular text-lg font-bold text-kerala-dark">
                    {row.total_points}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    {t.points}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
