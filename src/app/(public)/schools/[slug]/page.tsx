import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="grid gap-6">
      <p className="text-sm">
        <Link href="/schools">{t.schools}</Link>
      </p>
      <h1 className="font-display text-4xl">{tName(locale, school)}</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={t.overallRank} value={standing?.overall_rank ? `#${standing.overall_rank}` : "—"} />
        <Stat label={t.points} value={String(standing?.total_points ?? 0)} />
        <Stat label={t.aGrades} value={String(standing?.grade_a_count ?? 0)} />
        <Stat label={t.wins} value={String(standing?.wins_count ?? 0)} />
      </div>
      <ul className="grid gap-2">
        {schoolResults.map(({ block, entry }) => (
          <li key={entry.id} className="rounded border border-line bg-paper-white px-4 py-3">
            <Link href={`/events/${block.event.slug}`} className="font-medium hover:underline">
              {tName(locale, block.event.programme)}
            </Link>
            <p className="text-sm text-muted">
              {tName(locale, block.event.category)} · {entry.rank}
              {locale === "en" ? " place" : " സ്ഥാനം"} · {entry.grade} {t.grade}
              {entry.participant_name ? ` · ${entry.participant_name}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-line bg-paper-white p-4">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
