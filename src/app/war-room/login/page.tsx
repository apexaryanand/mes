import Link from "next/link";
import { LoginForm } from "@/components/war-room/login-form";
import { adminCopy } from "@/lib/admin/copy";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <div className="hidden flex-col justify-between bg-zinc-900 p-10 text-white lg:flex">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{adminCopy.official}</p>
        <div>
          <p className="text-3xl font-semibold">MESTA Ops</p>
          <p className="mt-3 max-w-sm text-sm text-zinc-400">{adminCopy.footerNote}</p>
        </div>
        <div className="space-y-1 text-sm text-zinc-500">
          <p>{adminCopy.websiteByLittleKites}</p>
          <p>{adminCopy.operationsByLittleKites}</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-zinc-50 px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{adminCopy.warRoom}</p>
            <h1 className="mt-1 text-2xl font-semibold text-zinc-900">{adminCopy.login}</h1>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
          <p className="mt-6 text-sm">
            <Link href="/" className="font-medium text-zinc-700 hover:text-zinc-900">
              ← {adminCopy.home}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
