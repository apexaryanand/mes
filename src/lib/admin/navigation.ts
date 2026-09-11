import type { AppRole } from "@/lib/types";

export type AdminNavItem = {
  href: string;
  label: string;
  roles: AppRole[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/war-room", label: "Operations", roles: ["super_admin", "war_room", "media_team"] },
  { href: "/war-room/results", label: "Results", roles: ["super_admin", "war_room"] },
  { href: "/war-room/schedule", label: "Schedule", roles: ["super_admin", "war_room"] },
  { href: "/war-room/catalog", label: "Catalog", roles: ["super_admin"] },
  { href: "/war-room/content", label: "Content", roles: ["super_admin", "war_room", "media_team"] },
  { href: "/war-room/system", label: "System", roles: ["super_admin", "war_room"] },
];

export function filterAdminNav(role: AppRole): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => role === "super_admin" || item.roles.includes(role));
}

export function adminNavActive(pathname: string, href: string) {
  if (href === "/war-room") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
