"use client";

import { WhatsAppShareButton } from "@/components/public/whatsapp-share";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import { absoluteUrl, liveUpdateShareMessage } from "@/lib/share";
import type { LiveUpdateView } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function LiveFeed({ updates }: { updates: LiveUpdateView[] }) {
  const { locale, t } = useI18n();

  if (!updates.length)
    return <div className="card p-8 text-center text-muted">{t.noItems}</div>;

  return (
    <ol className="relative ml-1 border-l-2 border-line pl-6">
      {updates.map((u) => (
        <li key={u.id} className="relative pb-6 last:pb-0">
          <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center">
            <span className="live-dot" />
          </span>
          <div className="card p-4">
            <p className="flex flex-wrap items-center gap-x-2 text-xs font-semibold uppercase tracking-wide text-gold-deep">
              {formatDateTime(u.created_at, locale)}
              {u.stage ? (
                <>
                  <span className="text-line" aria-hidden>
                    &bull;
                  </span>
                  <span className="text-kerala-dark">{tName(locale, u.stage)}</span>
                </>
              ) : null}
            </p>
            <p className="mt-2 leading-relaxed">{u.body}</p>
            <p className="mt-2 text-xs text-muted">
              {t.reporter}: {u.reporter_name}
            </p>
            <div className="mt-3">
              <WhatsAppShareButton
                compact
                text={liveUpdateShareMessage({
                  locale,
                  body: u.body,
                  stage: u.stage ? tName(locale, u.stage) : undefined,
                  pageUrl: absoluteUrl("/live"),
                })}
              />
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
