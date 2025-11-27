import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + "/");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value || null;

  const isAuthRoute = authRoutes.some((route) =>
    matchesPrefix(pathname, route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    matchesPrefix(pathname, route)
  );

  // ❌ Нет accessToken → не пускаем на приватные маршруты
  if (!accessToken && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";

    // Можно сохранить, куда хотели пойти
    url.searchParams.set("next", pathname);

    return NextResponse.redirect(url);
  }

  // ✅ Есть accessToken → не пускаем на /sign-in и /sign-up
  if (accessToken && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // Для всего остального — просто пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
