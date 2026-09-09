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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between [background:var(--grad-hero)]">
        <div className="kolam-bg absolute inset-0 opacity-[0.12]" aria-hidden />
        <div
          className="absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl [background:var(--grad-gold)]"
          aria-hidden
        />
        <div className="relative p-10">
          <span className="section-eyebrow text-gold-light before:[background:var(--grad-gold)]">
            {t.official}
          </span>
        </div>
        <div className="relative p-10">
          <p className="font-display text-display-lg font-black text-white">{t.brand}</p>
          <p className="mt-3 max-w-sm text-white/70">{t.footerNote}</p>
        </div>
        <div className="relative p-10 text-sm text-white/50">{t.littleKites}</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-[#f1f0ec] px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <p className="section-eyebrow">{t.warRoom}</p>
              <h1 className="font-display text-display-md mt-1 font-bold">{t.login}</h1>
            </div>
            <LanguageToggle compact />
          </div>
          <div className="card p-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-kerala-dark hover:text-gold-deep"
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
