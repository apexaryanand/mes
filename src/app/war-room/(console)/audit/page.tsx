import { TableCard, Th, Td, WrEmpty } from "@/components/war-room/primitives";
import { getAuditLogs } from "@/lib/data/admin-queries";
import { formatDateTime } from "@/lib/utils";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function AuditPage() {
  const locale = await getRequestLocale();
  const logs = await getAuditLogs();

  if (!logs.length) {
    return (
      <div className="card">
        <WrEmpty label="No audit entries yet." />
      </div>
    );
  }

  return (
    <TableCard>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr>
            <Th>Action</Th>
            <Th>Actor</Th>
            <Th>Entity</Th>
            <Th>Time</Th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <Td className="font-medium">{log.action}</Td>
              <Td>{log.actor_name}</Td>
              <Td className="text-muted">{log.entity_type}</Td>
              <Td className="tabular text-muted">{formatDateTime(log.created_at, locale)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}
