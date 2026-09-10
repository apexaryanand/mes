"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/reportings", key: "reportings", icon: "M10 9l5 3-5 3M4 6h16v12H4z" },
  { href: "/results", key: "results", icon: "M3 5h18M3 10h18M3 15h12" },
  { href: "/stages", key: "stages", icon: "M3 7h18l-2 5H5zM5 12v7M19 12v7" },
  { href: "/schedule", key: "schedule", icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" },
] as const;

export function MobileQuickNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      className="surface-glass sticky top-[var(--header-h)] z-30 border-b-2 border-fest-ink md:hidden"
      aria-label={t.quickNav}
    >
      <div className="mx-auto max-w-6xl px-3 py-1.5">
        <ul className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-9 items-center gap-1.5 border-2 border-fest-ink px-3 py-1.5 text-xs font-black transition-colors",
                    active
                      ? "bg-fest-red text-white shadow-[var(--shadow-hard-xs)]"
                      : "bg-paper-white text-fest-ink hover:bg-fest-yellow-soft",
                  )}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className="shrink-0"
                  >
                    <path d={link.icon} />
                  </svg>
                  {t[link.key as keyof typeof t] as string}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
