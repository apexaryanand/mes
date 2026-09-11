"use client";

import Link from "next/link";
import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { certificatePagePath, isCertificateEligible } from "@/lib/certificates";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, certificateShareMessage } from "@/lib/share";
import type { ResultEntryView, ScheduledEventView } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CertificateActions({
  entry,
  event,
  programmeName,
  categoryName,
  compact = false,
  className,
}: {
  entry: ResultEntryView;
  event: Pick<ScheduledEventView, "slug">;
  programmeName: string;
  categoryName: string;
  compact?: boolean;
  className?: string;
}) {
  const { locale, t } = useI18n();

  if (!isCertificateEligible(entry.rank) || !entry.participant_name) return null;

  const certificateUrl = absoluteUrl(`/certificates/${entry.id}`);
  const shareText = certificateShareMessage({
    locale,
    name: entry.participant_name,
    programme: programmeName,
    category: categoryName,
    house: tName(locale, entry.house),
    rank: entry.rank ?? 1,
    certificateUrl,
  });

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Link
        href={certificatePagePath(entry.id)}
        className={cn(
          "inline-flex min-h-8 items-center justify-center gap-1.5 border-2 border-fest-ink bg-paper-white px-2.5 text-xs font-bold text-fest-ink shadow-[var(--shadow-hard-xs)] transition-colors hover:bg-fest-yellow",
          compact && "min-h-7 px-2",
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="M4 6h16v12H4zM8 10h8M8 14h5" />
        </svg>
        {!compact ? <span>{t.downloadCertificate}</span> : null}
      </Link>
      <WhatsAppShareButton text={shareText} compact={compact} />
    </div>
  );
}
