import { saveHouseForm } from "@/domains/admin/catalog-actions";
import { TableCard, Th, wrInput, wrLabel } from "@/components/war-room/primitives";
import { HouseBadge } from "@/components/public/house-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getHouses } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function HousesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const houses = await getHouses();

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Four houses are fixed for MESTA. Edit display names only — houses cannot be added or removed.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {houses.map((house) => (
          <form key={house.id} action={saveHouseForm} className="card grid gap-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">{t.edit} {t.house}</h2>
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
            <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white">
              {t.saveChanges}
            </button>
          </form>
        ))}
      </div>

      <TableCard>
        <table className="w-full text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>Slug</Th>
              <Th>{t.house}</Th>
              <Th>Color</Th>
            </tr>
          </thead>
          <tbody>
            {houses.map((h, i) => (
              <tr key={h.id} className={cn("border-t border-line", i % 2 === 1 && "bg-paper/40")}>
                <td className="px-3 py-2 font-mono text-xs text-muted sm:px-4 sm:py-3">{h.slug}</td>
                <td className="px-3 py-2 font-medium sm:px-4 sm:py-3">{tName(locale, h)}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <HouseBadge house={h} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
