import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";

const authRoutes = ["/sign-in", "/sign-up"];
const privatePrefixes = ["/notes", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // базовая проверка
  let isAuthenticated = Boolean(accessToken);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privatePrefixes.some((route) =>
    pathname.startsWith(route)
  );

  // ❗ Нет accessToken, но есть refreshToken → пробуем обновить сессию
  if (!accessToken && refreshToken) {
    try {
      const cookieHeader = request.headers.get("cookie") ?? "";
      const res = await checkSessionServer(cookieHeader);

      if (res.data?.success) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

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
