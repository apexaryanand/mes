import * as demo from "@/lib/data/demo";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function StagesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid gap-3">
      <h1 className="font-display text-3xl">{t.stages}</h1>
      {demo.stages.map((s) => (
        <div key={s.id} className="rounded border border-line bg-white px-4 py-3">
          <p className="font-medium">{tName(locale, s)}</p>
          <p className="text-sm text-muted">{locale === "ml" ? s.location_ml : s.location_en}</p>
        </div>
      ))}
    </div>
  );
}
