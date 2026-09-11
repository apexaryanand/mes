import {
  deleteParticipantForm,
  importParticipantsCsvForm,
  saveParticipantForm,
} from "@/domains/admin/catalog-actions";
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
import { getHouses, getParticipants } from "@/lib/data/queries";

export default async function ParticipantsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [houses, participants] = await Promise.all([getHouses(), getParticipants()]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-2 xl:items-start">
        <form action={saveParticipantForm}>
          <WrFormCard title={`${t.create} ${t.participant}`} cols={1}>
            <label className={wrLabel}>
              {t.house}
              <select name="house_id" required className={wrInput}>
                <option value="">—</option>
                {houses.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.code} · {tName(locale, h)}
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
            <WrSubmit>{t.create}</WrSubmit>
          </WrFormCard>
        </form>

        <form action={importParticipantsCsvForm}>
          <WrFormCard title="Bulk import participants (CSV)" cols={1}>
            <p className="text-xs text-muted lg:col-span-2">
              Format: house_slug,full_name,full_name_ml,class_name,chest_number
            </p>
            <textarea
              name="csv"
              rows={8}
              className={`${wrInput} min-h-40 font-mono text-xs`}
            />
            <WrSubmit className="w-full justify-center">Import CSV</WrSubmit>
          </WrFormCard>
        </form>
      </div>

      <TableCard>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <Th>{t.participant}</Th>
              <Th>{t.house}</Th>
              <Th>Class</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <Td className="font-medium">{p.full_name}</Td>
                <Td>{p.house ? tName(locale, p.house) : "—"}</Td>
                <Td className="text-muted">{p.class_name ?? "—"}</Td>
                <Td className="text-right">
                  <form action={deleteParticipantForm} className="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-xs font-bold text-fest-red hover:underline">
                      {t.remove}
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
