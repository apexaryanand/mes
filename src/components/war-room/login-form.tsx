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
      <label className="field-label">
        {t.email}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="field-input font-normal"
        />
      </label>
      <label className="field-label">
        {t.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field-input font-normal"
        />
      </label>
      <button
        disabled={pending}
        className="festival-button mt-1 min-h-12 bg-fest-yellow font-bold text-fest-ink disabled:opacity-60"
      >
        {t.login}
      </button>
      {state?.error ? (
        <p
          role="alert"
          className="border-2 border-fest-red bg-live-soft px-4 py-3 text-sm font-bold text-fest-red"
        >
          {state.error}
        </p>
      ) : null}
      <p className="text-xs text-muted">
        Staff accounts are managed in Supabase Auth. Ask your super admin if you need access.
      </p>
    </form>
  );
}
