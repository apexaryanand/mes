import { saveScheduledEventForm } from "@/domains/admin/catalog-actions";
import { updateEventStatusForm } from "@/domains/admin/actions";
import { wrInput, wrLabel } from "@/components/war-room/primitives";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard, Th } from "@/components/war-room/primitives";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getCategories, getProgrammes, getScheduledEvents, getStages } from "@/lib/data/queries";
import { getSettings } from "@/lib/data/queries";
import type { EventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES: EventStatus[] = ["upcoming", "live", "completed", "delayed", "cancelled"];

export default async function ScheduleAdminPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [events, programmes, categories, stages, settings] = await Promise.all([
    getScheduledEvents(),
    getProgrammes(),
    getCategories(),
    getStages(),
    getSettings(),
  ]);

  return (
    <div className="grid gap-4">
      <form action={saveScheduledEventForm} className="card grid gap-3 p-3 sm:grid-cols-2 sm:p-5">
        <h2 className="font-display text-lg font-bold sm:col-span-2">{t.create} event</h2>
        <label className={wrLabel}>
          {t.programme}
          <select name="programme_id" required className={wrInput}>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>{p.name_en}</option>
            ))}
          </select>
        </label>
        <label className={wrLabel}>
          {t.category}
          <select name="category_id" required className={wrInput}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_en}</option>
            ))}
          </select>
        </label>
        <label className={wrLabel}>
          {t.stage}
          <select name="stage_id" required className={wrInput}>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.name_en}</option>
            ))}
          </select>
        </label>
        <label className={wrLabel}>
          {t.day}
          <input name="day_number" type="number" min={1} max={3} defaultValue={settings.current_day ?? 1} className={wrInput} />
        </label>
        <label className={wrLabel}>
          Date
          <input name="event_date" type="date" required defaultValue={settings.start_date} className={wrInput} />
        </label>
        <label className={wrLabel}>
          {t.startTime}
          <input name="start_time" type="time" required className={wrInput} />
        </label>
        <label className={wrLabel}>
          End time
          <input name="end_time" type="time" className={wrInput} />
        </label>
        <button className="min-h-11 rounded-full bg-kerala-dark text-sm font-semibold text-white sm:col-span-2">
          {t.create}
        </button>
      </form>

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
                        className="field-input min-h-9 w-auto px-2 py-1.5 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(locale, s)}
                          </option>
                        ))}
                      </select>
                      <button className="chip shrink-0 hover:bg-fest-yellow">
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
