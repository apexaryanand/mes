import {
  deleteParticipantForm,
  importParticipantsCsvForm,
  saveParticipantForm,
} from "@/domains/admin/catalog-actions";
import { TableCard, Th, wrInput, wrLabel } from "@/components/war-room/primitives";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getParticipants, getSchools } from "@/lib/data/queries";

export default async function ParticipantsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [schools, participants] = await Promise.all([getSchools(), getParticipants()]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
      <form action={saveParticipantForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">{t.create} {t.participant}</h2>
        <label className={wrLabel}>
          {t.school}
          <select name="school_id" required className={wrInput}>
            <option value="">—</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} · {tName(locale, s)}
              </option>
            ))}
          </select>
        </label>
        <label className={wrLabel}>
          Name (EN)
          <input name="full_name" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          Name (ML)
          <input name="full_name_ml" className={wrInput} />
        </label>
        <label className={wrLabel}>
          Class
          <input name="class_name" className={wrInput} placeholder="10 A" />
        </label>
        <label className={wrLabel}>
          Chest no.
          <input name="chest_number" className={wrInput} />
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
          {t.create}
        </button>
      </form>

      <form action={importParticipantsCsvForm} className="card grid gap-3 p-3 sm:p-5">
        <h2 className="font-display text-lg font-bold">Bulk import participants (CSV)</h2>
        <p className="text-xs text-muted">
          Format: school_code,full_name,full_name_ml,class_name,chest_number
        </p>
        <textarea name="csv" rows={6} className={`${wrInput} min-h-32 font-mono text-xs`} />
        <button className="min-h-11 rounded-full border border-line text-sm font-semibold">Import CSV</button>
      </form>

      <TableCard className="lg:col-span-2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>{t.participant}</Th>
              <Th>{t.school}</Th>
              <Th>Class</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} className="border-t border-line">
                <td className="px-3 py-2 font-medium sm:px-4 sm:py-3">{p.full_name}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  {p.school ? tName(locale, p.school) : "—"}
                </td>
                <td className="px-3 py-2 text-muted sm:px-4 sm:py-3">{p.class_name ?? "—"}</td>
                <td className="px-3 py-2 text-right sm:px-4 sm:py-3">
                  <form action={deleteParticipantForm} className="inline">
                    <input type="hidden" name="id" value={p.id} />
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
