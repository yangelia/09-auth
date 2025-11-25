import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSessionServer } from "@/lib/api/serverApi";

const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));

  // ----- 1. Нет accessToken -----
  if (!accessToken) {
    if (refreshToken) {
      try {
        const apiRes = await checkSessionServer();

        // typed version — NO ANY
        const rawSetCookie = apiRes?.headers?.["set-cookie"];
        const setCookie: string[] = Array.isArray(rawSetCookie)
          ? rawSetCookie
          : rawSetCookie
          ? [rawSetCookie]
          : [];

        if (setCookie.length > 0) {
          const response = NextResponse.next();

          for (const cookieStr of setCookie) {
            const parsed = parse(cookieStr);

            const options = {
              path: parsed.Path,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            };

            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, options);
            }

            if (parsed.refreshToken) {
              response.cookies.set(
                "refreshToken",
                parsed.refreshToken,
                options
              );
            }
          }

          if (isAuthRoute) {
            return NextResponse.redirect(new URL("/profile", request.url));
          }

          return response;
        }
      } catch {
        if (isPrivateRoute) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }
      }
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  }

  // ----- 2. Есть accessToken → нельзя попадать на sign-in/sign-up -----
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
