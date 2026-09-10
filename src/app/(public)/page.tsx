import Link from "next/link";
import { HappeningNow } from "@/components/public/happening-now";
import { LatestResults } from "@/components/public/latest-results";
import { LeadingSchools } from "@/components/public/leading-schools";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  getMedia,
  getReportings,
  getPublishedResults,
  getScheduledEvents,
  getSchools,
  getSettings,
  getStandings,
} from "@/lib/data/queries";

const NAV_ICONS: Record<string, string> = {
  "/results": "M3 5h18M3 10h18M3 15h12",
  "/schools": "M4 20V9l8-5 8 5v11M9 20v-6h6v6",
  "/programmes": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  "/schedule": "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4",
  "/stages": "M3 7h18l-2 5H5zM5 12v7M19 12v7",
  "/live": "M12 2v6m0 8v6M2 12h6m8 0h6",
  "/news": "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
  "/photos": "M4 6h16v12H4zM8 6l1.5-2h5L16 6M12 15a3 3 0 100-6 3 3 0 000 6z",
  "/videos": "M4 6h16v12H4zM10 9l5 3-5 3z",
  "/interviews": "M4 5h16v10H4zM8 19h8M12 15v4",
};

export default async function HomePage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [settings, events, results, standings, reportings, media, schools] =
    await Promise.all([
      getSettings(),
      getScheduledEvents(),
      getPublishedResults(),
      getStandings(),
      getReportings(),
      getMedia("photo"),
      getSchools(),
    ]);

  const currentDay = settings.current_day ?? 2;
  const todayEvents = events.filter((e) => e.day_number === currentDay);
  const liveCount = events.filter((e) => e.status === "live").length;
  const isLive = settings.live_status === "live";

  const nav = [
    [t.results, "/results"],
    [t.schools, "/schools"],
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
      {/* Compact hero + inline stats (above the fold) */}
      <section
        className="hero-on-dark relative -mt-3 mx-[calc(50%-50vw)] w-screen overflow-hidden text-white sm:-mt-6 [background:var(--grad-hero)]"
      >
        <div className="kolam-bg absolute inset-0 opacity-[0.12]" aria-hidden />
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl [background:var(--grad-gold)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-7">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 max-w-2xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="section-eyebrow hero-accent before:[background:var(--grad-gold)] max-sm:text-[0.65rem]">
                  {t.official}
                </span>
                <StatusBadge
                  status={isLive ? "live" : "completed"}
                  label={isLive ? t.live : t.completed}
                  dark
                />
              </div>
              <h1 className="font-display text-display-hero-compact mt-1.5 font-black text-white sm:mt-2">
                {locale === "ml" ? settings.name_ml : settings.name_en}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs hero-muted sm:mt-1.5 sm:gap-x-2 sm:text-sm">
                <span className="font-semibold hero-accent">
                  {locale === "ml" ? settings.venue_ml : settings.venue_en}
                </span>
                <span aria-hidden>&middot;</span>
                <span>
                  {t.day} {currentDay} · {settings.start_date} – {settings.end_date}
                </span>
              </p>
            </div>
            <div className="hidden shrink-0 gap-2 sm:flex">
              <ButtonLink href="/results" variant="gold" size="md">
                {t.exploreResults}
              </ButtonLink>
              <ButtonLink
                href="/schedule"
                variant="outline"
                size="md"
                className="border-white/40 bg-white/10 text-white hover:border-[#fde68a] hover:text-[#fde68a]"
              >
                {t.viewSchedule}
              </ButtonLink>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2">
            <StatCard label={t.schoolsCompeting} value={schools.length} accent="green" className="border-white/25 bg-white shadow-md" />
            <StatCard label={t.eventsToday} value={todayEvents.length} accent="gold" className="border-white/25 bg-white shadow-md" />
            <StatCard label={t.resultsPublished} value={results.length} accent="indigo" className="border-white/25 bg-white shadow-md" />
            <StatCard label={t.liveNow} value={liveCount} accent="red" className="border-white/25 bg-white shadow-md" />
          </div>

          <div className="mt-3 flex gap-2 sm:hidden">
            <ButtonLink href="/results" variant="gold" size="sm" className="flex-1 justify-center">
              {t.exploreResults}
            </ButtonLink>
            <ButtonLink
              href="/schedule"
              variant="outline"
              size="sm"
              className="flex-1 justify-center border-white/40 bg-white/10 text-white hover:border-[#fde68a] hover:text-[#fde68a]"
            >
              {t.viewSchedule}
            </ButtonLink>
          </div>
        </div>

      </section>

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
          title={t.leadingSchools}
          linkHref="/schools"
          linkLabel={t.viewAll}
        />
        <LeadingSchools standings={standings} />
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
            <div className="card p-8 text-center text-sm text-muted">{t.noItems}</div>
          ) : (
            <div className="grid gap-3">
              {reportings.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href="/reportings"
                  className="card flex gap-3 p-3 transition-shadow hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-kerala-soft text-kerala-dark">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <p className="truncate font-semibold">
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
                className="group relative overflow-hidden rounded-[var(--radius)] border border-line bg-paper-white shadow-[var(--shadow-sm)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnail_url ?? item.url}
                  alt={locale === "ml" ? item.title_ml : item.title_en}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {item.kind === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-kerala-dark shadow-lg">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-sm font-medium text-white">
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
              className="card card-hover group flex min-h-20 flex-col items-start justify-between gap-2 p-3 sm:min-h-24 sm:gap-3 sm:p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kerala-soft text-kerala-dark transition-colors group-hover:bg-kerala-dark group-hover:text-white sm:h-10 sm:w-10 sm:rounded-xl">
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
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
