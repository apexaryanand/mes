import { AdminEmpty } from "@/components/admin/admin-table";

export function WorkQueue({
  items,
  emptyLabel,
}: {
  items: React.ReactNode[];
  emptyLabel: string;
}) {
  if (!items.length) return <AdminEmpty label={emptyLabel} />;
  return <div className="overflow-hidden border-2 border-fest-ink bg-paper-white shadow-[4px_4px_0_var(--fest-ink)]">{items}</div>;
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
    <div className="group flex flex-wrap items-center gap-4 px-4 py-4 transition-colors hover:bg-fest-yellow-soft sm:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-fest-red" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-bold text-fest-ink">{title}</p>
          {meta ? <p className="mt-1 text-xs text-muted">{meta}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div> : null}
    </div>
  );
}
