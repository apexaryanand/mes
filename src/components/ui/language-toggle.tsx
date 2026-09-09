"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="inline-flex rounded border border-line bg-paper-white p-0.5 text-sm">
      <button
        type="button"
        onClick={() => setLocale("ml")}
        className={cn(
          "rounded px-2.5 py-1 min-h-9",
          locale === "ml" ? "bg-kerala text-paper-white" : "text-muted",
        )}
        aria-pressed={locale === "ml"}
      >
        {compact ? "മല" : t.malayalam}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded px-2.5 py-1 min-h-9",
          locale === "en" ? "bg-kerala text-paper-white" : "text-muted",
        )}
        aria-pressed={locale === "en"}
      >
        {compact ? "EN" : t.english}
      </button>
    </div>
  );
}
