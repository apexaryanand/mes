"use client";

import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { OfficialResultsPanel } from "@/components/public/official-results-panel";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, resultShareMessage } from "@/lib/share";
import type { PublishedResultView } from "@/lib/types";

export function EventResultActions({ result }: { result: PublishedResultView }) {
  const { locale } = useI18n();
  const winner = result.entries[0];
  if (!winner) return <OfficialResultsPanel resultSet={result.result_set} />;

  const shareText = resultShareMessage({
    locale,
    programme: tName(locale, result.event.programme),
    category: tName(locale, result.event.category),
    winner: winner.participant_name ?? undefined,
    school: tName(locale, winner.school),
    rank: winner.rank,
    pageUrl: absoluteUrl(`/events/${result.event.slug}`),
  });

  return (
    <div className="grid gap-3">
      <OfficialResultsPanel resultSet={result.result_set} />
      <WhatsAppShareButton text={shareText} />
    </div>
  );
}
