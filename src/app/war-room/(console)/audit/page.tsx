import * as demo from "@/lib/data/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid gap-3">
      <h1 className="font-display text-3xl">{t.auditLogs}</h1>
      <ol className="grid gap-2">
        {demo.auditLogs.map((log) => (
          <li key={log.id} className="rounded border border-line bg-white px-4 py-3 text-sm">
            <p className="font-medium">{log.action}</p>
            <p className="text-muted">
              {log.actor_name} · {log.entity_type} · {formatDateTime(log.created_at, locale)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
