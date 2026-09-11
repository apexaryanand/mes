import { saveHouseForm } from "@/domains/admin/catalog-actions";
import { TableCard, Th, Td, WrSubmit, wrInput, wrLabel } from "@/components/war-room/primitives";
import { HouseBadge } from "@/components/public/house-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses } from "@/lib/data/queries";

export default async function HousesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const houses = await getHouses();

  return (
    <div className="grid gap-5">
      <p className="text-sm text-muted">
        Four houses are fixed for MESTA. Edit display names only — houses cannot be added or removed.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {houses.map((house) => (
          <form key={house.id} action={saveHouseForm} className="card grid gap-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-black">{t.edit} {t.house}</h2>
              <HouseBadge house={house} />
            </div>
            <input type="hidden" name="id" value={house.id} />
            <label className={wrLabel}>
              {t.house} (EN)
              <input name="name_en" required className={wrInput} defaultValue={house.name_en} />
            </label>
            <label className={wrLabel}>
              {t.house} (ML)
              <input name="name_ml" required className={wrInput} defaultValue={house.name_ml} />
            </label>
            <label className={wrLabel}>
              Short name
              <input name="short_name" className={wrInput} defaultValue={house.short_name ?? ""} />
            </label>
            <WrSubmit>{t.saveChanges}</WrSubmit>
          </form>
        ))}
      </div>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <Th>Slug</Th>
              <Th>{t.house}</Th>
              <Th>Color</Th>
            </tr>
          </thead>
          <tbody>
            {houses.map((h) => (
              <tr key={h.id}>
                <Td className="font-mono text-xs text-muted">{h.slug}</Td>
                <Td className="font-medium">{tName(locale, h)}</Td>
                <Td>
                  <HouseBadge house={h} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
