import Link from "next/link";
import { notFound } from "next/navigation";
import { Medal } from "@/components/ui/medal";
import { StatCard } from "@/components/ui/stat-card";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPublishedResults, getSchoolBySlug, getStandings } from "@/lib/data/queries";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const [standings, results] = await Promise.all([getStandings(), getPublishedResults()]);
  const standing = standings.find((s) => s.school_id === school.id);
  const schoolResults = results.flatMap((block) =>
    block.entries
      .filter((e) => e.school_id === school.id)
      .map((e) => ({ block, entry: e })),
  );

  return (
    <div className="grid gap-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/schools" className="hover:text-kerala-dark">
          {t.schools}
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-ink">{tName(locale, school)}</span>
      </nav>

      <header className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-kerala-soft font-display text-2xl font-black text-kerala-dark">
          {tName(locale, school).charAt(0)}
        </span>
        <div className="min-w-0">
          <h1 className="font-display text-display-md font-bold">{tName(locale, school)}</h1>
          <p className="text-sm text-muted">{school.code}</p>
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

      {schoolResults.length ? (
        <ul className="card divide-y divide-line overflow-hidden">
          {schoolResults.map(({ block, entry }) => (
            <li key={entry.id}>
              <Link
                href={`/events/${block.event.slug}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-kerala-soft/50"
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
                <span className="tabular text-sm font-semibold text-kerala-dark">
                  {entry.points} {t.points}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="card p-10 text-center text-muted">{t.noResults}</div>
      )}
    </div>
  );
}
