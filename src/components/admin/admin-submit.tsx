"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { adminCopy } from "@/lib/admin/copy";

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AdminSubmit({
  children,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "link";
}) {
  const { pending } = useFormStatus();
  const label = pending ? adminCopy.working : children;

  if (variant === "link") {
    return (
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className={cn(
          "inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 disabled:opacity-60",
          className,
        )}
      >
        {pending ? <Spinner /> : null}
        {label}
      </button>
    );
  }

  const styles = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800",
    secondary: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium disabled:opacity-60",
        styles,
        className,
      )}
    >
      {pending ? <Spinner /> : null}
      {label}
    </button>
  );
}
