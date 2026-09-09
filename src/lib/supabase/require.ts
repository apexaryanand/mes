import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/utils";

export async function requireServerSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and a publishable/anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY).",
    );
  }
  const sb = await createServerSupabase();
  if (!sb) {
    throw new Error("Failed to create Supabase server client.");
  }
  return sb;
}

export function requireServiceSupabase() {
  const sb = createServiceSupabase();
  if (!sb) {
    throw new Error("Supabase service role is not configured. Set SUPABASE_SERVICE_ROLE_KEY.");
  }
  return sb;
}
