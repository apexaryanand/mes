import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveFeed } from "@/components/public/live-feed";
import { ResultTable } from "@/components/public/result-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
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
    <div className="grid gap-6">
      <p className="text-sm">
        <Link href="/results">{t.results}</Link> / {tName(locale, event.programme)}
      </p>
      <header className="grid gap-2">
        <StatusBadge status={event.status} label={t[event.status === "live" ? "live" : event.status === "delayed" ? "delayed" : event.status === "completed" ? "completed" : event.status === "cancelled" ? "cancelled" : "upcoming"]} />
        <h1 className="font-display text-4xl">{tName(locale, event.programme)}</h1>
        <p className="text-lg text-muted">{tName(locale, event.category)}</p>
        <p className="text-sm">
          {t.stage}: {tName(locale, event.stage)} · {t.day} {event.day_number} ·{" "}
          {formatTime(event.start_time, locale)}
        </p>
      </header>

      {result ? (
        <ResultTable entries={result.entries} />
      ) : (
        <p className="text-muted">{t.noResults}</p>
      )}

      {relatedInterviews[0] ? (
        <Link
          href={`/interviews/${relatedInterviews[0].slug}`}
          className="inline-flex min-h-12 items-center justify-center rounded bg-kerala px-4 text-paper-white"
        >
          {t.watchInterview}
        </Link>
      ) : null}

      {relatedMedia.length ? (
        <section>
          <h2 className="font-display mb-3 text-2xl">{t.latestMedia}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {relatedMedia.map((item) => (
              <Link key={item.id} href={item.kind === "video" ? "/videos" : "/photos"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbnail_url ?? item.url} alt="" className="aspect-[4/3] w-full rounded border border-line object-cover" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedUpdates.length ? (
        <section>
          <h2 className="font-display mb-3 text-2xl">{t.liveUpdates}</h2>
          <LiveFeed updates={relatedUpdates} />
        </section>
      ) : null}

      {relatedArticles.length ? (
        <section>
          <h2 className="font-display mb-3 text-2xl">{t.news}</h2>
          <ul className="grid gap-2">
            {relatedArticles.map((a) => (
              <li key={a.id}>
                <Link href={`/news/${a.slug}`} className="hover:underline">
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
