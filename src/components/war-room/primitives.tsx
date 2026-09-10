import { cn } from "@/lib/utils";

export function TableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card festival-table-card overflow-hidden max-sm:mobile-bleed max-sm:rounded-none max-sm:border-x-0",
        className,
      )}
    >
      <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin]">{children}</div>
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
        "px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wide text-muted sm:px-4 sm:py-3 sm:text-xs",
        className,
      )}
    >
      {children}
    </th>
  );
}

export const wrInput = "field-input text-sm";
export const wrLabel = "field-label";
