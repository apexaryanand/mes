import Link from "next/link";
import { notFound } from "next/navigation";
import { EventResultActions } from "@/components/public/event-result-actions";
import { LiveFeed } from "@/components/public/live-feed";
import { ResultTable } from "@/components/public/result-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getArticles,
  getEventBySlug,
  getInterviews,
  getLiveUpdates,
  getMedia,
  getResultForEvent,
} from "@/lib/data/queries";
import { formatTime } from "@/lib/utils";

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

  const [result, updates, media, articles, interviews] = await Promise.all([
    getResultForEvent(event.id),
    getLiveUpdates(),
    getMedia(),
    getArticles(),
    getInterviews(),
  ]);

  const relatedUpdates = updates.filter((u) => u.scheduled_event_id === event.id);
  const relatedMedia = media.filter((m) => m.scheduled_event_id === event.id);
  const relatedArticles = articles.filter((a) => a.related_event_id === event.id);
  const relatedInterviews = interviews.filter((i) => i.scheduled_event_id === event.id);

  return (
    <div className="grid gap-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/results" className="hover:text-kerala-dark">
          {t.results}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{tName(locale, event.programme)}</span>
      </nav>

      <header className="hero-on-dark relative overflow-hidden rounded-[var(--radius-lg)] p-6 text-white md:p-8 [background:var(--grad-hero)]">
        <div className="kolam-bg absolute inset-0 opacity-[0.1]" aria-hidden />
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
          <EventResultActions result={result} />
          <ResultTable
            entries={result.entries}
            eventSlug={event.slug}
            programmeName={tName(locale, event.programme)}
            categoryName={tName(locale, event.category)}
          />
        </>
      ) : (
        <div className="card p-10 text-center text-muted">{t.noResults}</div>
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
                className="group overflow-hidden rounded-[var(--radius)] border border-line"
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

      {relatedUpdates.length ? (
        <section>
          <SectionHeader eyebrow={t.reporter} title={t.liveUpdates} />
          <LiveFeed updates={relatedUpdates} />
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
                  className="card card-hover block p-4 font-medium hover:text-kerala-dark"
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
