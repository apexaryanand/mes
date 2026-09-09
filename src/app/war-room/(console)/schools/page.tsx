import { TableCard, Th } from "@/components/war-room/primitives";
import * as demo from "@/lib/data/demo";
import { tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

export default async function SchoolsAdminPage() {
  const locale = await getRequestLocale();
  return (
    <TableCard>
      <table className="w-full text-left text-sm">
        <thead className="bg-paper">
          <tr>
            <Th>Code</Th>
            <Th>Name</Th>
          </tr>
        </thead>
        <tbody>
          {demo.schools.map((s, i) => (
            <tr key={s.id} className={cn("border-t border-line", i % 2 === 1 && "bg-paper/40")}>
              <td className="px-3 py-2 sm:px-4 sm:py-3 font-mono text-xs font-semibold text-gold-deep">{s.code}</td>
              <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium">{tName(locale, s)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}
