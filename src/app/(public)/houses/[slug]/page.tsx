import Link from "next/link";
import { notFound } from "next/navigation";
import { HouseBadge, houseColorHex } from "@/components/public/house-badge";
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
      <nav className="flex items-center gap-1.5 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/houses" className="hover:text-kerala-dark">
          {t.houses}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{tName(locale, house)}</span>
      </nav>

      <header
        className="card flex flex-wrap items-center gap-4 p-5"
        style={{ borderLeftWidth: 6, borderLeftColor: hex }}
      >
        <span
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-black text-white"
          style={{ backgroundColor: hex }}
        >
          {house.short_name?.charAt(0) ?? house.name_en.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <HouseBadge house={house} className="mb-2" />
          <h1 className="font-display text-display-md font-bold">{tName(locale, house)}</h1>
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
        <ul className="card divide-y divide-line overflow-hidden">
          {houseResults.map(({ block, entry }) => (
            <li key={entry.id}>
              <Link
                href={`/events/${block.event.slug}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-paper"
              >
                <Medal rank={entry.rank} className="h-9 w-9 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{tName(locale, block.event.programme)}</p>
                  <p className="text-sm text-muted">
                    {tName(locale, block.event.category)}
                    {entry.grade ? ` · ${entry.grade} ${t.grade}` : ""}
                    {entry.participant_name ? ` · ${entry.participant_name}` : ""}
                  </p>
                </div>
                <span className="tabular text-sm font-semibold" style={{ color: hex }}>
                  {entry.points} {t.points}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-10 text-center">
          <p className="font-display text-lg font-bold">{t.noResults}</p>
          <p className="mt-2 text-sm text-muted">{t.heroTagline}</p>
          <Link
            href="/results"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-kerala-dark px-5 text-sm font-semibold text-white"
          >
            {t.exploreResults}
          </Link>
        </div>
      )}
    </div>
  );
}
