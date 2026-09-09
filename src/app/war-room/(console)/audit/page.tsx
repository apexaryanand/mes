import * as demo from "@/lib/data/demo";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  void t;
  return (
    <ol className="relative ml-1 border-l-2 border-line pl-6">
      {demo.auditLogs.map((log) => (
        <li key={log.id} className="relative pb-4 last:pb-0">
          <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-gold bg-paper-white" />
          <div className="card px-3 py-2.5 text-sm sm:px-4 sm:py-3">
            <p className="font-semibold text-kerala-dark">{log.action}</p>
            <p className="mt-0.5 text-muted">
              {log.actor_name} · {log.entity_type} · {formatDateTime(log.created_at, locale)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
