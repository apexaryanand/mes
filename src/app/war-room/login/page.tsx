import Link from "next/link";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { LoginForm } from "@/components/war-room/login-form";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getRequestLocale } from "@/lib/i18n/server";
import { Suspense } from "react";

export default async function LoginPage() {
  const locale = await getRequestLocale();
  const t = getDictionary(locale);
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-fest-ink text-paper lg:flex lg:flex-col lg:justify-between">
        <div
          className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(var(--fest-yellow)_1.5px,transparent_1.5px)] [background-size:26px_26px]"
          aria-hidden
        />
        <div className="relative p-10">
          <span className="section-eyebrow text-fest-yellow before:bg-fest-yellow">
            {t.official}
          </span>
        </div>
        <div className="relative p-10">
          <p className="font-display text-display-lg font-black text-paper-white">{t.brand}</p>
          <div className="rule-festival mt-5 w-40" aria-hidden />
          <p className="mt-4 max-w-sm text-paper/70">{t.footerNote}</p>
        </div>
        <div className="relative p-10 text-sm text-paper/50">{t.littleKites}</div>
      </div>

      {/* Form panel */}
      <div className="festival-main flex items-center justify-center bg-paper px-3 py-8 sm:px-4 sm:py-10">
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6">
            <div className="min-w-0">
              <p className="section-eyebrow">{t.warRoom}</p>
              <h1 className="font-display text-display-md mt-1.5 font-black">{t.login}</h1>
            </div>
            <LanguageToggle compact />
          </div>
          <div className="card p-4 sm:p-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/"
              className="nav-underline inline-flex items-center gap-1.5 font-bold text-fest-ink"
            >
              <span aria-hidden>&larr;</span>
              {t.home}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
