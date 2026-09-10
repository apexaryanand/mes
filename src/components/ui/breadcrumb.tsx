import Link from "next/link";

export function Breadcrumb({
  parentHref,
  parentLabel,
  current,
}: {
  parentHref: string;
  parentLabel: string;
  current: string;
}) {
  return (
    <nav aria-label={parentLabel} className="flex items-center gap-2 text-sm text-muted">
      <Link
        href={parentHref}
        className="shrink-0 font-bold text-fest-ink underline-offset-4 transition-colors hover:text-fest-red hover:underline"
      >
        {parentLabel}
      </Link>
      <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-fest-red" aria-hidden />
      <span className="line-clamp-1 text-ink">{current}</span>
    </nav>
  );
}
