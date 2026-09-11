import { cn } from "@/lib/utils";

export const adminInput =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-60";
export const adminLabel = "grid gap-1.5 text-sm font-medium text-zinc-700";

export function AdminField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn(adminLabel, className)}>
      {label}
      {children}
    </label>
  );
}
