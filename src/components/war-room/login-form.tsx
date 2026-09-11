"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/domains/admin/actions";
import { AdminField, adminInput } from "@/components/admin/admin-field";
import { adminCopy } from "@/lib/admin/copy";
import { safeNextPath } from "@/lib/safe-redirect";

export function LoginForm() {
  const params = useSearchParams();
  const [state, action, pending] = useActionState(loginAction, { error: "" });

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={safeNextPath(params.get("next"))} />
      <AdminField label={adminCopy.email}>
        <input name="email" type="email" required autoComplete="email" className={adminInput} />
      </AdminField>
      <AdminField label={adminCopy.password}>
        <input name="password" type="password" required autoComplete="current-password" className={adminInput} />
      </AdminField>
      <button
        type="submit"
        disabled={pending}
        className="mt-1 min-h-11 rounded-md bg-zinc-900 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? adminCopy.working : adminCopy.login}
      </button>
      {state?.error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {state.error}
        </p>
      ) : null}
      <p className="text-xs text-zinc-500">{adminCopy.warRoomLoginHelp}</p>
    </form>
  );
}
