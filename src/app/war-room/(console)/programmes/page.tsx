import * as demo from "@/lib/data/demo";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function ProgrammesAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid gap-3">
      <h1 className="font-display text-3xl">{t.programmes}</h1>
      <ul className="grid gap-2">
        {demo.programmes.map((p) => (
          <li key={p.id} className="rounded border border-line bg-white px-4 py-3">
            {tName(locale, p)} · {p.item_kind}
          </li>
        ))}
      </ul>
    </div>
  );
}
