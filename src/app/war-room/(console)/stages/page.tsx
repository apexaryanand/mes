import { saveStageForm } from "@/domains/admin/catalog-actions";
import { wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getStages } from "@/lib/data/queries";

export default async function StagesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const stages = await getStages();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <form action={saveStageForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.create} {t.stage}</h2>
        <label className={wrLabel}>
          {t.stage} (EN)
          <input name="name_en" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          {t.stage} (ML)
          <input name="name_ml" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          Location (EN)
          <input name="location_en" className={wrInput} />
        </label>
        <label className={wrLabel}>
          Location (ML)
          <input name="location_ml" className={wrInput} />
        </label>
        <label className={wrLabel}>
          Sort order
          <input name="sort_order" type="number" defaultValue={0} className={wrInput} />
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
          {t.create}
        </button>
      </form>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {stages.map((s) => (
          <article
            key={s.id}
            className="card relative overflow-hidden p-3 pl-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-fest-yellow sm:p-4 sm:pl-5 sm:before:w-1.5"
          >
            <h2 className="font-display font-bold">{tName(locale, s)}</h2>
            <p className="text-sm text-muted">{s.location_en}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
