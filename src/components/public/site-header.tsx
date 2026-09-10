"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primary: Array<{ href: string; label: string }> = [
    { href: "/", label: t.home },
    { href: "/results", label: t.results },
    { href: "/schedule", label: t.schedule },
    { href: "/reportings", label: t.reportings },
    { href: "/houses", label: t.houses },
    { href: "/news", label: t.news },
  ];

  const drawerLinks: Array<{ href: string; label: string }> = [
    ...primary,
    { href: "/programmes", label: t.programmes },
    { href: "/stages", label: t.stages },
    { href: "/photos", label: t.photos },
    { href: "/videos", label: t.videos },
    { href: "/interviews", label: t.interviews },
    { href: "/submit", label: t.submit },
    { href: "/search", label: t.search },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        <Link href="/" className="group flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
          <span className="flex h-9 w-9 shrink-0 -rotate-3 items-center justify-center border-2 border-ink bg-festival-yellow text-ink shadow-[3px_3px_0_var(--ink)] sm:h-10 sm:w-10">
            <span className="font-display text-[10px] font-black tracking-tight text-white sm:text-xs">M</span>
          </span>
          <span className="min-w-0">
            <span className="font-display block truncate text-base font-bold leading-tight text-kerala-dark sm:text-lg">
              {t.brand}
            </span>
            <span className="hidden truncate text-xs text-muted sm:block">{t.hostedAt}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          {primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname === l.href}
              className={cn(
                "nav-underline py-1",
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
          aria-label={t.search}
          className="hidden min-h-10 min-w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-kerala-dark md:inline-flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        </Link>

        <button
          type="button"
          className="flex min-h-9 min-w-9 items-center justify-center rounded-full border border-line text-kerala-dark md:hidden"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <nav
          className={cn(
            "absolute right-0 top-0 flex h-full w-72 max-w-[82vw] flex-col gap-1 overflow-y-auto bg-paper-white p-4 shadow-[var(--shadow-lg)] transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <p className="section-eyebrow mb-2 px-2">{t.brandShort}</p>
          {drawerLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex min-h-12 items-center rounded-xl px-3 text-base font-medium transition-colors",
                pathname === l.href
                  ? "bg-kerala-soft text-kerala-dark"
                  : "text-ink hover:bg-paper",
              )}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
