"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { ButtonLink } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { WrFlashError } from "@/components/war-room/primitives";
import { logoutAction } from "@/domains/admin/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { AppRole } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      {
        href: "/war-room/results",
        key: "resultManagement",
        roles: ["super_admin", "war_room"],
        icon: "M9 11l3 3 8-8M4 6h16M4 12h6M4 18h10",
      },
      {
        href: "/war-room/schedule",
        key: "scheduleManagement",
        roles: ["super_admin", "war_room"],
        icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4",
      },
      {
        href: "/war-room/houses",
        key: "houses",
        roles: ["super_admin"],
        icon: "M4 20V9l8-5 8 5v11M9 20v-6h6v6",
      },
      {
        href: "/war-room/participants",
        key: "participant",
        roles: ["super_admin"],
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2",
      },
      {
        href: "/war-room/programmes",
        key: "programmes",
        roles: ["super_admin"],
        icon: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
      },
      {
        href: "/war-room/categories",
        key: "category",
        roles: ["super_admin"],
        icon: "M4 6h16M4 12h10M4 18h6",
      },
      {
        href: "/war-room/stages",
        key: "stages",
        roles: ["super_admin"],
        icon: "M3 7h18l-2 5H5zM5 12v7M19 12v7",
      },
    ],
  },
  {
    titleKey: "sectionEditorial",
    items: [
      {
        href: "/war-room/media",
        key: "mediaModeration",
        roles: ["super_admin", "war_room"],
        icon: "M4 6h16v12H4zM8 6l1.5-2h5L16 6M12 15a3 3 0 100-6 3 3 0 000 6z",
      },
      {
        href: "/war-room/articles",
        key: "articleManagement",
        roles: ["super_admin", "war_room", "media_team"],
        icon: "M4 5h16v14H4zM8 9h8M8 13h8M8 17h5",
      },
      {
        href: "/war-room/uploads",
        key: "mediaUploads",
        roles: ["super_admin", "media_team"],
        icon: "M12 16V4m0 0l-4 4m4-4l4 4M4 20h16",
      },
      {
        href: "/war-room/interviews",
        key: "interviewManagement",
        roles: ["super_admin", "media_team"],
        icon: "M4 6h16v10H4zM8 20h8M12 16v4",
      },
    ],
  },
  {
    titleKey: "sectionAdmin",
    items: [
      {
        href: "/war-room/settings",
        key: "settings",
        roles: ["super_admin"],
        icon: "M12 8v4m0 4h.01M4.93 4.93l14.14 14.14M12 3a9 9 0 109 9",
      },
      {
        href: "/war-room/users",
        key: "userManagement",
        roles: ["super_admin"],
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-2a5 5 0 015-5h4a5 5 0 015 5v2",
      },
      {
        href: "/war-room/audit",
        key: "auditLogs",
        roles: ["super_admin", "war_room"],
        icon: "M9 5h6M9 5a2 2 0 012-2h2a2 2 0 012 2M5 5h14v16H5zM9 12l2 2 4-4",
      },
    ],
  },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

function SidebarLink({
  href,
  active,
  children,
  onNavigate,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onNavigate(href);
      }}
      className={cn(
        "flex min-h-9 items-center gap-2.5 px-3 text-[13px] font-bold transition-colors",
        active
          ? "border-2 border-fest-ink bg-fest-yellow text-fest-ink shadow-[var(--shadow-hard-xs)]"
          : "border-2 border-transparent text-paper/75 hover:border-fest-ink/30 hover:bg-fest-ink-soft hover:text-paper",
      )}
    >
      {children}
    </Link>
  );
}

const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  war_room: "War Room",
  media_team: "Media Team",
};

function WrQueryError() {
  const searchParams = useSearchParams();
  return <WrFlashError message={searchParams.get("error")} />;
}

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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [navPending, startNav] = useTransition();

  function navigate(href: string) {
    if (href === pathname) return;
    setOpen(false);
    startNav(() => {
      router.push(href);
    });
  }

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
    <div className="flex h-full flex-col bg-fest-ink text-paper">
      <div className="rule-festival shrink-0" aria-hidden />

      <div className="flex items-center gap-3 px-4 py-4">
        <span className="flex h-10 w-10 shrink-0 -rotate-3 items-center justify-center border-2 border-fest-ink bg-fest-yellow font-display text-sm font-black text-fest-ink shadow-[var(--shadow-hard-xs)]">
          M
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-fest-yellow">
            {t.warRoom}
          </p>
          <p className="font-display truncate text-lg font-black leading-tight">{t.brandShort}</p>
        </div>
      </div>

      <nav
        className="wr-sidebar-scroll min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-2 pb-4"
        aria-label={t.quickNav}
      >
        {groups.map((group) => (
          <div key={group.titleKey}>
            <p className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-widest text-paper/45">
              {t[group.titleKey as keyof typeof t] as string}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/war-room"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    active={active}
                    onNavigate={navigate}
                  >
                    <span className={cn(active ? "text-fest-ink" : "text-fest-yellow/80")}>
                      <NavIcon d={item.icon} />
                    </span>
                    <span className="truncate">
                      {(t[item.key as keyof typeof t] as string) || item.key}
                    </span>
                  </SidebarLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t-4 border-fest-yellow px-3 py-3">
        <div className="mb-3 flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-fest-ink bg-fest-yellow font-display text-sm font-black text-fest-ink">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{name}</p>
            <p className="truncate text-xs text-paper/60">{ROLE_LABELS[role] ?? role}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <LanguageToggle compact />
          <form action={logoutAction}>
            <button
              type="submit"
              className="px-2 py-1.5 text-xs font-bold text-paper/70 transition-colors hover:text-fest-yellow"
            >
              {t.logout}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="war-room-console flex min-h-screen bg-paper text-ink">
      {navPending ? (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 bg-fest-yellow"
          role="progressbar"
          aria-label="Loading"
        />
      ) : null}
      <aside className="hidden w-[17.5rem] shrink-0 overflow-hidden border-r-4 border-fest-ink lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">{sidebar}</div>
      </aside>

      {/* Tablet / phone fallback */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-fest-ink/60 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[17.5rem] max-w-[88vw] border-r-4 border-fest-ink shadow-[var(--shadow-hard-lg)] transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b-4 border-fest-ink bg-paper-white px-4 lg:px-8">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center border-2 border-fest-ink bg-paper-white text-fest-ink shadow-[var(--shadow-hard-xs)] lg:hidden"
            aria-label={t.menu}
            onClick={() => setOpen(true)}
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
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-fest-red">
              {t.warRoom}
            </p>
            <h1 className="font-display truncate text-lg font-black leading-tight lg:text-xl">
              {title}
            </h1>
          </div>

          <ButtonLink href="/" variant="outline" size="sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            {t.viewSite}
          </ButtonLink>
        </header>

        <main className="min-w-0 flex-1 px-4 py-5 lg:px-8 lg:py-6">
          <div className="mx-auto grid w-full max-w-[90rem] gap-4">
            <Suspense fallback={null}>
              <WrQueryError />
            </Suspense>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
