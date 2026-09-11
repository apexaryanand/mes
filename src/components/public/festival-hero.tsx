import Image from "next/image";
import Link from "next/link";
import { HouseBadge } from "@/components/public/house-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { EventSettings, House, Locale } from "@/lib/types";

export function FestivalHero({ locale, t, settings, houses, todayEventsCount, resultsCount, liveCount, isLive, currentDay }: { locale: Locale; t: Dictionary; settings: EventSettings; houses: House[]; todayEventsCount: number; resultsCount: number; liveCount: number; isLive: boolean; currentDay: number }) {
  const eventTitle = locale === "ml" ? settings.name_ml : settings.name_en;
  const venue = locale === "ml" ? settings.venue_ml : settings.venue_en;

  return (
    <section className="festival-hero relative -mt-3 mx-[calc(50%-50vw)] w-screen overflow-hidden text-white sm:-mt-6">
      <div className="festival-streamer" aria-hidden="true"><span>കലോത്സവം</span><span>LET THE ARTS ROAR</span><span>കലോത്സവം</span><span>LET THE ARTS ROAR</span></div>
      <div className="festival-confetti festival-confetti-one" aria-hidden="true">✦</div>
      <div className="festival-confetti festival-confetti-two" aria-hidden="true">◆</div>
      <div className="relative mx-auto w-full max-w-6xl px-3 pb-8 pt-12 sm:px-4 sm:pb-16 sm:pt-16 md:px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_19rem]">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3"><span className="festival-kicker">{t.official}</span><StatusBadge status={isLive ? "live" : "completed"} label={isLive ? t.live : t.upcoming} dark /></div>
            <p className="festival-wordmark font-display mt-7 text-[clamp(4rem,15vw,10rem)] font-black leading-[.72] tracking-[-.11em]">MESTA<span className="text-festival-yellow">!</span></p>
            <p className="festival-script mt-5 max-w-xl text-2xl font-bold leading-tight sm:text-4xl">Where every student gets a stage.</p>
            <h1 className="mt-5 max-w-2xl font-display text-display-hero-compact font-black text-white">{eventTitle}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm font-semibold text-white/85"><span>{venue}</span><span aria-hidden>•</span><span>{t.day} {currentDay} · {settings.start_date} – {settings.end_date}</span></p>
            {houses.length ? <div className="mt-5 flex flex-wrap gap-2" role="list" aria-label={t.houses}>{houses.map((house) => <Link key={house.id} href={`/houses/${house.slug}`} role="listitem" className="transition-transform hover:-translate-y-1"><HouseBadge house={house} /></Link>)}</div> : null}
          </div>
          <div className="festival-poster hidden lg:flex lg:flex-col lg:items-center lg:justify-between">
            <div className="w-full border-b-2 border-fest-ink/30 pb-3">
              <Image src="/images/mesta-logo.png" alt="MESTA — Mes Track & Arts" width={220} height={165} className="mx-auto h-auto w-36 rounded-sm object-contain" />
            </div>
            <strong>FEEL<br />THE<br /><em>WONDER</em></strong>
            <span className="festival-poster-bottom">3000+ STUDENTS · ONE STAGE</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">{[[t.housesCompeting, houses.length], [t.eventsToday, todayEventsCount], [t.resultsPublished, resultsCount], [t.liveNow, liveCount]].map(([label, value], i) => <StatCard key={String(label)} label={String(label)} value={Number(value)} accent={(["green", "gold", "indigo", "red"] as const)[i]} className="festival-stat" />)}</div>
        <div className="mt-5 flex gap-2"><ButtonLink href="/results" variant="gold" size="sm" className="flex-1 justify-center sm:flex-none">{t.exploreResults}</ButtonLink><ButtonLink href="/schedule" variant="outline" size="sm" className="flex-1 justify-center border-white/60 bg-transparent text-white hover:bg-white hover:text-ink sm:flex-none">{t.viewSchedule}</ButtonLink></div>
      </div>
    </section>
  );
}
