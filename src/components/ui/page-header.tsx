import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "festival-page-header flex flex-wrap items-end justify-between gap-x-4 gap-y-3",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h1 className="font-display mt-1 text-2xl font-black sm:mt-1.5 sm:text-display-md">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
