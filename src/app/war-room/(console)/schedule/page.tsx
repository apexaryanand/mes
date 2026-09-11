import { saveScheduledEventForm } from "@/domains/admin/catalog-actions";
import { updateEventStatusForm } from "@/domains/admin/actions";
import { AdminField, adminInput } from "@/components/admin/admin-field";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { adminCopy } from "@/lib/admin/copy";
import { adminStatusLabel } from "@/lib/admin/status";
import { getCategories, getProgrammes, getScheduledEvents, getSettings, getStages } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import type { EventStatus } from "@/lib/types";

const STATUSES: EventStatus[] = ["upcoming", "live", "completed", "delayed", "cancelled"];

export default async function ScheduleAdminPage() {
  const [events, programmes, categories, stages, settings] = await Promise.all([
    getScheduledEvents(),
    getProgrammes(),
    getCategories(),
    getStages(),
    getSettings(),
  ]);

  const byDay = new Map<number, typeof events>();
  for (const e of events) {
    const list = byDay.get(e.day_number) ?? [];
    list.push(e);
    byDay.set(e.day_number, list);
  }

  return (
    <AdminPage title={adminCopy.schedule} description={adminCopy.scheduleHelp}>
      <details className="rounded-lg border border-zinc-200 bg-white p-4 open:pb-4">
        <summary className="cursor-pointer text-sm font-medium text-zinc-900">{adminCopy.addEvent}</summary>
        <form action={saveScheduledEventForm} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AdminField label={adminCopy.programme}>
            <select name="programme_id" required className={adminInput}>
              {programmes.map((p) => <option key={p.id} value={p.id}>{p.name_en}</option>)}
            </select>
          </AdminField>
          <AdminField label={adminCopy.category}>
            <select name="category_id" required className={adminInput}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </AdminField>
          <AdminField label={adminCopy.stage}>
            <select name="stage_id" required className={adminInput}>
              {stages.map((s) => <option key={s.id} value={s.id}>{s.name_en}</option>)}
            </select>
          </AdminField>
          <AdminField label={adminCopy.day}>
            <input name="day_number" type="number" min={1} max={3} defaultValue={settings.current_day ?? 1} className={adminInput} />
          </AdminField>
          <AdminField label="Date">
            <input name="event_date" type="date" required defaultValue={settings.start_date} className={adminInput} />
          </AdminField>
          <AdminField label={adminCopy.startTime}>
            <input name="start_time" type="time" required className={adminInput} />
          </AdminField>
          <AdminField label="End time">
            <input name="end_time" type="time" className={adminInput} />
          </AdminField>
          <div className="sm:col-span-2 lg:col-span-3">
            <AdminSubmit>{adminCopy.create}</AdminSubmit>
          </div>
        </form>
      </details>

      {[...byDay.entries()].sort(([a], [b]) => a - b).map(([day, dayEvents]) => (
        <section key={day}>
          <h2 className="mb-2 text-sm font-semibold text-zinc-900">{adminCopy.day} {day}</h2>
          <AdminTable>
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <AdminTh>{adminCopy.startTime}</AdminTh>
                  <AdminTh>{adminCopy.stage}</AdminTh>
                  <AdminTh>{adminCopy.programme}</AdminTh>
                  <AdminTh>{adminCopy.status}</AdminTh>
                </tr>
              </thead>
              <tbody>
                {dayEvents.map((e) => (
                  <tr key={e.id}>
                    <AdminTd className="tabular-nums">{e.start_time}</AdminTd>
                    <AdminTd>{e.stage.name_en}</AdminTd>
                    <AdminTd>
                      <span className="font-medium">{e.programme.name_en}</span>
                      <span className="text-zinc-500"> · {e.category.name_en}</span>
                    </AdminTd>
                    <AdminTd>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={e.status} label={adminStatusLabel(e.status)} />
                        <form action={updateEventStatusForm} className="flex gap-1.5">
                          <input type="hidden" name="eventId" value={e.id} />
                          <select name="status" defaultValue={e.status} className={adminInput}>
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{adminStatusLabel(s)}</option>
                            ))}
                          </select>
                          <AdminSubmit variant="secondary">{adminCopy.saveChanges}</AdminSubmit>
                        </form>
                      </div>
                    </AdminTd>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        </section>
      ))}
    </AdminPage>
  );
}
