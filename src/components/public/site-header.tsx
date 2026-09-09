"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: Array<{ href: string; label: string }> = [
    { href: "/", label: t.home },
    { href: "/results", label: t.results },
    { href: "/schedule", label: t.schedule },
    { href: "/live", label: t.liveUpdates },
    { href: "/schools", label: t.schools },
    { href: "/news", label: t.news },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="min-w-0 flex-1">
          <p className="font-display text-lg leading-tight text-kerala-dark">
            {t.brand}
          </p>
          <p className="truncate text-xs text-muted">{t.hostedAt}</p>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "py-2",
                pathname === l.href ? "text-kerala-dark" : "text-muted hover:text-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <LanguageToggle compact />
        <Link
          href="/search"
          className="hidden min-h-9 items-center rounded border border-line px-3 text-sm text-muted md:inline-flex"
        >
          {t.search}
        </Link>
        <button
          type="button"
          className="min-h-10 min-w-10 rounded border border-line md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-line px-4 py-3 md:hidden">
          {([...links, 
            { href: "/programmes", label: t.programmes },
            { href: "/stages", label: t.stages },
            { href: "/photos", label: t.photos },
            { href: "/videos", label: t.videos },
            { href: "/interviews", label: t.interviews },
            { href: "/submit", label: t.submit },
            { href: "/search", label: t.search },
          ] as Array<{ href: string; label: string }>).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="min-h-11 py-2 text-base"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
