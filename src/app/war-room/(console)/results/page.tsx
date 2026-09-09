import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { createDraftForEventForm } from "@/domains/admin/actions";
import * as demo from "@/lib/data/demo";
import { getDictionary, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";

export default async function ResultsIndexPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const events = await getScheduledEvents();

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-3xl">{t.resultManagement}</h1>
      <div className="overflow-x-auto rounded border border-line bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-zinc-50">
            <tr>
              <th className="px-3 py-2">{t.programme}</th>
              <th className="px-3 py-2">{t.category}</th>
              <th className="px-3 py-2">{t.stage}</th>
              <th className="px-3 py-2">{t.status}</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const set = demo.resultSets.find(
                (s) => s.scheduled_event_id === event.id && s.status !== "archived",
              );
              return (
                <tr key={event.id} className="border-t border-line">
                  <td className="px-3 py-2">{tName(locale, event.programme)}</td>
                  <td className="px-3 py-2">{tName(locale, event.category)}</td>
                  <td className="px-3 py-2">{tName(locale, event.stage)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={set?.status ?? "draft"} label={set?.status ?? "none"} />
                  </td>
                  <td className="px-3 py-2">
                    {set ? (
                      <Link href={`/war-room/results/${set.id}`} className="text-kerala-dark">
                        {t.edit}
                      </Link>
                    ) : (
                      <form action={createDraftForEventForm}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button className="text-kerala-dark">{t.create}</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
