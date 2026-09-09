"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/domains/admin/actions";
import { useI18n } from "@/lib/i18n/provider";
import { demoUsers } from "@/lib/data/demo";
import { isSupabaseConfigured } from "@/lib/utils";

export function LoginForm() {
  const { t } = useI18n();
  const params = useSearchParams();
  const [state, action, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={params.get("next") ?? "/war-room"} />
      <label className="grid gap-1.5 text-sm font-medium">
        {t.email}
        <input
          name="email"
          type="email"
          required
          defaultValue={isSupabaseConfigured() ? "" : "admin@kalolsavam.local"}
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal focus:border-gold"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {t.password}
        <input
          name="password"
          type="password"
          required
          defaultValue={isSupabaseConfigured() ? "" : "demo-admin"}
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal focus:border-gold"
        />
      </label>
      <button
        disabled={pending}
        className="min-h-12 rounded-full bg-kerala-dark font-semibold text-white shadow-[var(--shadow-md)] transition-all hover:bg-kerala-deep disabled:opacity-60"
      >
        {t.login}
      </button>
      {state?.error ? (
        <p className="rounded-xl bg-live-soft px-4 py-3 text-sm font-medium text-live">
          {state.error}
        </p>
      ) : null}
      {!isSupabaseConfigured() ? (
        <div className="mt-2 rounded-xl border border-line bg-paper/60 p-4 text-xs text-muted">
          <p className="font-semibold text-ink">Demo accounts</p>
          <ul className="mt-1.5 grid gap-1">
            {demoUsers.map((u) => (
              <li key={u.email} className="flex items-center justify-between gap-2">
                <span className="tabular">
                  {u.email} / {u.password}
                </span>
                <span className="chip py-0.5 text-[10px]">{u.role}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
