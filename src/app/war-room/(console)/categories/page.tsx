import { saveCategoryForm } from "@/domains/admin/catalog-actions";
import {
  TableCard,
  Th,
  Td,
  WrFormCard,
  WrSubmit,
  wrInput,
  wrLabel,
} from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getCategories } from "@/lib/data/queries";

export default async function CategoriesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const categories = await getCategories();

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr] xl:items-start">
      <form action={saveCategoryForm}>
        <WrFormCard title={`${t.create} ${t.category}`} cols={1}>
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
          <WrSubmit>{t.create}</WrSubmit>
        </WrFormCard>
      </form>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>{t.category}</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <Td className="font-mono text-xs">{c.code}</Td>
                <Td>{tName(locale, c)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
