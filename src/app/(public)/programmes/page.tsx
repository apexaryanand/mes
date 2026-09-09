import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getProgrammes, getScheduledEvents } from "@/lib/data/queries";

export default async function ProgrammesPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [programmes, events] = await Promise.all([getProgrammes(), getScheduledEvents()]);

  return (
    <div className="grid gap-8">
      <PageHeader eyebrow={t.all} title={t.programmes} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {programmes.map((p) => {
          const related = events.filter((e) => e.programme_id === p.id);
          return (
            <Link
              key={p.id}
              href={`/programmes/${p.slug}`}
              className="card card-hover flex items-center justify-between gap-3 p-5"
            >
              <div className="min-w-0">
                <p className="font-display truncate text-xl font-bold">{tName(locale, p)}</p>
                <p className="text-sm text-muted">
                  {related.length} {t.category.toLowerCase()}
                </p>
              </div>
              <span className="text-gold-deep" aria-hidden>
                &rarr;
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
