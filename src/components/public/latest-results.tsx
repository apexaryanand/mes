"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Medal } from "@/components/ui/medal";
import { CertificateActions } from "@/components/public/certificate-actions";
import { HouseBadge, houseColorHex } from "@/components/public/house-badge";
import { isCertificateEligible } from "@/lib/certificates";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { PublishedResultView } from "@/lib/types";
import { formatClock } from "@/lib/utils";

export function LatestResults({ results }: { results: PublishedResultView[] }) {
  const { locale, t } = useI18n();

  if (!results.length)
    return <EmptyState icon="results" title={t.noResults} description={t.emptyHint} />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {results.map((block) => {
        const podium = block.entries.filter((e) => isCertificateEligible(e.rank)).slice(0, 3);
        const winner = podium[0] ?? block.entries[0];
        if (!winner) return null;
        const hex = houseColorHex(winner.house.color);
        const programme = tName(locale, block.event.programme);
        const category = tName(locale, block.event.category);

        return (
          <article
            key={block.result_set.id}
            className="card relative flex flex-col overflow-hidden p-4 pl-5"
            style={{ borderLeftWidth: 6, borderLeftColor: hex }}
          >
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/events/${block.event.slug}`}
                className="font-display line-clamp-2 text-lg font-black text-fest-ink underline-offset-2 hover:underline"
              >
                {programme}
              </Link>
              {block.result_set.published_at ? (
                <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-muted">
                  {t.justIn} · {formatClock(block.result_set.published_at)}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-muted">
              {category}
            </p>

            <div className="mt-3 flex items-center gap-3">
              <Medal rank={winner.rank} className="h-12 w-12 text-base" />
              <div className="min-w-0 flex-1">
                <p className="font-display line-clamp-2 text-xl font-black leading-tight">
                  {winner.participant_name}
                </p>
                <Link href={`/houses/${winner.house.slug}`} className="mt-1 inline-block">
                  <HouseBadge house={winner.house} />
                </Link>
              </div>
            </div>

            {podium.length > 1 ? (
              <ol className="mt-3 space-y-1.5 border-t-2 border-fest-ink/10 pt-3">
                {podium.slice(1).map((row) => (
                  <li key={row.id} className="flex items-center gap-2 text-sm">
                    <Medal rank={row.rank} className="h-7 w-7 text-[11px]" />
                    <span className="min-w-0 flex-1 truncate font-bold">{row.participant_name}</span>
                    <HouseBadge house={row.house} className="shrink-0" />
                  </li>
                ))}
              </ol>
            ) : null}

            {isCertificateEligible(winner.rank) ? (
              <div className="mt-4">
                <CertificateActions
                  entry={winner}
                  event={block.event}
                  programmeName={programme}
                  categoryName={category}
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
