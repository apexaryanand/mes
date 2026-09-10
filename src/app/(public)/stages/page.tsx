import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStages } from "@/lib/data/queries";

export default async function StagesPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [stages, events] = await Promise.all([getStages(), getScheduledEvents()]);

  return (
    <div className="grid gap-5 sm:gap-8">
      <PageHeader eyebrow={t.schedule} title={t.stages} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((s) => {
          const live = events.filter((e) => e.stage_id === s.id && e.status === "live");
          return (
            <Link
              key={s.id}
              href={`/stages/${s.slug}`}
              className="card card-hover flex flex-col p-5"
            >
              <p className="font-display lines-2 line-clamp-2 text-xl font-black">
                {tName(locale, s)}
              </p>
              <p className="lines-1 mt-1 line-clamp-1 text-sm text-muted">
                {locale === "ml" ? s.location_ml : s.location_en}
              </p>
              {live.length ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-live">
                  <span className="live-dot" />
                  <span className="line-clamp-1">{tName(locale, live[0].programme)}</span>
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  {events.filter((e) => e.stage_id === s.id).length} {t.programmes.toLowerCase()}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
