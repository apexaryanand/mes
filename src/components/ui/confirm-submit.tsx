"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function ConfirmSubmit({
  label,
  message,
  className,
}: {
  label: string;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={cn(className, pending && "pointer-events-none opacity-60")}
      disabled={pending}
      aria-busy={pending}
      onClick={(e) => {
        if (pending) {
          e.preventDefault();
          return;
        }
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <span className="inline-flex items-center gap-1.5">
        {pending ? (
          <svg
            className="animate-spin"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : null}
        {pending ? "Working…" : label}
      </span>
    </button>
  );
}
