import Link from "next/link";
import { HouseBadge } from "@/components/public/house-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { EventSettings, House, Locale } from "@/lib/types";

export function FestivalHero({
  locale,
  t,
  settings,
  houses,
  todayEventsCount,
  resultsCount,
  liveCount,
  isLive,
  currentDay,
}: {
  locale: Locale;
  t: Dictionary;
  settings: EventSettings;
  houses: House[];
  todayEventsCount: number;
  resultsCount: number;
  liveCount: number;
  isLive: boolean;
  currentDay: number;
}) {
  const eventTitle = locale === "ml" ? settings.name_ml : settings.name_en;
  const venue = locale === "ml" ? settings.venue_ml : settings.venue_en;

  return (
    <section className="hero-on-dark festival-hero relative -mt-3 mx-[calc(50%-50vw)] w-screen overflow-hidden text-white sm:-mt-6">
      <div className="festival-mesh absolute inset-0" aria-hidden />
      <div className="confetti-dots absolute inset-0 opacity-30" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-3 py-5 sm:px-4 sm:py-7 md:px-6 md:py-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-eyebrow hero-accent before:[background:var(--grad-festival)] max-sm:text-[0.65rem]">
                {t.official}
              </span>
              <StatusBadge
                status={isLive ? "live" : "completed"}
                label={isLive ? t.live : t.upcoming}
                dark
              />
            </div>

            <p className="font-display mt-3 text-[clamp(2.5rem,8vw,4.5rem)] font-black leading-none tracking-tight">
              MESTA
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-white/80 sm:text-base">
              {t.tagline}
            </p>
            <h1 className="mt-3 font-display text-display-hero-compact font-bold text-white/95">
              {eventTitle}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs hero-muted sm:text-sm">
              <span className="font-semibold hero-accent">{venue}</span>
              <span aria-hidden>·</span>
              <span>
                {t.day} {currentDay} · {settings.start_date} – {settings.end_date}
              </span>
            </p>

            {houses.length ? (
              <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label={t.houses}>
                {houses.map((house) => (
                  <Link
                    key={house.id}
                    href={`/houses/${house.slug}`}
                    role="listitem"
                    className="transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <HouseBadge house={house} />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hidden shrink-0 flex-col gap-2 sm:flex">
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

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <StatCard
            label={t.housesCompeting}
            value={houses.length}
            accent="green"
            className="border-white/20 bg-white/95 shadow-md backdrop-blur"
          />
          <StatCard
            label={t.eventsToday}
            value={todayEventsCount}
            accent="gold"
            className="border-white/20 bg-white/95 shadow-md backdrop-blur"
          />
          <StatCard
            label={t.resultsPublished}
            value={resultsCount}
            accent="indigo"
            className="border-white/20 bg-white/95 shadow-md backdrop-blur"
          />
          <StatCard
            label={t.liveNow}
            value={liveCount}
            accent="red"
            className="border-white/20 bg-white/95 shadow-md backdrop-blur"
          />
        </div>

        <div className="mt-4 flex gap-2 sm:hidden">
          <ButtonLink href="/results" variant="gold" size="sm" className="flex-1 justify-center">
            {t.exploreResults}
          </ButtonLink>
          <ButtonLink
            href="/schedule"
            variant="outline"
            size="sm"
            className="flex-1 justify-center border-white/40 bg-white/10 text-white"
          >
            {t.viewSchedule}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
