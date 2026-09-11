import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LatestResults } from "@/components/public/latest-results";
import { OfficialResultsPanel } from "@/components/public/official-results-panel";
import { ResultTable } from "@/components/public/result-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getArticles,
  getEventBySlug,
  getInterviews,
  getMedia,
  getResultForEvent,
} from "@/lib/data/queries";
import { shareMetadata, winnerShareCopy } from "@/lib/share-metadata";
import { formatTime } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  const result = await getResultForEvent(event.id);
  const winner = result?.entries[0];
  if (winner?.participant_name) {
    const copy = winnerShareCopy({
      name: winner.participant_name,
      programme: tName("en", event.programme),
      rank: winner.rank ?? 1,
    });
    return shareMetadata({
      title: copy.title,
      description: copy.description,
      path: `/events/${slug}`,
    });
  }
  return shareMetadata({
    title: tName("en", event.programme),
    description: `${tName("en", event.category)} · MESTA Kalolsavam`,
    path: `/events/${slug}`,
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const [result, media, articles, interviews] = await Promise.all([
    getResultForEvent(event.id),
    getMedia(),
    getArticles(),
    getInterviews(),
  ]);
  const relatedMedia = media.filter((m) => m.scheduled_event_id === event.id);
  const relatedArticles = articles.filter((a) => a.related_event_id === event.id);
  const relatedInterviews = interviews.filter((i) => i.scheduled_event_id === event.id);

  return (
    <div className="grid gap-5 sm:gap-8">
      <Breadcrumb
        parentHref="/results"
        parentLabel={t.results}
        current={tName(locale, event.programme)}
      />

      <header className="hero-on-dark relative overflow-hidden border-[var(--border-w)] border-fest-ink bg-fest-ink p-5 text-paper shadow-[var(--shadow-hard)] sm:p-6 md:p-8">
        <div
          className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(var(--fest-yellow)_1.5px,transparent_1.5px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div className="relative">
          <StatusBadge
            status={event.status}
            label={statusLabel(locale, event.status)}
            dark
          />
          <h1 className="font-display text-display-md mt-3 font-black">
            {tName(locale, event.programme)}
          </h1>
          <p className="mt-1 text-lg hero-subtext">{tName(locale, event.category)}</p>
          <p className="mt-4 flex flex-wrap gap-x-2 text-sm hero-muted">
            <span>
              {t.stage}: <span className="hero-accent">{tName(locale, event.stage)}</span>
            </span>
            <span aria-hidden>·</span>
            <span>
              {t.day} {event.day_number}
            </span>
            <span aria-hidden>·</span>
            <span>{formatTime(event.start_time, locale)}</span>
          </p>
        </div>
      </header>

      {result ? (
        <>
          <LatestResults results={[result]} />
          <OfficialResultsPanel resultSet={result.result_set} eventSlug={event.slug} />
          <ResultTable
            entries={result.entries}
            eventSlug={event.slug}
            programmeName={tName(locale, event.programme)}
            categoryName={tName(locale, event.category)}
          />
        </>
      ) : (
        <EmptyState icon="results" title={t.noResults} description={t.emptyHint} />
      )}

      {relatedInterviews[0] ? (
        <ButtonLink href={`/interviews/${relatedInterviews[0].slug}`} variant="gold" size="lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {t.watchInterview}
        </ButtonLink>
      ) : null}

      {relatedMedia.length ? (
        <section>
          <SectionHeader eyebrow={t.photos} title={t.latestMedia} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {relatedMedia.map((item) => (
              <Link
                key={item.id}
                href={item.kind === "video" ? "/videos" : "/photos"}
                className="group overflow-hidden border-2 border-fest-ink shadow-[var(--shadow-hard-xs)] transition-shadow hover:shadow-[var(--shadow-hard-sm)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section>
          <SectionHeader eyebrow={t.news} title={t.news} />
          <ul className="grid gap-2">
            {relatedArticles.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/news/${a.slug}`}
                  className="card card-hover block p-4 font-bold"
                >
                  {locale === "ml" ? a.title_ml : a.title_en}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
