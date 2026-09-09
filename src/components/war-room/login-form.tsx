"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/domains/admin/actions";
import { useI18n } from "@/lib/i18n/provider";

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
          autoComplete="email"
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal focus:border-gold"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {t.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
      <p className="text-xs text-muted">
        Staff accounts are managed in Supabase Auth. Ask your super admin if you need access.
      </p>
    </form>
  );
}
