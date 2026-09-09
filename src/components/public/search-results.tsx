"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useI18n } from "@/lib/i18n/provider";
import type { SearchHit } from "@/lib/types";

export function SearchResults({
  query,
  hits,
}: {
  query: string;
  hits: SearchHit[];
}) {
  const { locale, t } = useI18n();
  const grouped = useMemo(() => hits, [hits]);

  return (
    <div className="grid gap-4">
      <form className="sticky top-16 z-10 bg-paper py-2">
        <input
          name="q"
          defaultValue={query}
          placeholder={t.searchPlaceholder}
          className="min-h-12 w-full rounded border border-line bg-paper-white px-4 text-base"
        />
      </form>
      {!query ? null : grouped.length === 0 ? (
        <p className="text-muted">{t.noItems}</p>
      ) : (
        <ul className="grid gap-2">
          {grouped.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <Link href={hit.href} className="block rounded border border-line bg-paper-white p-4">
                <p className="text-xs uppercase tracking-wide text-gold-deep">
                  {t.searchTypes[hit.type]}
                </p>
                <p className="font-medium">
                  {locale === "ml" ? hit.title_ml : hit.title_en}
                </p>
                {hit.subtitle_en ? (
                  <p className="text-sm text-muted">
                    {locale === "ml" ? hit.subtitle_ml : hit.subtitle_en}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
