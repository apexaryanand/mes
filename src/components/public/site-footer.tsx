"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-line bg-kerala-dark text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-xl text-gold">{t.brand}</p>
          <p className="mt-1">{t.eventName}</p>
          <p className="text-paper/80">
            {t.hostedAt} · {t.location}
          </p>
          <p className="mt-3 text-paper/70">{t.littleKites}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/results">{t.results}</Link>
          <Link href="/schedule">{t.schedule}</Link>
          <Link href="/submit">{t.submit}</Link>
          <Link href="/war-room/login">{t.warRoom}</Link>
        </div>
      </div>
    </footer>
  );
}
