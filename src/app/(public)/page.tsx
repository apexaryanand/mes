import Link from "next/link";
import { HappeningNow } from "@/components/public/happening-now";
import { LatestResults } from "@/components/public/latest-results";
import { LeadingSchools } from "@/components/public/leading-schools";
import { LiveFeed } from "@/components/public/live-feed";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getLiveUpdates,
  getMedia,
  getPublishedResults,
  getScheduledEvents,
  getSettings,
  getStandings,
} from "@/lib/data/queries";

export default async function HomePage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [settings, events, results, standings, updates, media] = await Promise.all([
    getSettings(),
    getScheduledEvents(),
    getPublishedResults(),
    getStandings(),
    getLiveUpdates(),
    getMedia(),
  ]);

  const todayEvents = events.filter((e) => e.day_number === (settings.current_day ?? 2));
  const nav = [
    [t.results, "/results"],
    [t.schools, "/schools"],
    [t.programmes, "/programmes"],
    [t.schedule, "/schedule"],
    [t.stages, "/stages"],
    [t.liveUpdates, "/live"],
    [t.news, "/news"],
    [t.photos, "/photos"],
    [t.videos, "/videos"],
    [t.interviews, "/interviews"],
  ] as const;

  return (
    <div className="grid gap-10">
      <section className="border border-line bg-paper-white px-4 py-6 md:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-deep">
          <span>{t.official}</span>
          <StatusBadge
            status={settings.live_status === "live" ? "live" : "completed"}
            label={settings.live_status === "live" ? t.live : t.completed}
          />
        </div>
        <h1 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
          {locale === "ml" ? settings.name_ml : settings.name_en}
        </h1>
        <p className="mt-2 text-lg text-muted">
          {locale === "ml" ? settings.venue_ml : settings.venue_en} ·{" "}
          {locale === "ml" ? settings.location_ml : settings.location_en}
        </p>
        <p className="mt-4 text-sm">
          {t.currentDay}: {t.day} {settings.current_day ?? 2} · {settings.start_date} –{" "}
          {settings.end_date}
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">{t.happeningNow}</h2>
          <Link href="/schedule" className="text-sm text-kerala-dark">
            {t.viewAll}
          </Link>
        </div>
        <HappeningNow events={todayEvents} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">{t.latestResults}</h2>
          <Link href="/results" className="text-sm text-kerala-dark">
            {t.viewAll}
          </Link>
        </div>
        <LatestResults results={results.slice(0, 8)} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">{t.leadingSchools}</h2>
          <Link href="/schools" className="text-sm text-kerala-dark">
            {t.viewAll}
          </Link>
        </div>
        <LeadingSchools standings={standings} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl">{t.liveUpdates}</h2>
            <Link href="/live" className="text-sm text-kerala-dark">
              {t.viewAll}
            </Link>
          </div>
          <LiveFeed updates={updates.slice(0, 5)} />
        </div>
        <div>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl">{t.latestMedia}</h2>
            <Link href="/photos" className="text-sm text-kerala-dark">
              {t.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {media.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.kind === "video" ? "/videos" : "/photos"}
                className="overflow-hidden rounded border border-line bg-paper-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt={locale === "ml" ? item.title_ml : item.title_en}
                  className="aspect-[4/3] w-full object-cover"
                />
                <p className="p-2 text-sm">
                  {locale === "ml" ? item.title_ml : item.title_en}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-4 text-2xl">{t.quickNav}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="min-h-12 rounded border border-line bg-paper-white px-3 py-3 text-center text-sm font-medium"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
