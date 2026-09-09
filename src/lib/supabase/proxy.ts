import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
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
    const demoRole = request.cookies.get("kalolsavam_demo_role")?.value;
    if (demoRole) return response;
    const url = request.nextUrl.clone();
    url.pathname = "/war-room/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return response;
}
