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
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded border border-line bg-paper-white p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-deep">{t.littleKites}</p>
            <h1 className="font-display mt-1 text-3xl">{t.warRoom}</h1>
          </div>
          <LanguageToggle compact />
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-sm">
          <Link href="/" className="text-kerala-dark">
            {t.home}
          </Link>
        </p>
      </div>
    </div>
  );
}
