import { saveProgrammeForm } from "@/domains/admin/catalog-actions";
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
import { getProgrammes } from "@/lib/data/queries";

export default async function ProgrammesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const programmes = await getProgrammes();

  return (
    <div className="grid gap-5 xl:grid-cols-[22rem_1fr] xl:items-start">
      <form action={saveProgrammeForm}>
        <WrFormCard title={`${t.create} ${t.programme}`} cols={1}>
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
          <WrSubmit>{t.create}</WrSubmit>
        </WrFormCard>
      </form>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <Th>{t.programme}</Th>
              <Th>Type</Th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((p) => (
              <tr key={p.id}>
                <Td className="font-medium">{tName(locale, p)}</Td>
                <Td>
                  <span className="chip py-0.5 text-[11px]">{p.item_kind}</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
