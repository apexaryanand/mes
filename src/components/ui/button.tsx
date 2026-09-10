import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "festival-button relative inline-flex items-center justify-center gap-2 text-center font-bold leading-tight " +
  "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-fest-ink text-fest-yellow hover:bg-fest-ink-soft",
  gold: "bg-fest-yellow text-fest-ink hover:bg-[color-mix(in_srgb,var(--fest-yellow)_82%,white)]",
  outline: "bg-paper-white text-fest-ink hover:bg-fest-yellow-soft",
  ghost: "border-transparent bg-transparent text-fest-ink shadow-none hover:bg-fest-yellow-soft",
  danger: "bg-fest-red text-white hover:bg-fest-red-deep",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3.5 text-[0.8125rem]",
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
