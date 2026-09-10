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
    <form action={action} className="card grid gap-4 p-5 sm:p-6">
      <label className="field-label">
        {t.yourName}
        <input name="name" className="field-input font-normal" />
      </label>
      <label className="field-label">
        {t.caption}
        <input name="caption" className="field-input font-normal" />
      </label>
      <label className="field-label">
        {t.details}
        <textarea name="details" rows={3} className="field-input font-normal" />
      </label>
      <label className="field-label">
        {t.upload}
        <input name="kind" type="hidden" value="photo" />
        <input
          name="file"
          type="file"
          accept="image/*,video/*"
          className="field-input py-2 text-sm font-normal file:mr-3 file:border-0 file:bg-fest-yellow file:px-3 file:py-1.5 file:text-sm file:font-bold file:text-fest-ink"
        />
      </label>
      <button
        disabled={pending}
        className="festival-button mt-1 min-h-12 bg-fest-ink font-bold text-fest-yellow disabled:opacity-60"
      >
        {t.send}
      </button>
      {state.message ? (
        <p
          role="status"
          className={
            state.ok
              ? "border-2 border-fest-green bg-[color-mix(in_srgb,var(--fest-green)_12%,var(--paper-white))] px-4 py-3 text-sm font-bold text-fest-green"
              : "border-2 border-fest-red bg-live-soft px-4 py-3 text-sm font-bold text-fest-red"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
