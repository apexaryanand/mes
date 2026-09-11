import { createServerSupabase } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

export async function getSessionProfile() {
  // Temporary preview-only access for operations review. Production always requires Supabase Auth.
  if (process.env.NODE_ENV !== "production") {
    return {
      id: "preview-admin",
      display_name: "Preview Admin",
      role: "super_admin" as AppRole,
      email: "preview@kalotsavam.local",
      is_active: true,
    };
  }

  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!profile || profile.is_active === false) return null;
  return {
    id: profile.id as string,
    display_name: profile.display_name as string,
    role: profile.role as AppRole,
    email: data.user.email ?? null,
    is_active: profile.is_active as boolean,
  };
}

export function can(role: AppRole | undefined, allowed: AppRole[]) {
  if (!role) return false;
  if (role === "super_admin") return true;
  return allowed.includes(role);
}
