import { cn } from "@/lib/utils";
import { adminCopy } from "@/lib/admin/copy";

export function AdminTable({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminTh({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("border-b border-zinc-100 px-4 py-3 align-middle text-sm text-zinc-800", className)}>{children}</td>;
}

export function AdminEmpty({ label }: { label?: string }) {
  return <p className="px-4 py-10 text-center text-sm text-zinc-500">{label ?? adminCopy.noItems}</p>;
}
