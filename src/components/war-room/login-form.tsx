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
    <form action={action} className="grid gap-3">
      <input type="hidden" name="next" value={params.get("next") ?? "/war-room"} />
      <label className="grid gap-1 text-sm">
        {t.email}
        <input
          name="email"
          type="email"
          required
          defaultValue={isSupabaseConfigured() ? "" : "admin@kalolsavam.local"}
          className="min-h-11 rounded border border-line px-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        {t.password}
        <input
          name="password"
          type="password"
          required
          defaultValue={isSupabaseConfigured() ? "" : "demo-admin"}
          className="min-h-11 rounded border border-line px-3"
        />
      </label>
      <button disabled={pending} className="min-h-12 rounded bg-kerala text-paper-white">
        {t.login}
      </button>
      {state?.error ? <p className="text-sm text-live">{state.error}</p> : null}
      {!isSupabaseConfigured() ? (
        <div className="mt-4 text-xs text-muted">
          <p className="font-semibold text-ink">Demo accounts</p>
          <ul className="mt-1 grid gap-0.5">
            {demoUsers.map((u) => (
              <li key={u.email}>
                {u.email} / {u.password} ({u.role})
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
