"use client";

import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { LiveUpdateView } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function LiveFeed({ updates }: { updates: LiveUpdateView[] }) {
  const { locale, t } = useI18n();

  if (!updates.length) return <p className="text-muted">{t.noItems}</p>;

  return (
    <ol className="grid gap-3">
      {updates.map((u) => (
        <li key={u.id} className="rounded border border-line bg-paper-white p-4">
          <p className="text-xs text-muted">
            {formatDateTime(u.created_at, locale)}
            {u.stage ? ` — ${tName(locale, u.stage)}` : ""}
          </p>
          <p className="mt-2 leading-relaxed">{u.body}</p>
          <p className="mt-2 text-xs text-muted">
            {t.reporter}: {u.reporter_name}
          </p>
        </li>
      ))}
    </ol>
  );
}
