"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();

  const groups: Array<{ title: string; links: Array<[string, string]> }> = [
    {
      title: t.results,
      links: [
        [t.results, "/results"],
        [t.houses, "/houses"],
        [t.programmes, "/programmes"],
      ],
    },
    {
      title: t.schedule,
      links: [
        [t.schedule, "/schedule"],
        [t.stages, "/stages"],
        [t.reportings, "/reportings"],
      ],
    },
    {
      title: t.news,
      links: [
        [t.news, "/news"],
        [t.photos, "/photos"],
        [t.videos, "/videos"],
        [t.interviews, "/interviews"],
      ],
    },
    {
      title: t.submit,
      links: [
        [t.submit, "/submit"],
        [t.search, "/search"],
        [t.warRoom, "/war-room/login"],
      ],
    },
  ];

  return (
    <footer className="relative mt-auto bg-fest-ink text-paper">
      <div className="rule-festival" aria-hidden />

      <div className="mx-auto grid max-w-6xl gap-8 px-3 py-10 sm:grid-cols-2 sm:px-4 sm:py-12 md:grid-cols-[1.5fr_1fr_1fr] md:px-6 lg:grid-cols-[1.6fr_repeat(4,1fr)]">
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 -rotate-3 items-center justify-center border-2 border-fest-yellow bg-fest-yellow">
              <span className="font-display text-sm font-black text-fest-ink">M</span>
            </span>
            <p className="font-display text-2xl font-black text-fest-yellow">{t.brand}</p>
          </div>
          <p className="mt-3 text-sm text-paper/90">{t.eventName}</p>
          <p className="text-sm text-paper/70">
            {t.hostedAt} · {t.location}
          </p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-paper/60">{t.footerNote}</p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <p className="border-b-2 border-fest-yellow/40 pb-2 text-xs font-black uppercase tracking-wider text-fest-yellow">
              {group.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-block text-paper/75 transition-colors hover:text-fest-yellow"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-white/15">
        <div className="mx-auto max-w-6xl px-3 py-4 text-xs text-paper/60 sm:px-4 md:px-6">
          {t.littleKites}
        </div>
      </div>
    </footer>
  );
}
