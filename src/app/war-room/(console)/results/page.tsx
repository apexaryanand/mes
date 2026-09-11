import Link from "next/link";
import { AdminPage } from "@/components/admin/admin-page";
import { AdminSubmit } from "@/components/admin/admin-submit";
import { AdminTable, AdminTd, AdminTh } from "@/components/admin/admin-table";
import { createDraftForEventForm } from "@/domains/admin/actions";
import { getAllResultSets } from "@/lib/data/admin-queries";
import { adminCopy } from "@/lib/admin/copy";
import { adminStatusLabel } from "@/lib/admin/status";
import { getScheduledEvents } from "@/lib/data/queries";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function ResultsIndexPage() {
  const [events, resultSets] = await Promise.all([getScheduledEvents(), getAllResultSets()]);

  return (
    <AdminPage title={adminCopy.resultManagement} description={adminCopy.resultsHelp}>
      <AdminTable>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <AdminTh>{adminCopy.programme}</AdminTh>
              <AdminTh>{adminCopy.category}</AdminTh>
              <AdminTh>{adminCopy.stage}</AdminTh>
              <AdminTh>{adminCopy.status}</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const set = resultSets.find(
                (s) => s.scheduled_event_id === event.id && s.status !== "archived",
              );
              return (
                <tr key={event.id}>
                  <AdminTd className="font-medium">{event.programme.name_en}</AdminTd>
                  <AdminTd>{event.category.name_en}</AdminTd>
                  <AdminTd>{event.stage.name_en}</AdminTd>
                  <AdminTd>
                    <StatusBadge
                      status={set?.status ?? "draft"}
                      label={set ? adminStatusLabel(set.status) : "—"}
                    />
                  </AdminTd>
                  <AdminTd className="text-right">
                    {set ? (
                      <Link href={`/war-room/results/${set.id}`} className="font-medium text-zinc-900 hover:underline">
                        {adminCopy.edit}
                      </Link>
                    ) : (
                      <form action={createDraftForEventForm} className="inline">
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="from" value="/war-room/results" />
                        <AdminSubmit variant="link">{adminCopy.create}</AdminSubmit>
                      </form>
                    )}
                  </AdminTd>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminTable>
    </AdminPage>
  );
}
