import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard, Th } from "@/components/war-room/primitives";
import { createDraftForEventForm } from "@/domains/admin/actions";
import * as demo from "@/lib/data/demo";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";
import { cn } from "@/lib/utils";

export default async function ResultsIndexPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const events = await getScheduledEvents();

  return (
    <div className="grid gap-4">
      <TableCard>
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <Th>{t.programme}</Th>
              <Th>{t.category}</Th>
              <Th>{t.stage}</Th>
              <Th>{t.status}</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => {
              const set = demo.resultSets.find(
                (s) => s.scheduled_event_id === event.id && s.status !== "archived",
              );
              return (
                <tr
                  key={event.id}
                  className={cn("border-t border-line", i % 2 === 1 && "bg-paper/40")}
                >
                  <td className="px-3 py-2 sm:px-4 sm:py-3 font-medium">{tName(locale, event.programme)}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">{tName(locale, event.category)}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">{tName(locale, event.stage)}</td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3">
                    <StatusBadge
                      status={set?.status ?? "draft"}
                      label={set ? statusLabel(locale, set.status) : "—"}
                    />
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 text-right">
                    {set ? (
                      <Link
                        href={`/war-room/results/${set.id}`}
                        className="font-semibold text-kerala-dark hover:text-gold-deep"
                      >
                        {t.edit}
                      </Link>
                    ) : (
                      <form action={createDraftForEventForm}>
                        <input type="hidden" name="eventId" value={event.id} />
                        <button className="font-semibold text-kerala-dark hover:text-gold-deep">
                          {t.create}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}
