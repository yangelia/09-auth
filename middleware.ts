import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSessionServer } from "@/lib/api/serverApi";

const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = request.cookies;
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const refreshToken = cookieStore.get("refreshToken")?.value || null;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  // ---------- 1. Нет accessToken ----------
  if (!accessToken) {
    // ----- есть refreshToken → пробуем обновить -----
    if (refreshToken) {
      const apiRes = await checkSessionServer();

      const setCookieHeader = apiRes?.headers?.["set-cookie"];
      const setCookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : setCookieHeader
        ? [setCookieHeader]
        : [];

      if (setCookies.length > 0) {
        const response = NextResponse.next();

        for (const cookieStr of setCookies) {
          const parsed = parse(cookieStr);
          const options = {
            path: parsed.Path,
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };

          if (parsed.accessToken)
            response.cookies.set("accessToken", parsed.accessToken, options);

          if (parsed.refreshToken)
            response.cookies.set("refreshToken", parsed.refreshToken, options);
        }

        // обновили — если это sign-in → редиректим на профиль
        if (isAuthRoute) {
          return NextResponse.redirect(new URL("/profile", request.url));
        }

        // иначе просто пропускаем
        return response;
      }

      // refreshToken невалидный → redirect
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    // Нет accessToken и нет refreshToken → redirect
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Публичные пути — пропускаем
    return NextResponse.next();
  }

  // ---------- 2. Есть accessToken, но идёт на sign-in/sign-up ----------
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
