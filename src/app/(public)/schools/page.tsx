import Link from "next/link";
import { LeadingSchools } from "@/components/public/leading-schools";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSchools, getStandings } from "@/lib/data/queries";

export default async function SchoolsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [schools, standings] = await Promise.all([getSchools(), getStandings()]);

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow={t.points} title={t.schools} />
      <section>
        <SectionHeader eyebrow={t.overallRank} title={t.leadingSchools} />
        <LeadingSchools standings={standings} />
      </section>
      <section>
        <SectionHeader eyebrow={t.all} title={t.schools} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((s) => (
            <li key={s.id}>
              <Link
                href={`/schools/${s.slug}`}
                className="card card-hover flex items-center gap-3 p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-kerala-soft font-display font-bold text-kerala-dark">
                  {tName(locale, s).charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{tName(locale, s)}</span>
                  <span className="block text-xs text-muted">{s.code}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
