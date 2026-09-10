"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useOptimistic,
  useTransition,
} from "react";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/types";

const COOKIE = "kalolsavam_locale";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  switching: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale = "ml",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const router = useRouter();
  const [switching, startTransition] = useTransition();
  // The server layout is the source of truth; the optimistic value only covers
  // the gap until the refreshed markup arrives, then falls back to it.
  const [locale, showLocale] = useOptimistic(initialLocale);

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
    // Most of the page is server-rendered from this cookie, so updating the
    // client dictionary alone would leave half the UI in the old language.
    startTransition(() => {
      showLocale(next);
      router.refresh();
    });
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, t: dictionaries[locale], setLocale, switching }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, switching],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
