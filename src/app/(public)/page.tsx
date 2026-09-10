import Link from "next/link";
import { FestivalHero } from "@/components/public/festival-hero";
import { HappeningNow } from "@/components/public/happening-now";
import { LatestResults } from "@/components/public/latest-results";
import { LeadingHouses } from "@/components/public/leading-houses";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getHouses,
  getMedia,
  getReportings,
  getPublishedResults,
  getScheduledEvents,
  getSettings,
  getStandings,
} from "@/lib/data/queries";

const NAV_ICONS: Record<string, string> = {
  "/results": "M3 5h18M3 10h18M3 15h12",
  "/houses": "M4 20V9l8-5 8 5v11M9 20v-6h6v6",
  "/programmes": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  "/schedule": "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4",
  "/stages": "M3 7h18l-2 5H5zM5 12v7M19 12v7",
  "/news": "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
  "/photos": "M4 6h16v12H4zM8 6l1.5-2h5L16 6M12 15a3 3 0 100-6 3 3 0 000 6z",
  "/videos": "M4 6h16v12H4zM10 9l5 3-5 3z",
  "/interviews": "M4 5h16v10H4zM8 19h8M12 15v4",
};

export default async function HomePage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [settings, events, results, standings, reportings, media, houses] =
    await Promise.all([
      getSettings(),
      getScheduledEvents(),
      getPublishedResults(),
      getStandings(),
      getReportings(),
      getMedia("photo"),
      getHouses(),
    ]);

  const currentDay = settings.current_day ?? 1;
  const todayEvents = events.filter((e) => e.day_number === currentDay);
  const liveCount = events.filter((e) => e.status === "live").length;
  const isLive = settings.live_status === "live";

  const nav = [
    [t.results, "/results"],
    [t.houses, "/houses"],
    [t.programmes, "/programmes"],
    [t.schedule, "/schedule"],
    [t.stages, "/stages"],
    [t.reportings, "/reportings"],
    [t.news, "/news"],
    [t.photos, "/photos"],
    [t.videos, "/videos"],
    [t.interviews, "/interviews"],
  ] as const;

  return (
    <div className="grid gap-5 sm:gap-8 md:gap-10">
      <FestivalHero
        locale={locale}
        t={t}
        settings={settings}
        houses={houses}
        todayEventsCount={todayEvents.length}
        resultsCount={results.length}
        liveCount={liveCount}
        isLive={isLive}
        currentDay={currentDay}
      />

      <Reveal as="section">
        <SectionHeader
          eyebrow={t.live}
          title={t.happeningNow}
          linkHref="/schedule"
          linkLabel={t.viewAll}
        />
        <HappeningNow events={todayEvents} />
      </Reveal>

      <Reveal as="section">
        <SectionHeader
          eyebrow={t.results}
          title={t.latestResults}
          linkHref="/results"
          linkLabel={t.viewAll}
        />
        <LatestResults results={results.slice(0, 8)} />
      </Reveal>

      <Reveal as="section">
        <SectionHeader
          eyebrow={t.points}
          title={t.leadingHouses}
          linkHref="/houses"
          linkLabel={t.viewAll}
        />
        <LeadingHouses standings={standings} />
      </Reveal>

      <section className="grid gap-5 sm:gap-10 lg:grid-cols-2">
        <Reveal>
          <SectionHeader
            eyebrow={t.reportings}
            title={t.reportings}
            linkHref="/reportings"
            linkLabel={t.viewAll}
          />
          {!reportings.length ? (
            <EmptyState icon="results" title={t.noItems} description={t.emptyHint} />
          ) : (
            <div className="grid gap-3">
              {reportings.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href="/reportings"
                  className="card card-hover flex items-center gap-3 p-3"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-fest-ink bg-fest-yellow text-fest-ink">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <p className="line-clamp-2 font-bold">
                      {locale === "ml" ? item.title_ml : item.title_en}
                    </p>
                    <p className="text-xs text-muted">{t.reportingsHelp}</p>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Reveal>
        <Reveal delay={120}>
          <SectionHeader
            eyebrow={t.photos}
            title={t.latestMedia}
            linkHref="/photos"
            linkLabel={t.viewAll}
          />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {media.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.kind === "video" ? "/videos" : "/photos"}
                className="group relative overflow-hidden border-2 border-fest-ink bg-paper-white shadow-[var(--shadow-hard-xs)] transition-shadow hover:shadow-[var(--shadow-hard-sm)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt={locale === "ml" ? item.title_ml : item.title_en}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.kind === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center border-2 border-fest-ink bg-fest-yellow text-fest-ink shadow-[var(--shadow-hard-xs)]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-fest-ink/85 p-2.5">
                  <p className="line-clamp-2 text-sm font-bold text-paper-white">
                    {locale === "ml" ? item.title_ml : item.title_en}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal as="section" className="hidden sm:block">
        <SectionHeader eyebrow={t.exploreMore} title={t.quickNav} />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="card card-hover group flex min-h-24 flex-col items-start justify-between gap-2 p-3 sm:min-h-28 sm:gap-3 sm:p-4"
            >
              <span className="flex h-9 w-9 items-center justify-center border-2 border-fest-ink bg-fest-yellow text-fest-ink transition-colors group-hover:bg-fest-red group-hover:text-white sm:h-10 sm:w-10">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={NAV_ICONS[href] ?? "M4 12h16"} />
                </svg>
              </span>
              <span className="lines-2 line-clamp-2 text-sm font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
