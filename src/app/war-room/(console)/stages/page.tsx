import { saveStageForm } from "@/domains/admin/catalog-actions";
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
import { getStages } from "@/lib/data/queries";

export default async function StagesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const stages = await getStages();

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr] xl:items-start">
      <form action={saveStageForm}>
        <WrFormCard title={`${t.create} ${t.stage}`} cols={1}>
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
          <WrSubmit>{t.create}</WrSubmit>
        </WrFormCard>
      </form>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <Th>{t.stage}</Th>
              <Th>Location</Th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s) => (
              <tr key={s.id}>
                <Td className="font-medium">{tName(locale, s)}</Td>
                <Td className="text-muted">{s.location_en ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
