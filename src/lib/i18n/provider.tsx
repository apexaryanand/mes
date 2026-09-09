"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

const COOKIE = "kalolsavam_locale";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readCookie(): Locale {
  if (typeof document === "undefined") return "ml";
  const match = document.cookie.match(/(?:^|; )kalolsavam_locale=(ml|en)/);
  return match?.[1] === "en" ? "en" : "ml";
}

export function I18nProvider({
  children,
  initialLocale = "ml",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document === "undefined") return initialLocale;
    return readCookie();
  });

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, t: dictionaries[locale], setLocale }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
