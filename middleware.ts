import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value || null;

  const isAuthenticated = Boolean(accessToken);
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));

  // Неавторизованный → хочет приватный путь
  if (!isAuthenticated && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Авторизованный → пытается попасть на /sign-in или /sign-up
  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
