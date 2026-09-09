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
    <div className={cn("mb-3 flex items-end justify-between gap-2 sm:mb-5 sm:gap-4", className)}>
      <div className="min-w-0">
        {eyebrow ? <span className="section-eyebrow max-sm:text-[0.65rem]">{eyebrow}</span> : null}
        <h2 className="font-display mt-1 text-xl font-bold sm:mt-1.5 sm:text-display-md">{title}</h2>
      </div>
      {linkHref && linkLabel ? (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-kerala-dark hover:text-gold-deep"
        >
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      ) : null}
    </div>
  );
}
