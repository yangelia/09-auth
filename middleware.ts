import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const privatePrefixes = ["/notes", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ❗ ПРОПУСКАЕМ ВСЕ API МАРШРУТЫ
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privatePrefixes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAuthenticated && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    if (pathname !== "/") {
      url.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api).*)", // <--- главное: исключили API !!
  ],
};
