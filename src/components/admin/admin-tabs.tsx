"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminTabs({
  basePath,
  tabs,
}: {
  basePath: string;
  tabs: Array<{ id: string; label: string }>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("tab") ?? tabs[0]?.id;

  if (pathname !== basePath) return null;

  return (
    <div className="flex flex-wrap gap-1 border-b border-zinc-200">
      {tabs.map((tab) => {
        const href = `${basePath}?tab=${tab.id}`;
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={href}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border border-b-white border-zinc-200 bg-white text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
