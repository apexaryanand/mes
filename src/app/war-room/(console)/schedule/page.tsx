import { updateEventStatusForm } from "@/domains/admin/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";
import type { EventStatus } from "@/lib/types";

const STATUSES: EventStatus[] = ["upcoming", "live", "completed", "delayed", "cancelled"];

export default async function ScheduleAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const events = await getScheduledEvents();

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.scheduleManagement}</h1>
      <div className="overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-3 py-2">{t.day}</th>
              <th className="px-3 py-2">{t.time}</th>
              <th className="px-3 py-2">{t.stage}</th>
              <th className="px-3 py-2">{t.programme}</th>
              <th className="px-3 py-2">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-line">
                <td className="px-3 py-2">{e.day_number}</td>
                <td className="px-3 py-2">{e.start_time}</td>
                <td className="px-3 py-2">{tName(locale, e.stage)}</td>
                <td className="px-3 py-2">
                  {tName(locale, e.programme)} · {tName(locale, e.category)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={e.status} label={e.status} />
                    <form action={updateEventStatusForm} className="flex gap-1">
                      <input type="hidden" name="eventId" value={e.id} />
                      <select name="status" defaultValue={e.status} className="rounded border border-line px-1 py-1">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button className="rounded border border-line px-2">{t.edit}</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
