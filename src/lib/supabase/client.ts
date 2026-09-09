import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/utils";

export function createBrowserSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!isSupabaseConfigured() || !url || !key) return null;
  return createBrowserClient(url, key);
}
