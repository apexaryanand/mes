import { AdminEmpty } from "@/components/admin/admin-table";

export function WorkQueue({
  items,
  emptyLabel,
}: {
  items: React.ReactNode[];
  emptyLabel: string;
}) {
  if (!items.length) return <AdminEmpty label={emptyLabel} />;
  return <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">{items}</div>;
}

export function WorkQueueRow({
  title,
  meta,
  actions,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-zinc-900">{title}</p>
        {meta ? <p className="text-xs text-zinc-500">{meta}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
