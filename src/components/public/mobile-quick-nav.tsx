"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/live", key: "liveUpdates", icon: "M12 2v6m0 8v6M2 12h6m8 0h6" },
  { href: "/results", key: "results", icon: "M3 5h18M3 10h18M3 15h12" },
  { href: "/stages", key: "stages", icon: "M3 7h18l-2 5H5zM5 12v7M19 12v7" },
  { href: "/schedule", key: "schedule", icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" },
] as const;

export function MobileQuickNav() {
  const { t } = useI18n();
  const pathname = usePathname();

  return (
    <nav
      className="surface-glass sticky top-[68px] z-20 -mx-4 border-b border-line px-2 py-2 md:hidden"
      aria-label={t.quickNav}
    >
      <ul className="flex gap-1 overflow-x-auto">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className={cn(
                  "flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-bold uppercase tracking-wide transition-colors",
                  active
                    ? "bg-kerala-dark text-white shadow-sm"
                    : "text-muted hover:bg-kerala-soft hover:text-kerala-dark",
                )}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={link.icon} />
                </svg>
                {t[link.key as keyof typeof t] as string}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
