"use client";

import Link from "next/link";
import { HouseBadge, houseColorHex } from "@/components/public/house-badge";
import { Medal } from "@/components/ui/medal";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { HouseStanding } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LeadingHouses({ standings }: { standings: HouseStanding[] }) {
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
        {podium.map((row) => {
          const hex = houseColorHex(row.house.color);
          return (
            <Link
              key={row.house_id}
              href={`/houses/${row.house.slug}`}
              className={cn(
                "card card-hover relative flex flex-col items-center gap-1 overflow-hidden p-2.5 text-center sm:gap-2 sm:p-5",
                row.overall_rank === 1 && "sm:order-2 ring-2",
                row.overall_rank === 2 && "sm:order-1 sm:mt-4",
                row.overall_rank === 3 && "sm:order-3 sm:mt-4",
              )}
              style={
                row.overall_rank === 1
                  ? { borderColor: hex, boxShadow: `0 8px 24px -8px ${hex}55` }
                  : { borderLeftWidth: 4, borderLeftColor: hex }
              }
            >
              <Medal rank={row.overall_rank ?? 0} className="h-9 w-9 text-sm sm:h-14 sm:w-14 sm:text-2xl" />
              <HouseBadge house={row.house} className="mt-1" />
              <p className="font-display line-clamp-2 text-[11px] font-bold leading-tight sm:mt-1 sm:text-base">
                {tName(locale, row.house)}
              </p>
              <p
                className="font-display text-xl font-black tabular sm:text-3xl"
                style={{ color: hex }}
              >
                {row.total_points}
              </p>
              <p className="text-xs uppercase tracking-wider text-muted">{t.points}</p>
            </Link>
          );
        })}
      </div>

      {rest.length ? (
        <ol className="card divide-y divide-line overflow-hidden">
          {rest.map((row) => {
            const hex = houseColorHex(row.house.color);
            return (
              <li key={row.house_id}>
                <Link
                  href={`/houses/${row.house.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-paper sm:gap-4 sm:px-4 sm:py-3"
                  style={{ borderLeft: `4px solid ${hex}` }}
                >
                  <Medal rank={row.overall_rank ?? 0} className="h-9 w-9 text-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold">{tName(locale, row.house)}</p>
                      <HouseBadge house={row.house} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {row.grade_a_count} {t.aGrades} · {row.grade_b_count} {t.bGrades} ·{" "}
                      {row.grade_c_count} {t.cGrades}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-lg font-bold" style={{ color: hex }}>
                      {row.total_points}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-muted">
                      {t.points}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
