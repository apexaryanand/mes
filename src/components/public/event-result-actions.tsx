"use client";

import { CertificateActions } from "@/components/public/certificate-actions";
import { OfficialResultsPanel } from "@/components/public/official-results-panel";
import { isCertificateEligible } from "@/lib/certificates";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { PublishedResultView } from "@/lib/types";

export function EventResultActions({ result }: { result: PublishedResultView }) {
  const { locale } = useI18n();
  const winners = result.entries.filter((e) => isCertificateEligible(e.rank));
  const programmeName = tName(locale, result.event.programme);
  const categoryName = tName(locale, result.event.category);

  return (
    <div className="grid gap-3">
      <OfficialResultsPanel resultSet={result.result_set} eventSlug={result.event.slug} />
      {winners.length ? (
        <div className="flex flex-wrap gap-2">
          {winners.map((entry) => (
            <CertificateActions
              key={entry.id}
              entry={entry}
              event={result.event}
              programmeName={programmeName}
              categoryName={categoryName}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
