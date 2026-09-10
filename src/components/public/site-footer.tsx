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
    <footer className="relative mt-auto overflow-hidden text-paper [background:var(--grad-hero)]">
      <div className="kolam-bg absolute inset-0 opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-3 py-8 sm:gap-10 sm:px-4 sm:py-12 md:grid-cols-[1.4fr_repeat(4,1fr)] md:px-6">
        <div>
          <p className="font-display text-2xl font-bold text-gold-light">{t.brand}</p>
          <p className="mt-2 text-sm text-paper/85">{t.eventName}</p>
          <p className="text-sm text-paper/70">
            {t.hostedAt} · {t.location}
          </p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-paper/60">
            {t.footerNote}
          </p>
        </div>
        {groups.map((group) => (
          <div key={group.title}>
            <p className="text-xs font-bold uppercase tracking-wider text-gold-light/90">
              {group.title}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-paper/75 transition-colors hover:text-gold-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-6xl px-3 py-3 text-xs text-paper/60 sm:px-4 sm:py-4 md:px-6">
          {t.littleKites}
        </div>
      </div>
    </footer>
  );
}
