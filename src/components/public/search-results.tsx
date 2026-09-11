"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EmptyState } from "@/components/ui/empty-state";
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
      <form className="surface-glass sticky top-[var(--stack-top)] z-20 -mx-3 border-y-2 border-fest-ink px-3 py-2 sm:-mx-4 sm:px-4 sm:py-3 md:mx-0 md:border-x-2">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-fest-ink"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            name="q"
            defaultValue={query}
            autoFocus
            placeholder={t.searchPlaceholder}
            className="field-input min-h-12 pl-11 pr-4 text-base"
          />
        </div>
      </form>
      {!query ? null : grouped.length === 0 ? (
        <EmptyState icon="search" title={t.noItems} description={t.emptyHint} />
      ) : (
        <ul className="grid gap-3">
          {grouped.map((hit) => (
            <li key={`${hit.type}-${hit.id}`}>
              <Link href={hit.href} className="card card-hover flex items-start gap-3 p-4">
                <span className="chip shrink-0 py-1 text-[11px]">
                  {t.searchTypes[hit.type]}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">
                    {locale === "ml" ? hit.title_ml : hit.title_en}
                  </span>
                  {hit.subtitle_en ? (
                    <span className="block text-sm text-muted">
                      {locale === "ml" ? hit.subtitle_ml : hit.subtitle_en}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
