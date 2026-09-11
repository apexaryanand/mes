import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateActions } from "@/components/public/certificate-actions";
import { CertificateSheet } from "@/components/public/certificate-sheet";
import { certificatePdfPath, isCertificateEligible } from "@/lib/certificates";
import { getPublishedEntryById } from "@/lib/data/queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { shareMetadata, winnerShareCopy } from "@/lib/share-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ entryId: string }>;
}): Promise<Metadata> {
  const { entryId } = await params;
  const block = await getPublishedEntryById(entryId);
  if (!block?.entry.participant_name) return { title: "Certificate" };
  const copy = winnerShareCopy({
    name: block.entry.participant_name,
    programme: tName("en", block.event.programme),
    rank: block.entry.rank ?? 1,
  });
  return shareMetadata({
    title: copy.title,
    description: copy.description,
    path: `/certificates/${entryId}`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const block = await getPublishedEntryById(entryId);

  if (!block || !isCertificateEligible(block.entry.rank) || !block.entry.participant_name) {
    notFound();
  }

  const { entry, event, result_set } = block;
  const rank = entry.rank ?? 1;
  const participantName = entry.participant_name!;

  return (
    <div className="certificate-page mx-auto grid max-w-[960px] gap-5 py-2 sm:gap-6 sm:py-4">
      <p className="text-center text-sm text-muted print:hidden">
        <Link href={`/events/${event.slug}`} className="font-bold text-fest-ink hover:underline">
          ← {tName(locale, event.programme)}
        </Link>
      </p>

      <CertificateSheet
        participantName={participantName}
        rank={rank}
        programme={tName(locale, event.programme)}
        category={tName(locale, event.category)}
        publishedAt={result_set.published_at}
        locale={locale}
        className="print:max-w-none"
      />

      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <CertificateActions
          entry={entry}
          event={event}
          programmeName={tName(locale, event.programme)}
          categoryName={tName(locale, event.category)}
        />
        <Link
          href={certificatePdfPath(entry.id)}
          className="festival-button inline-flex min-h-10 items-center border-fest-ink bg-fest-ink px-4 text-sm font-bold text-fest-yellow"
          download
        >
          {t.downloadCertificatePdf}
        </Link>
      </div>
    </div>
  );
}
