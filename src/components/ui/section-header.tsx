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
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <h2 className="font-display text-display-md mt-1.5 font-bold">{title}</h2>
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
