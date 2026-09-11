"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

export const wrInput = "field-input text-sm";
export const wrLabel = "field-label";

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function WrSubmit({
  children,
  className,
  variant = "primary",
  size = "md",
  appearance = "button",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "gold" | "danger";
  size?: "sm" | "md" | "lg";
  appearance?: "button" | "link";
}) {
  const { pending } = useFormStatus();
  const label = pending ? "Working…" : children;

  if (appearance === "link") {
    return (
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={cn(
          "inline-flex items-center gap-1.5 font-bold text-fest-ink hover:text-fest-red disabled:opacity-60",
          className,
        )}
      >
        {pending ? <Spinner /> : null}
        {label}
      </button>
    );
  }

  return (
    <Button type="submit" variant={variant} size={size} className={className} disabled={pending} aria-busy={pending}>
      {pending ? <Spinner /> : null}
      <span className={pending ? "opacity-80" : undefined}>{label}</span>
    </Button>
  );
}

export function WrFlashError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="border-2 border-fest-red bg-live-soft px-4 py-3 text-sm font-bold text-fest-red"
    >
      {message}
    </p>
  );
}

export function WrFormCard({
  title,
  children,
  className,
  cols = 2,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2;
}) {
  return (
    <div className={cn("card grid gap-3 p-4", cols === 2 && "lg:grid-cols-2", className)}>
      <h2 className="font-display text-base font-black text-fest-ink lg:col-span-2">{title}</h2>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page chrome                                                                */
/* -------------------------------------------------------------------------- */

export function WrPageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title?: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  if (!title && !description) return null;
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 border-fest-ink/15 pb-4">
      <div className="min-w-0">
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        {title ? (
          <h2 className="font-display mt-1 text-xl font-black text-fest-ink">{title}</h2>
        ) : null}
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </div>
  );
}

const panelAccent: Record<string, string> = {
  red: "before:bg-fest-red",
  green: "before:bg-fest-green",
  gold: "before:bg-fest-yellow",
  violet: "before:bg-fest-violet",
};

export function WrPanel({
  title,
  accent = "gold",
  children,
  className,
}: {
  title: string;
  accent?: keyof typeof panelAccent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      <h3
        className={cn(
          "relative border-b-2 border-fest-ink/15 px-4 py-2.5 pl-5 text-sm font-black text-fest-ink",
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1.5",
          panelAccent[accent],
        )}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export function WrEmpty({ label }: { label: string }) {
  return <p className="px-4 py-8 text-center text-sm text-muted">{label}</p>;
}

export function WrStepBar({
  steps,
  activeIndex,
}: {
  steps: Array<{ label: string }>;
  activeIndex: number;
}) {
  return (
    <ol className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = activeIndex >= 0 && i <= activeIndex;
        const active = i === activeIndex;
        return (
          <li key={step.label} className="flex flex-1 items-center gap-1 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center border-2 border-fest-ink text-xs font-black",
                  done
                    ? active
                      ? "bg-fest-yellow text-fest-ink shadow-[var(--shadow-hard-xs)]"
                      : "bg-fest-ink text-fest-yellow"
                    : "bg-paper text-muted",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-bold lg:inline",
                  done ? "text-fest-ink" : "text-muted",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <span
                className={cn(
                  "h-0.5 flex-1",
                  activeIndex > i ? "bg-fest-ink" : "bg-line",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* Tables                                                                     */
/* -------------------------------------------------------------------------- */

export function TableCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card festival-table-card overflow-hidden", className)}>
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
        "whitespace-nowrap px-3 py-2 text-left text-[11px] font-black uppercase tracking-wide lg:px-4 lg:py-2.5",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-3 py-2 align-middle lg:px-4 lg:py-2.5", className)}>{children}</td>
  );
}
