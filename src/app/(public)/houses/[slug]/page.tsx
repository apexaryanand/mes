import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateActions } from "@/components/public/certificate-actions";
import { HouseBadge, houseColorHex } from "@/components/public/house-badge";
import { isCertificateEligible } from "@/lib/certificates";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";
import { Medal } from "@/components/ui/medal";
import { StatCard } from "@/components/ui/stat-card";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouseBySlug, getPublishedResults, getStandings } from "@/lib/data/queries";

export default async function HousePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const house = await getHouseBySlug(slug);
  if (!house) notFound();

  const hex = houseColorHex(house.color);
  const [standings, results] = await Promise.all([getStandings(), getPublishedResults()]);
  const standing = standings.find((s) => s.house_id === house.id);
  const houseResults = results.flatMap((block) =>
    block.entries
      .filter((e) => e.house_id === house.id)
      .map((e) => ({ block, entry: e })),
  );

  return (
    <div className="grid gap-5 sm:gap-8">
      <Breadcrumb parentHref="/houses" parentLabel={t.houses} current={tName(locale, house)} />

      <header
        className="card flex flex-wrap items-center gap-4 p-5"
        style={{ borderLeftWidth: 6, borderLeftColor: hex }}
      >
        <span
          className="font-display flex h-16 w-16 shrink-0 items-center justify-center border-2 border-fest-ink text-2xl font-black text-white shadow-[var(--shadow-hard-xs)]"
          style={{ backgroundColor: hex }}
        >
          {house.short_name?.charAt(0) ?? house.name_en.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <HouseBadge house={house} className="mb-2" />
          <h1 className="font-display text-display-md font-black">{tName(locale, house)}</h1>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label={t.overallRank}
          value={standing?.overall_rank ? `#${standing.overall_rank}` : "—"}
          accent="gold"
        />
        <StatCard label={t.points} value={standing?.total_points ?? 0} accent="green" />
        <StatCard label={t.aGrades} value={standing?.grade_a_count ?? 0} accent="indigo" />
        <StatCard label={t.wins} value={standing?.wins_count ?? 0} accent="red" />
      </div>

      {houseResults.length ? (
        <ul className="grid gap-3">
          {houseResults.map(({ block, entry }) => (
            <li
              key={entry.id}
              className="card flex flex-wrap items-center gap-3 p-4"
              style={{ borderLeftWidth: 6, borderLeftColor: hex }}
            >
              <Medal rank={entry.rank} className="h-10 w-10 text-sm" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/events/${block.event.slug}`}
                  className="font-display line-clamp-2 font-black underline-offset-2 hover:underline"
                >
                  {tName(locale, block.event.programme)}
                </Link>
                <p className="text-sm text-muted">
                  {entry.participant_name ?? "—"}
                  {" · "}
                  {tName(locale, block.event.category)}
                  {entry.grade ? ` · ${entry.grade}` : ""}
                </p>
              </div>
              <span className="tabular text-sm font-black" style={{ color: hex }}>
                {entry.points} {t.points}
              </span>
              {isCertificateEligible(entry.rank) ? (
                <CertificateActions
                  entry={entry}
                  event={block.event}
                  programmeName={tName(locale, block.event.programme)}
                  categoryName={tName(locale, block.event.category)}
                  compact
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon="results"
          title={t.noResults}
          description={t.heroTagline}
          actionHref="/results"
          actionLabel={t.exploreResults}
        />
      )}
    </div>
  );
}
