import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // 🔓 Allow public routes (IMPORTANT)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/reset-password") ||
    pathname === "/"
  ) {
    return res;
  }

  // 🔒 Not logged in → redirect
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔐 Get role (minimal + fast)
  const activeOrchestraId =
    req.cookies.get("active_orchestra_id")?.value

  const { data: membership } = await supabase
    .from("members")
    .select("role")
    .eq("user_id", user.id)
    .eq("orchestra_id", activeOrchestraId)
    .eq("is_active", true)
    .maybeSingle()

  const role = membership?.role ?? "member";
  const navigationRole = role === "member" ? "member" : "admin";

  // 🚫 Block member from admin routes
  if (
    pathname.startsWith("/admin") &&
    navigationRole !== "admin"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/events/:path*",
  ],
};