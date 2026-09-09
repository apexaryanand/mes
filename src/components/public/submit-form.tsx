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
    <form action={action} className="card grid gap-4 p-6">
      <label className="grid gap-1.5 text-sm font-medium">
        {t.yourName}
        <input
          name="name"
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal focus:border-gold"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {t.caption}
        <input
          name="caption"
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 font-normal focus:border-gold"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {t.details}
        <textarea
          name="details"
          rows={3}
          className="rounded-xl border border-line bg-paper-white px-3 py-2 font-normal focus:border-gold"
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        {t.upload}
        <input name="kind" type="hidden" value="photo" />
        <input
          name="file"
          type="file"
          accept="image/*,video/*"
          className="min-h-11 rounded-xl border border-line bg-paper-white px-3 py-2 text-sm font-normal file:mr-3 file:rounded-full file:border-0 file:bg-kerala-soft file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-kerala-dark"
        />
      </label>
      <button
        disabled={pending}
        className="min-h-12 rounded-full bg-kerala-dark font-semibold text-white shadow-[var(--shadow-md)] transition-all hover:bg-kerala-deep disabled:opacity-60"
      >
        {t.send}
      </button>
      {state.message ? (
        <p
          className={
            state.ok
              ? "rounded-xl bg-kerala-soft px-4 py-3 text-sm font-medium text-kerala-dark"
              : "rounded-xl bg-live-soft px-4 py-3 text-sm font-medium text-live"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
