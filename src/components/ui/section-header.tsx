import Link from "next/link";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  linkHref,
  linkLabel,
  className,
}: {
  eyebrow?: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "festival-section-header mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:mb-5",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <span className="section-eyebrow max-sm:text-[0.65rem]">{eyebrow}</span>
        ) : null}
        <h2 className="font-display mt-1 text-xl font-black sm:mt-1.5 sm:text-display-md">
          {title}
        </h2>
      </div>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1 border-b-2 border-transparent text-sm font-bold text-fest-red transition-colors hover:border-fest-red"
        >
          {linkLabel}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      ) : null}
    </div>
  );
}
