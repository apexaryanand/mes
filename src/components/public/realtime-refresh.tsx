"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";

const TABLES = [
  "result_sets",
  "result_entries",
  "school_standings",
  "scheduled_events",
  "live_updates",
  "media",
  "articles",
  "interviews",
];

export function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    const channel = supabase
      .channel("public-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}

export const PUBLIC_REALTIME_TABLES = TABLES;
