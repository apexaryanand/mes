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
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h1 className="font-display mt-1 text-xl font-bold sm:mt-1.5 sm:text-display-md">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted sm:mt-1.5 sm:text-base">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}
