"use client";

import { CertificateActions } from "@/components/public/certificate-actions";
import { OfficialResultsPanel } from "@/components/public/official-results-panel";
import { isCertificateEligible } from "@/lib/certificates";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { PublishedResultView } from "@/lib/types";

export function EventResultActions({ result }: { result: PublishedResultView }) {
  const { locale } = useI18n();
  const winner = result.entries.find((e) => isCertificateEligible(e.rank)) ?? result.entries[0];
  if (!winner) return <OfficialResultsPanel resultSet={result.result_set} />;

  const programmeName = tName(locale, result.event.programme);
  const categoryName = tName(locale, result.event.category);

  return (
    <div className="grid gap-3">
      <OfficialResultsPanel resultSet={result.result_set} />
      {isCertificateEligible(winner.rank) ? (
        <CertificateActions
          entry={winner}
          event={result.event}
          programmeName={programmeName}
          categoryName={categoryName}
        />
      ) : null}
    </div>
  );
}
