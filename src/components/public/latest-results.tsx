"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { tName } from "@/lib/i18n/dictionaries";
import type { PublishedResultView } from "@/lib/types";
import { formatClock } from "@/lib/utils";

export function LatestResults({ results }: { results: PublishedResultView[] }) {
  const { locale, t } = useI18n();

  if (!results.length) return <p className="text-muted">{t.noResults}</p>;

  return (
    <div className="overflow-x-auto rounded border border-line bg-paper-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line bg-kerala-soft text-kerala-dark">
          <tr>
            <th className="px-3 py-2 font-semibold">{t.programme}</th>
            <th className="px-3 py-2 font-semibold">{t.category}</th>
            <th className="px-3 py-2 font-semibold">{t.rank}</th>
            <th className="px-3 py-2 font-semibold">{t.participant}</th>
            <th className="px-3 py-2 font-semibold">{t.school}</th>
            <th className="px-3 py-2 font-semibold">{t.marks}</th>
            <th className="px-3 py-2 font-semibold">{t.grade}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((block) => {
            const first = block.entries[0];
            if (!first) return null;
            return (
              <tr key={block.result_set.id} className="border-b border-line/70">
                <td className="px-3 py-2">
                  <Link href={`/events/${block.event.slug}`} className="font-medium hover:underline">
                    {tName(locale, block.event.programme)}
                  </Link>
                  <p className="text-xs text-muted">
                    {block.result_set.published_at
                      ? formatClock(block.result_set.published_at)
                      : null}
                  </p>
                </td>
                <td className="px-3 py-2">{tName(locale, block.event.category)}</td>
                <td className="px-3 py-2 tabular">{first.rank}</td>
                <td className="px-3 py-2">{first.participant_name}</td>
                <td className="px-3 py-2">
                  <Link href={`/schools/${first.school.slug}`} className="hover:underline">
                    {tName(locale, first.school)}
                  </Link>
                </td>
                <td className="px-3 py-2 tabular">{first.marks}</td>
                <td className="px-3 py-2 font-semibold">{first.grade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
