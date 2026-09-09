import {
  deleteSchoolForm,
  importSchoolsCsvForm,
  saveSchoolForm,
} from "@/domains/admin/catalog-actions";
import { TableCard, Th, wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getSchools } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function SchoolsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const schools = await getSchools();

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <form action={saveSchoolForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.create} {t.school}</h2>
        <label className={wrLabel}>
          Code
          <input name="code" className={wrInput} placeholder="19001" />
        </label>
        <label className={wrLabel}>
          {t.school} (EN)
          <input name="name_en" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          {t.school} (ML)
          <input name="name_ml" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          Short name
          <input name="short_name" className={wrInput} />
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
          {t.create}
        </button>
      </form>

      <form action={importSchoolsCsvForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">Bulk import schools (CSV)</h2>
        <p className="text-xs text-muted">Format: code,name_en,name_ml,short_name — one school per line</p>
        <textarea name="csv" rows={6} className={`${wrInput} min-h-32 font-mono text-xs`} />
        <button className="min-h-11 rounded-full border border-line text-sm font-semibold">Import CSV</button>
      </form>

      <TableCard className="lg:col-span-2">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {schools.map((s, i) => (
              <tr key={s.id} className={cn("border-t border-line", i % 2 === 1 && "bg-paper/40")}>
                <td className="px-3 py-2 font-mono text-xs font-semibold text-gold-deep sm:px-4 sm:py-3">
                  {s.code}
                </td>
                <td className="px-3 py-2 font-medium sm:px-4 sm:py-3">{tName(locale, s)}</td>
                <td className="px-3 py-2 text-right sm:px-4 sm:py-3">
                  <form action={deleteSchoolForm} className="inline">
                    <input type="hidden" name="id" value={s.id} />
                    <button className="text-xs font-semibold text-live">{t.remove}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
