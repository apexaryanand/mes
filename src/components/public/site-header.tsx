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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b-4 border-fest-ink bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label={t.brand}
        >
          <span className="flex h-9 w-9 shrink-0 -rotate-3 items-center justify-center border-2 border-fest-ink bg-fest-yellow shadow-[var(--shadow-hard-xs)] transition-transform duration-200 group-hover:rotate-0 sm:h-10 sm:w-10">
            <span className="font-display text-sm font-black leading-none text-fest-ink">M</span>
          </span>
          <span className="min-w-0">
            <span className="font-display block truncate text-base font-black leading-tight text-fest-ink sm:text-lg">
              {t.brand}
            </span>
            <span className="hidden truncate text-[0.6875rem] leading-tight text-muted lg:block">
              {t.hostedAt}
            </span>
          </span>
        </Link>

        {/* Malayalam labels run longer than English: allow the row to shrink
            and scroll rather than wrap into the logo. */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto text-sm font-bold [-ms-overflow-style:none] [scrollbar-width:none] md:flex lg:gap-6 [&::-webkit-scrollbar]:hidden"
          aria-label={t.quickNav}
        >
          {primary.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={isActive(l.href)}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={cn(
                "nav-underline shrink-0 whitespace-nowrap py-1 transition-colors",
                isActive(l.href) ? "text-fest-ink" : "text-muted hover:text-fest-ink",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LanguageToggle compact />

          <Link
            href="/search"
            aria-label={t.search}
            className="hidden h-9 w-9 items-center justify-center border-2 border-fest-ink bg-paper-white text-fest-ink shadow-[var(--shadow-hard-xs)] transition-all hover:-translate-x-px hover:-translate-y-px hover:bg-fest-yellow-soft hover:shadow-[var(--shadow-hard-sm)] md:inline-flex"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border-2 border-fest-ink bg-paper-white text-fest-ink shadow-[var(--shadow-hard-xs)] transition-colors hover:bg-fest-yellow-soft md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="site-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn("fixed inset-0 z-50 md:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-fest-ink/50 transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <nav
          id="site-drawer"
          className={cn(
            "absolute right-0 top-0 flex h-full w-72 max-w-[84vw] flex-col overflow-y-auto overscroll-contain border-l-4 border-fest-ink bg-paper-white transition-transform duration-300 [transition-timing-function:var(--ease-out)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b-4 border-fest-ink bg-fest-yellow px-4 py-3">
            <span className="font-display text-lg font-black text-fest-ink">{t.brandShort}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center border-2 border-fest-ink bg-paper-white text-fest-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col gap-1 p-3">
            {drawerLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center border-2 px-3 text-base font-bold transition-colors",
                    isActive(l.href)
                      ? "border-fest-ink bg-fest-red text-white shadow-[var(--shadow-hard-xs)]"
                      : "border-transparent text-fest-ink hover:border-fest-ink hover:bg-fest-yellow-soft",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto border-t-4 border-fest-ink p-4">
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
