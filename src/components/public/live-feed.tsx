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
    return <div className="card p-6 text-center text-sm text-muted sm:p-8">{t.noItems}</div>;

  return (
    <ol className="relative ml-0.5 border-l-2 border-line pl-4 sm:ml-1 sm:pl-6">
      {updates.map((u) => (
        <li key={u.id} className="relative pb-4 last:pb-0 sm:pb-6">
          <span className="absolute -left-[23px] top-1 flex h-3.5 w-3.5 items-center justify-center sm:-left-[31px] sm:h-4 sm:w-4">
            <span className="live-dot" />
          </span>
          <div className="card p-3 sm:p-4">
            <p className="flex flex-wrap items-center gap-x-1.5 text-[10px] font-semibold uppercase tracking-wide text-gold-deep sm:gap-x-2 sm:text-xs">
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
            <p className="mt-1.5 text-sm leading-relaxed sm:mt-2 sm:text-base">{u.body}</p>
            <p className="mt-1.5 text-xs text-muted sm:mt-2">
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
