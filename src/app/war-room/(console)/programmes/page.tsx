import * as demo from "@/lib/data/demo";
import { tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ProgrammesAdminPage() {
  const locale = await getRequestLocale();
  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {demo.programmes.map((p) => (
        <li
          key={p.id}
          className="card flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3"
        >
          <span className="font-medium">{tName(locale, p)}</span>
          <span className="chip py-0.5 text-[11px]">{p.item_kind}</span>
        </li>
      ))}
    </ul>
  );
}
