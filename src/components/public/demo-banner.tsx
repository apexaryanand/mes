"use client";

import { useI18n } from "@/lib/i18n/provider";
import { isSupabaseConfigured } from "@/lib/utils";

export function DemoBanner() {
  const { t } = useI18n();
  if (isSupabaseConfigured()) return null;
  return (
    <div className="bg-gold/30 px-4 py-2 text-center text-xs text-ink">
      {t.demoBanner}
    </div>
  );
}
