"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="inline-flex rounded-full border border-line bg-paper-white p-0.5 text-sm font-semibold">
      <button
        type="button"
        onClick={() => setLocale("ml")}
        className={cn(
          "min-h-9 rounded-full px-3 py-1 transition-colors",
          locale === "ml" ? "bg-kerala-dark text-white shadow-sm" : "text-muted hover:text-ink",
        )}
        aria-pressed={locale === "ml"}
      >
        {compact ? "മല" : t.malayalam}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "min-h-9 rounded-full px-3 py-1 transition-colors",
          locale === "en" ? "bg-kerala-dark text-white shadow-sm" : "text-muted hover:text-ink",
        )}
        aria-pressed={locale === "en"}
      >
        {compact ? "EN" : t.english}
      </button>
    </div>
  );
}
