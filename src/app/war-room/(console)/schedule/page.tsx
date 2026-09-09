import { updateEventStatusForm } from "@/domains/admin/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard, Th } from "@/components/war-room/primitives";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";
import type { EventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES: EventStatus[] = ["upcoming", "live", "completed", "delayed", "cancelled"];

export default async function ScheduleAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const events = await getScheduledEvents();

  return (
    <div className="grid gap-4">
      <TableCard>
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>{t.day}</Th>
              <Th>{t.time}</Th>
              <Th>{t.stage}</Th>
              <Th>{t.programme}</Th>
              <Th>{t.status}</Th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={e.id} className={cn("border-t border-line", i % 2 === 1 && "bg-paper/40")}>
                <td className="px-3 py-2 sm:px-4 sm:py-3 tabular">{e.day_number}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3 tabular">{e.start_time}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">{tName(locale, e.stage)}</td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <span className="font-medium">{tName(locale, e.programme)}</span>
                  <span className="text-muted"> · {tName(locale, e.category)}</span>
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} label={statusLabel(locale, e.status)} />
                    <form action={updateEventStatusForm} className="flex gap-1.5">
                      <input type="hidden" name="eventId" value={e.id} />
                      <select
                        name="status"
                        defaultValue={e.status}
                        className="rounded-lg border border-line bg-paper-white px-2 py-1.5 text-sm focus:border-gold"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(locale, s)}
                          </option>
                        ))}
                      </select>
                      <button className="rounded-full border border-line px-3 text-sm font-semibold text-kerala-dark transition-colors hover:border-gold">
                        {t.edit}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
