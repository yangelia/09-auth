import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const privatePrefixes = ["/notes", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privatePrefixes.some((route) =>
    pathname.startsWith(route)
  );

  // Неавторизованный → пытается открыть приватный путь
  if (!isAuthenticated && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    if (pathname !== "/") {
      url.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(url);
  }

  // Авторизованный → идёт на /sign-in или /sign-up
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
