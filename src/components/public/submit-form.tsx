"use client";

import { useActionState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { submitPublicMedia } from "@/domains/media/actions";

export function SubmitForm() {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(submitPublicMedia, {
    ok: false,
    message: "",
  });

  return (
    <form action={action} className="grid gap-4 rounded border border-line bg-paper-white p-4">
      <label className="grid gap-1 text-sm">
        {t.yourName}
        <input name="name" className="min-h-11 rounded border border-line px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        {t.caption}
        <input name="caption" className="min-h-11 rounded border border-line px-3" />
      </label>
      <label className="grid gap-1 text-sm">
        {t.details}
        <textarea name="details" rows={3} className="rounded border border-line px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        {t.upload}
        <input name="kind" type="hidden" value="photo" />
        <input
          name="file"
          type="file"
          accept="image/*,video/*"
          className="min-h-11"
        />
      </label>
      <button
        disabled={pending}
        className="min-h-12 rounded bg-kerala text-paper-white disabled:opacity-60"
      >
        {t.send}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-kerala-dark" : "text-live"}>{state.message}</p>
      ) : null}
    </form>
  );
}
