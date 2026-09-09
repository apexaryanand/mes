import { saveCategoryForm } from "@/domains/admin/catalog-actions";
import { TableCard, Th, wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getCategories } from "@/lib/data/queries";

export default async function CategoriesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const categories = await getCategories();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <form action={saveCategoryForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.create} {t.category}</h2>
        <label className={wrLabel}>
          Code
          <input name="code" required className={wrInput} placeholder="HS_GEN" />
        </label>
        <label className={wrLabel}>
          {t.category} (EN)
          <input name="name_en" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          {t.category} (ML)
          <input name="name_ml" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          Sort order
          <input name="sort_order" type="number" defaultValue={0} className={wrInput} />
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
          {t.create}
        </button>
      </form>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>Code</Th>
              <Th>{t.category}</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="px-3 py-2 font-mono text-xs sm:px-4 sm:py-3">{c.code}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">{tName(locale, c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
