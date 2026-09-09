import { getAuditLogs } from "@/lib/data/admin-queries";
import { formatDateTime } from "@/lib/utils";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AuditPage() {
  const locale = await getRequestLocale();
  const logs = await getAuditLogs();

  return (
    <div className="grid gap-3">
      {logs.length ? (
        logs.map((log) => (
          <div key={log.id} className="card px-3 py-2.5 text-sm sm:px-4 sm:py-3">
            <p className="font-medium">{log.action}</p>
            <p className="text-muted">
              {log.actor_name} · {formatDateTime(log.created_at, locale)} · {log.entity_type}
            </p>
          </div>
        ))
      ) : (
        <p className="card p-6 text-center text-sm text-muted">No audit entries yet.</p>
      )}
    </div>
  );
}
