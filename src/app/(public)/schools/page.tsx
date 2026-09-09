import Link from "next/link";
import { LeadingSchools } from "@/components/public/leading-schools";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSchools, getStandings } from "@/lib/data/queries";

export default async function SchoolsPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [schools, standings] = await Promise.all([getSchools(), getStandings()]);

  return (
    <div className="grid gap-8">
      <h1 className="font-display text-3xl">{t.schools}</h1>
      <LeadingSchools standings={standings} />
      <ul className="grid gap-2 sm:grid-cols-2">
        {schools.map((s) => (
          <li key={s.id}>
            <Link href={`/schools/${s.slug}`} className="block rounded border border-line bg-paper-white px-4 py-3">
              <p className="font-medium">{tName(locale, s)}</p>
              <p className="text-xs text-muted">{s.code}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
