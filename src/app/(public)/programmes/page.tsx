import Link from "next/link";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getProgrammes, getScheduledEvents } from "@/lib/data/queries";

export default async function ProgrammesPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [programmes, events] = await Promise.all([getProgrammes(), getScheduledEvents()]);

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.programmes}</h1>
      {programmes.map((p) => {
        const related = events.filter((e) => e.programme_id === p.id);
        return (
          <Link
            key={p.id}
            href={`/programmes/${p.slug}`}
            className="rounded border border-line bg-paper-white p-4"
          >
            <p className="font-display text-xl">{tName(locale, p)}</p>
            <p className="text-sm text-muted">
              {related.length} {t.category.toLowerCase()}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
