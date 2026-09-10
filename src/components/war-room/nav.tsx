"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/domains/admin/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { AppRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/ui/language-toggle";

type NavItem = { href: string; key: string; roles: AppRole[]; icon: string };
type NavGroup = { titleKey: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    titleKey: "sectionOverview",
    items: [
      {
        href: "/war-room",
        key: "dashboard",
        roles: ["super_admin", "war_room", "media_team"],
        icon: "M4 13h6V4H4zM14 20h6V4h-6zM4 20h6v-4H4z",
      },
    ],
  },
  {
    titleKey: "sectionResults",
    items: [
      { href: "/war-room/results", key: "resultManagement", roles: ["super_admin", "war_room"], icon: "M9 11l3 3 8-8M4 6h16M4 12h6M4 18h10" },
      { href: "/war-room/schedule", key: "scheduleManagement", roles: ["super_admin", "war_room"], icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" },
      { href: "/war-room/houses", key: "houses", roles: ["super_admin"], icon: "M4 20V9l8-5 8 5v11M9 20v-6h6v6" },
      { href: "/war-room/participants", key: "participant", roles: ["super_admin"], icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" },
      { href: "/war-room/programmes", key: "programmes", roles: ["super_admin"], icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" },
      { href: "/war-room/categories", key: "category", roles: ["super_admin"], icon: "M4 6h16M4 12h10M4 18h6" },
      { href: "/war-room/stages", key: "stages", roles: ["super_admin"], icon: "M3 7h18l-2 5H5zM5 12v7M19 12v7" },
    ],
  },
  {
    titleKey: "sectionEditorial",
    items: [
      { href: "/war-room/media", key: "mediaModeration", roles: ["super_admin", "war_room"], icon: "M4 6h16v12H4zM8 6l1.5-2h5L16 6M12 15a3 3 0 100-6 3 3 0 000 6z" },
      { href: "/war-room/articles", key: "articleManagement", roles: ["super_admin", "war_room", "media_team"], icon: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5" },
      { href: "/war-room/uploads", key: "mediaUploads", roles: ["super_admin", "media_team"], icon: "M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" },
      { href: "/war-room/interviews", key: "interviewManagement", roles: ["super_admin", "media_team"], icon: "M4 6h16v10H4zM8 20h8M12 16v4" },
    ],
  },
  {
    titleKey: "sectionAdmin",
    items: [
      { href: "/war-room/settings", key: "settings", roles: ["super_admin"], icon: "M12 8v4m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 109 9" },
      { href: "/war-room/users", key: "userManagement", roles: ["super_admin"], icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a5 5 0 015-5h4a5 5 0 015 5v2" },
      { href: "/war-room/audit", key: "auditLogs", roles: ["super_admin", "war_room"], icon: "M9 5h6M9 5a2 2 0 012-2h2a2 2 0 012 2M5 5h14v16H5zM9 12l2 2 4-4" },
    ],
  },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  war_room: "War Room",
  media_team: "Media Team",
};

export function WarRoomShell({
  role,
  name,
  children,
}: {
  role: AppRole;
  name: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((n) => role === "super_admin" || n.roles.includes(role)),
  })).filter((g) => g.items.length);

  const activeItem = GROUPS.flatMap((g) => g.items).find((n) =>
    n.href === "/war-room" ? pathname === n.href : pathname.startsWith(n.href),
  );
  const title = activeItem
    ? (t[activeItem.key as keyof typeof t] as string) || activeItem.key
    : t.warRoom;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 py-4 sm:gap-3 sm:px-5 sm:py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 font-display text-sm font-black text-white sm:h-10 sm:w-10">
          M
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold-light">
            {t.warRoom}
          </p>
          <p className="font-display truncate text-lg font-bold text-white">
            {t.brandShort}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.titleKey}>
            <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {t[group.titleKey as keyof typeof t] as string}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/war-room"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/15 text-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className={cn(active ? "text-gold-light" : "text-white/60")}>
                      <NavIcon d={item.icon} />
                    </span>
                    {(t[item.key as keyof typeof t] as string) || item.key}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-deep font-semibold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{name}</p>
            <p className="truncate text-xs text-gold-light">{ROLE_LABELS[role] ?? role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <LanguageToggle compact />
          <form action={logoutAction}>
            <button className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white">
              {t.logout}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f1f0ec] text-ink">
      <aside className="hidden w-64 shrink-0 bg-kerala-deep md:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      <div className={cn("fixed inset-0 z-50 md:hidden", open ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn("absolute inset-0 bg-black/50 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-72 max-w-[82vw] bg-kerala-deep shadow-[var(--shadow-lg)] transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-white/90 px-3 py-2 backdrop-blur sm:gap-3 sm:px-4 sm:py-3 md:px-6">
          <button
            type="button"
            className="flex min-h-9 min-w-9 items-center justify-center rounded-xl border border-line text-kerala-dark md:hidden"
            aria-label={t.menu}
            onClick={() => setOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <h1 className="font-display flex-1 truncate text-base font-bold sm:text-xl">{title}</h1>
          <Link
            href="/"
            aria-label={t.viewSite}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-kerala-dark sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            <span className="hidden sm:inline">{t.viewSite}</span>
            <span className="sm:hidden" aria-hidden>↗</span>
          </Link>
        </header>

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
