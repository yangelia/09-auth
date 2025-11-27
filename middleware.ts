import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) =>
    matchesPrefix(pathname, route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    matchesPrefix(pathname, route)
  );

  // 🟦 1) Если идём на приватный маршрут → проверяем на сервере
  if (isPrivateRoute) {
    const sessionRes = await fetch(
      "https://notehub-api.goit.study/auth/session",
      {
        method: "GET",
        headers: {
          Cookie: request.cookies.toString(),
        },
      }
    );

    const { success } = await sessionRes
      .json()
      .catch(() => ({ success: false }));

    if (!success) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 🟩 2) Если авторизованы — не пускаем на /sign-in и /sign-up
  if (isAuthRoute) {
    const sessionRes = await fetch(
      "https://notehub-api.goit.study/auth/session",
      {
        method: "GET",
        headers: {
          Cookie: request.cookies.toString(),
        },
      }
    );

    const { success } = await sessionRes
      .json()
      .catch(() => ({ success: false }));

    if (success) {
      const url = request.nextUrl.clone();
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
