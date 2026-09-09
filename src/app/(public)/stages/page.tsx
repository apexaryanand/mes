import Link from "next/link";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents, getStages } from "@/lib/data/queries";

export default async function StagesPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [stages, events] = await Promise.all([getStages(), getScheduledEvents()]);

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.stages}</h1>
      {stages.map((s) => {
        const live = events.filter((e) => e.stage_id === s.id && e.status === "live");
        return (
          <Link key={s.id} href={`/stages/${s.slug}`} className="rounded border border-line bg-paper-white p-4">
            <p className="font-display text-xl">{tName(locale, s)}</p>
            <p className="text-sm text-muted">
              {locale === "ml" ? s.location_ml : s.location_en}
            </p>
            {live.length ? (
              <p className="mt-2 text-sm text-live">
                {t.live}: {tName(locale, live[0].programme)}
              </p>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
