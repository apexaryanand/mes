import { cn } from "@/lib/utils";

export function TableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export const wrInput =
  "min-h-11 rounded-xl border border-line bg-paper-white px-3 text-sm focus:border-gold";
export const wrLabel = "grid gap-1.5 text-sm font-medium";
