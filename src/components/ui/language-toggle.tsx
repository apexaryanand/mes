"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Both labels sit in a fixed-width track so switching language never resizes
 * the header or nudges the surrounding controls.
 */
export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, switching, t } = useI18n();

  const options: Array<{ value: "ml" | "en"; label: string; full: string }> = [
    { value: "ml", label: "മല", full: t.malayalam },
    { value: "en", label: "EN", full: t.english },
  ];

  return (
    <div
      className="inline-flex shrink-0 border-2 border-fest-ink bg-paper-white p-0.5 shadow-[var(--shadow-hard-xs)]"
      role="group"
      aria-label={t.language}
    >
      {options.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLocale(opt.value)}
            className={cn(
              "inline-flex min-h-8 items-center justify-center px-2.5 text-[0.8125rem] font-black leading-none transition-colors",
              compact ? "w-9" : "min-w-[4.5rem]",
              active
                ? "bg-fest-ink text-fest-yellow"
                : "text-muted hover:bg-fest-yellow-soft hover:text-fest-ink",
              switching && "cursor-progress",
            )}
            aria-pressed={active}
            aria-busy={switching}
          >
            {compact ? opt.label : opt.full}
          </button>
        );
      })}
    </div>
  );
}
