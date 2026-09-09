import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!isSupabaseConfigured() || !url || !key) return response;

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith("/war-room") && !path.startsWith("/war-room/login");
  const isReporter = path.startsWith("/reporter");

  if ((isProtected || isReporter) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/war-room/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}
