import { cookies } from "next/headers";
import * as demo from "@/lib/data/demo";
import { createServerSupabase } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/utils";

export async function getSessionProfile() {
  const jar = await cookies();
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    const { data } = await supabase!.auth.getUser();
    if (!data.user) return null;
    const { data: profile } = await supabase!
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();
    if (!profile) return null;
    return {
      id: profile.id as string,
      display_name: profile.display_name as string,
      role: profile.role as AppRole,
      email: data.user.email ?? null,
      is_active: profile.is_active as boolean,
    };
  }
  const role = jar.get("kalolsavam_demo_role")?.value as AppRole | undefined;
  const email = jar.get("kalolsavam_demo_email")?.value;
  if (!role) return null;
  const profile = demo.profiles.find((p) => p.role === role);
  return profile
    ? { ...profile, email: email ?? profile.email }
    : { id: "demo", display_name: role, role, email: email ?? null, is_active: true };
}

export function can(role: AppRole | undefined, allowed: AppRole[]) {
  if (!role) return false;
  if (role === "super_admin") return true;
  return allowed.includes(role);
}
