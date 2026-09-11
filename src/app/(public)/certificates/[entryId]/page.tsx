import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateActions } from "@/components/public/certificate-actions";
import { Medal } from "@/components/ui/medal";
import { certificatePdfPath, isCertificateEligible, rankPrizeLabel } from "@/lib/certificates";
import { getPublishedEntryById, getSettings } from "@/lib/data/queries";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { formatDateTime } from "@/lib/utils";

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

  const settings = await getSettings();
  const { entry, event, result_set } = block;
  const rank = entry.rank ?? 1;

  return (
    <div className="mx-auto grid max-w-3xl gap-5 py-2 sm:gap-6 sm:py-4">
      <p className="text-center text-sm text-muted print:hidden">
        <Link href={`/events/${event.slug}`} className="font-bold text-fest-ink hover:underline">
          ← {tName(locale, event.programme)}
        </Link>
      </p>

      <article
        className="certificate-sheet relative overflow-hidden border-4 border-fest-ink bg-paper-white p-6 shadow-[var(--shadow-hard-lg)] sm:p-10 print:border-2 print:shadow-none"
        id="certificate"
      >
        <div className="rule-festival mb-6" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(var(--fest-yellow)_1.5px,transparent_1.5px)] [background-size:20px_20px]"
          aria-hidden
        />

        <div className="relative text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-fest-red">
            {t.official}
          </p>
          <h1 className="font-display mt-2 text-2xl font-black text-fest-ink sm:text-3xl">
            {locale === "ml" ? settings.name_ml : settings.name_en}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {locale === "ml" ? settings.venue_ml : settings.venue_en}
          </p>

          <div className="mx-auto my-6 h-1 w-24 bg-fest-yellow" aria-hidden />

          <p className="text-sm font-bold uppercase tracking-widest text-muted">
            {t.certificateOfAchievement}
          </p>

          <p className="mt-6 text-sm text-muted">{t.certificatePresentedTo}</p>
          <p className="font-display mt-2 text-3xl font-black text-fest-ink sm:text-4xl">
            {entry.participant_name}
          </p>

          <div className="mt-6 flex justify-center">
            <Medal rank={rank} className="h-14 w-14 text-lg sm:h-16 sm:w-16" />
          </div>

          <p className="mt-4 text-lg font-bold text-fest-ink">
            {rankPrizeLabel(locale, rank)}
          </p>
          <p className="mt-2 font-display text-xl font-black text-fest-ink sm:text-2xl">
            {tName(locale, event.programme)}
          </p>
          <p className="mt-1 text-muted">{tName(locale, event.category)}</p>
          <p className="mt-3 text-sm">
            <span className="text-muted">{t.house}: </span>
            <span className="font-bold">{tName(locale, entry.house)}</span>
          </p>
          {(entry.grade || entry.marks != null) && (
            <p className="mt-2 text-sm text-muted">
              {entry.marks != null ? `${t.marks}: ${entry.marks}` : null}
              {entry.marks != null && entry.grade ? " · " : null}
              {entry.grade ? `${t.grade}: ${entry.grade}` : null}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t-2 border-fest-ink/15 pt-6 text-left text-sm">
            <div>
              <p className="font-bold text-fest-ink">{t.certificateConvener}</p>
              <p className="text-muted">MESTA Kalolsavam</p>
            </div>
            <div className="text-right">
              <p className="text-muted">{t.published}</p>
              <p className="font-bold tabular">
                {result_set.published_at
                  ? formatDateTime(result_set.published_at, locale)
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </article>

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
