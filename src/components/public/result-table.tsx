"use client";

import Link from "next/link";
import { Medal } from "@/components/ui/medal";
import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, resultShareMessage } from "@/lib/share";
import type { ResultEntryView } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResultTable({
  entries,
  eventSlug,
  programmeName,
  categoryName,
}: {
  entries: ResultEntryView[];
  eventSlug?: string;
  programmeName?: string;
  categoryName?: string;
}) {
  const { locale, t } = useI18n();

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="bg-kerala-soft text-kerala-dark">
          <tr>
            <th className="px-4 py-3 font-semibold">{t.rank}</th>
            <th className="px-4 py-3 font-semibold">{t.participant}</th>
            <th className="px-4 py-3 font-semibold">{t.school}</th>
            <th className="px-4 py-3 text-right font-semibold">{t.marks}</th>
            <th className="px-4 py-3 text-center font-semibold">{t.grade}</th>
            <th className="px-4 py-3 text-right font-semibold">{t.points}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((row, i) => (
            <tr
              key={row.id}
              className={cn(
                "border-t border-line/70",
                i % 2 === 1 && "bg-paper/40",
              )}
            >
              <td className="px-4 py-3">
                <Medal rank={row.rank} className="h-8 w-8 text-sm" />
              </td>
              <td className="px-4 py-3 font-medium">{row.participant_name ?? "—"}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/schools/${row.school.slug}`}
                  className="text-kerala-dark hover:underline"
                >
                  {tName(locale, row.school)}
                </Link>
              </td>
              <td className="px-4 py-3 text-right tabular">{row.marks ?? "—"}</td>
              <td className="px-4 py-3 text-center font-semibold">{row.grade ?? "—"}</td>
              <td className="px-4 py-3 text-right tabular font-semibold text-kerala-dark">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-line md:hidden">
        {entries.map((row) => (
          <li key={row.id} className="p-3 sm:p-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Medal rank={row.rank} className="h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{row.participant_name ?? "—"}</p>
                <Link
                  href={`/schools/${row.school.slug}`}
                  className="text-sm text-kerala-dark hover:underline"
                >
                  {tName(locale, row.school)}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {t.marks}: {row.marks ?? "—"} · {t.grade}: {row.grade ?? "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="tabular text-lg font-bold text-kerala-dark">{row.points}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted">{t.points}</p>
              </div>
            </div>
            {eventSlug && programmeName && categoryName && row.rank === 1 ? (
              <div className="mt-3">
                <WhatsAppShareButton
                  text={resultShareMessage({
                    locale,
                    programme: programmeName,
                    category: categoryName,
                    winner: row.participant_name ?? undefined,
                    school: tName(locale, row.school),
                    rank: row.rank,
                    pageUrl: absoluteUrl(`/events/${eventSlug}`),
                  })}
                />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
