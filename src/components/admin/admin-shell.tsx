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
        "group flex min-h-10 items-center justify-between border-l-2 px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-fest-red bg-fest-yellow text-fest-ink shadow-[3px_3px_0_var(--fest-ink)]"
          : "border-transparent text-zinc-600 hover:border-fest-red hover:bg-white hover:text-fest-ink",
      )}
    >
      <span>{label}</span>
      {active ? <span aria-hidden="true" className="text-xs">●</span> : null}
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
    <div className="flex h-full flex-col border-r-2 border-fest-ink bg-paper">
      <div className="border-b-2 border-fest-ink bg-fest-ink px-5 py-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-fest-yellow">{adminCopy.warRoom}</p>
        <p className="mt-1 font-display text-2xl font-bold tracking-tight">MESTA OPS</p>
        <p className="mt-2 text-xs text-white/70">Control centre for the festival</p>
      </div>
      <div className="border-b border-line px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Workspace</p>
        <p className="mt-1 text-xs font-semibold text-fest-ink">{ROLE_LABELS[role]}</p>
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
      <div className="border-t-2 border-fest-ink bg-paper-white p-4">
        <p className="truncate text-sm font-bold text-fest-ink">{name}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link href="/" className="text-xs font-bold text-muted underline-offset-2 hover:text-fest-red hover:underline">
            {adminCopy.viewPublicSite}
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-xs font-bold text-muted underline-offset-2 hover:text-fest-red hover:underline">
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
          <header className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b-2 border-fest-ink bg-paper-white px-4 lg:px-8">
            <button
              type="button"
              className="inline-flex min-h-10 items-center border-2 border-fest-ink bg-fest-yellow px-3 text-xs font-bold uppercase tracking-wide text-fest-ink shadow-[2px_2px_0_var(--fest-ink)] lg:hidden"
              onClick={() => setOpen(true)}
              aria-label={adminCopy.menu}
            >
              Menu
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-muted">MESTA / WAR ROOM</p>
              <h2 className="truncate text-base font-bold text-fest-ink">{active?.label ?? adminCopy.warRoom}</h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-2 border border-line bg-kerala-soft px-3 py-2 text-xs font-bold text-kerala-dark">
                <span className="h-2 w-2 rounded-full bg-fest-green" aria-hidden="true" /> System ready
              </span>
              <Link href="/" className="border-2 border-fest-ink px-3 py-2 text-xs font-bold text-fest-ink hover:bg-fest-yellow">
                Public site
              </Link>
            </div>
          </header>
          <main id="main-content" className="flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-[1400px] gap-5">
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
