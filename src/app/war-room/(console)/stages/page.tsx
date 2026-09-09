import * as demo from "@/lib/data/demo";
import { tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function StagesAdminPage() {
  const locale = await getRequestLocale();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {demo.stages.map((s) => (
        <div
          key={s.id}
          className="card relative overflow-hidden p-3 pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:[background:var(--grad-gold)] sm:p-4 sm:pl-5 sm:before:w-1.5"
        >
          <p className="font-display text-lg font-bold">{tName(locale, s)}</p>
          <p className="text-sm text-muted">
            {locale === "ml" ? s.location_ml : s.location_en}
          </p>
        </div>
      ))}
    </div>
  );
}
