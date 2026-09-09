"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/domains/admin/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { AppRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/ui/language-toggle";

const NAV: Array<{ href: string; key: string; roles: AppRole[] }> = [
  { href: "/war-room", key: "dashboard", roles: ["super_admin", "results_operator", "results_verifier", "editor", "media_moderator", "photographer", "reporter"] },
  { href: "/war-room/results", key: "resultManagement", roles: ["super_admin", "results_operator", "results_verifier"] },
  { href: "/war-room/schedule", key: "scheduleManagement", roles: ["super_admin", "results_operator", "results_verifier"] },
  { href: "/war-room/schools", key: "schools", roles: ["super_admin", "results_operator"] },
  { href: "/war-room/programmes", key: "programmes", roles: ["super_admin", "results_operator"] },
  { href: "/war-room/stages", key: "stages", roles: ["super_admin"] },
  { href: "/war-room/live", key: "liveUpdates", roles: ["super_admin", "editor", "reporter"] },
  { href: "/war-room/media", key: "mediaModeration", roles: ["super_admin", "media_moderator", "photographer"] },
  { href: "/war-room/articles", key: "articleManagement", roles: ["super_admin", "editor"] },
  { href: "/war-room/interviews", key: "interviewManagement", roles: ["super_admin", "editor", "photographer"] },
  { href: "/war-room/users", key: "userManagement", roles: ["super_admin"] },
  { href: "/war-room/audit", key: "auditLogs", roles: ["super_admin", "results_verifier"] },
  { href: "/reporter", key: "reporter", roles: ["super_admin", "reporter"] },
];

export function WarRoomNav({
  role,
  name,
}: {
  role: AppRole;
  name: string;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const items = NAV.filter((n) => role === "super_admin" || n.roles.includes(role));

  return (
    <aside className="flex w-full flex-col border-b border-line bg-kerala-dark text-paper md:min-h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="px-4 py-4">
        <p className="text-xs uppercase tracking-widest text-gold">{t.warRoom}</p>
        <p className="font-display text-lg">{t.brandShort}</p>
        <p className="mt-2 text-xs text-paper/70">{name}</p>
        <p className="text-xs text-gold">{role}</p>
      </div>
      <nav className="flex-1 overflow-auto px-2 pb-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded px-3 py-2 text-sm",
              pathname === item.href ? "bg-paper/15 text-white" : "text-paper/80 hover:bg-paper/10",
            )}
          >
            {t[item.key as keyof typeof t] as string}
          </Link>
        ))}
      </nav>
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <LanguageToggle compact />
        <form action={logoutAction}>
          <button className="text-xs text-paper/80">{t.logout}</button>
        </form>
      </div>
    </aside>
  );
}
