import { saveProgrammeForm } from "@/domains/admin/catalog-actions";
import { wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getProgrammes } from "@/lib/data/queries";

export default async function ProgrammesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const programmes = await getProgrammes();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <form action={saveProgrammeForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.create} {t.programme}</h2>
        <label className={wrLabel}>
          {t.programme} (EN)
          <input name="name_en" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          {t.programme} (ML)
          <input name="name_ml" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          Code
          <input name="code" className={wrInput} />
        </label>
        <label className={wrLabel}>
          Type
          <select name="item_kind" className={wrInput} defaultValue="individual">
            <option value="individual">individual</option>
            <option value="group">group</option>
          </select>
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
          {t.create}
        </button>
      </form>

      <ul className="grid gap-2 sm:grid-cols-2">
        {programmes.map((p) => (
          <li
            key={p.id}
            className="card flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <span className="font-medium">{tName(locale, p)}</span>
            <span className="chip py-0.5 text-[11px]">{p.item_kind}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
