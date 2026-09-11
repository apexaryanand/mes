"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { AdminFlash } from "@/components/admin/admin-flash";
import { adminCopy } from "@/lib/admin/copy";
import { adminNavActive, filterAdminNav } from "@/lib/admin/navigation";
import { logoutAction } from "@/domains/admin/actions";
import type { AppRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  war_room: "War Room",
  media_team: "Media Team",
};

function AdminQueryFlash() {
  const searchParams = useSearchParams();
  return <AdminFlash message={searchParams.get("error")} />;
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
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
        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
      )}
    >
      {label}
    </Link>
  );
}

export function AdminShell({
  role,
  name,
  children,
}: {
  role: AppRole;
  name: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [navPending, startNav] = useTransition();
  const nav = filterAdminNav(role);
  const active = nav.find((item) => adminNavActive(pathname, item.href));

  function navigate(href: string) {
    if (href === pathname) return;
    setOpen(false);
    startNav(() => router.push(href));
  }

  const sidebar = (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{adminCopy.warRoom}</p>
        <p className="text-lg font-semibold text-zinc-900">MESTA Ops</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label={adminCopy.quickNav}>
        {nav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={adminNavActive(pathname, item.href)}
            onNavigate={navigate}
          />
        ))}
      </nav>
      <div className="border-t border-zinc-200 p-4">
        <p className="truncate text-sm font-medium text-zinc-900">{name}</p>
        <p className="truncate text-xs text-zinc-500">{ROLE_LABELS[role]}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
            {adminCopy.viewPublicSite}
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
              {adminCopy.logout}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {navPending ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-zinc-900" role="progressbar" aria-label="Loading" />
      ) : null}
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 lg:block">{sidebar}</aside>
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-zinc-50 shadow-xl">{sidebar}</div>
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-2 py-1 text-sm lg:hidden"
              onClick={() => setOpen(true)}
              aria-label={adminCopy.menu}
            >
              Menu
            </button>
            <h2 className="truncate text-sm font-semibold text-zinc-900">{active?.label ?? adminCopy.warRoom}</h2>
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-6xl gap-4">
              <Suspense fallback={null}>
                <AdminQueryFlash />
              </Suspense>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
