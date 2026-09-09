import * as demo from "@/lib/data/demo";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function SchoolsAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid gap-3">
      <h1 className="font-display text-3xl">{t.schools}</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="py-2">Code</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {demo.schools.map((s) => (
            <tr key={s.id} className="border-b border-line/70">
              <td className="py-2">{s.code}</td>
              <td>{tName(locale, s)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
