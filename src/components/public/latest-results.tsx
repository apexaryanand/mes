"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Medal } from "@/components/ui/medal";
import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, resultShareMessage } from "@/lib/share";
import type { PublishedResultView } from "@/lib/types";
import { formatClock } from "@/lib/utils";

export function LatestResults({ results }: { results: PublishedResultView[] }) {
  const { locale, t } = useI18n();

  if (!results.length)
    return <EmptyState icon="results" title={t.noResults} description={t.emptyHint} />;

  return (
    <div className="card festival-table-card mobile-bleed overflow-hidden max-sm:border-x-0">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr>
            <th className="px-4 py-3 font-black">{t.programme}</th>
            <th className="px-4 py-3 font-black">{t.category}</th>
            <th className="px-4 py-3 text-center font-black">{t.rank}</th>
            <th className="px-4 py-3 font-black">{t.participant}</th>
            <th className="px-4 py-3 font-black">{t.house}</th>
            <th className="px-4 py-3 text-right font-black">{t.marks}</th>
            <th className="px-4 py-3 text-center font-black">{t.grade}</th>
            <th className="px-4 py-3 text-right font-black" aria-label={t.shareWhatsApp} />
          </tr>
        </thead>
        <tbody>
          {results.map((block) => {
            const first = block.entries[0];
            if (!first) return null;
            return (
              <tr
                key={block.result_set.id}
                className="border-t-2 border-fest-ink/12"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/events/${block.event.slug}`}
                    className="font-bold text-fest-ink underline-offset-2 hover:underline"
                  >
                    {tName(locale, block.event.programme)}
                  </Link>
                  {block.result_set.published_at ? (
                    <p className="text-xs text-muted">
                      {formatClock(block.result_set.published_at)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">{tName(locale, block.event.category)}</td>
                <td className="px-4 py-3 text-center">
                  <Medal rank={first.rank} className="h-7 w-7 text-xs" />
                </td>
                <td className="px-4 py-3">{first.participant_name}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/houses/${first.house.slug}`}
                    className="hover:underline"
                  >
                    {tName(locale, first.house)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular">{first.marks}</td>
                <td className="px-4 py-3 text-center font-black">{first.grade}</td>
                <td className="px-4 py-3 text-right">
                  <WhatsAppShareButton
                    compact
                    text={resultShareMessage({
                      locale,
                      programme: tName(locale, block.event.programme),
                      category: tName(locale, block.event.category),
                      winner: first.participant_name ?? undefined,
                      house: tName(locale, first.house),
                      rank: first.rank,
                      pageUrl: absoluteUrl(`/events/${block.event.slug}`),
                    })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y-2 divide-fest-ink/15 md:hidden">
        {results.map((block) => {
          const first = block.entries[0];
          if (!first) return null;
          const shareText = resultShareMessage({
            locale,
            programme: tName(locale, block.event.programme),
            category: tName(locale, block.event.category),
            winner: first.participant_name ?? undefined,
            house: tName(locale, first.house),
            rank: first.rank,
            pageUrl: absoluteUrl(`/events/${block.event.slug}`),
          });
          return (
            <li key={block.result_set.id} className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <Link
                  href={`/events/${block.event.slug}`}
                  className="font-display line-clamp-2 text-sm font-black text-fest-ink underline-offset-2 hover:underline sm:text-base"
                >
                  {tName(locale, block.event.programme)}
                </Link>
                <span className="chip shrink-0 px-2 py-0.5 text-[10px] sm:text-xs">
                  {tName(locale, block.event.category)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2.5 sm:mt-3 sm:gap-3">
                <Medal rank={first.rank} className="h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-bold">{first.participant_name}</p>
                  <Link
                    href={`/houses/${first.house.slug}`}
                    className="text-sm text-muted hover:underline"
                  >
                    {tName(locale, first.house)}
                  </Link>
                </div>
                <div className="text-right text-sm">
                  <p className="tabular font-black">{first.marks}</p>
                  <p className="text-muted">{first.grade}</p>
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <WhatsAppShareButton text={shareText} compact />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
