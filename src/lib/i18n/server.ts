import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies();
  return jar.get("kalolsavam_locale")?.value === "en" ? "en" : "ml";
}

export async function getRequestDictionary() {
  const locale = await getRequestLocale();
  return { locale, t: getDictionary(locale) };
}
