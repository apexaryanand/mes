import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard, Th, Td, WrSubmit } from "@/components/war-room/primitives";
import { createDraftForEventForm } from "@/domains/admin/actions";
import { getAllResultSets } from "@/lib/data/admin-queries";
import { getDictionary, statusLabel, tName } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { getScheduledEvents } from "@/lib/data/queries";

export default async function ResultsIndexPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  const [events, resultSets] = await Promise.all([getScheduledEvents(), getAllResultSets()]);

  return (
    <TableCard>
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr>
            <Th>{t.programme}</Th>
            <Th>{t.category}</Th>
            <Th>{t.stage}</Th>
            <Th>{t.status}</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const set = resultSets.find(
              (s) => s.scheduled_event_id === event.id && s.status !== "archived",
            );
            return (
              <tr key={event.id}>
                <Td className="font-medium">{tName(locale, event.programme)}</Td>
                <Td>{tName(locale, event.category)}</Td>
                <Td>{tName(locale, event.stage)}</Td>
                <Td>
                  <StatusBadge
                    status={set?.status ?? "draft"}
                    label={set ? statusLabel(locale, set.status) : "—"}
                  />
                </Td>
                <Td className="text-right">
                  {set ? (
                    <Link
                      href={`/war-room/results/${set.id}`}
                      className="font-bold text-fest-ink hover:text-fest-red"
                    >
                      {t.edit}
                    </Link>
                  ) : (
                    <form action={createDraftForEventForm} className="inline">
                      <input type="hidden" name="eventId" value={event.id} />
                      <input type="hidden" name="from" value="/war-room/results" />
                      <WrSubmit appearance="link">{t.create}</WrSubmit>
                    </form>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableCard>
  );
}
