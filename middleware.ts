import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/profile", "/notes"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));

  // Читаем куки корректным способом
  const cookieString = request.cookies.toString();

  // Проверяем сессию
  const session = await fetch("https://notehub-api.goit.study/auth/session", {
    method: "GET",
    headers: {
      cookie: cookieString,
    },
  });

  const data = await session.json().catch(() => ({ success: false }));
  const isAuth = data?.success === true;

  // Неавторизованный пытается на приватный роут → редирект
  if (!isAuth && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Авторизованный пытается на sign-in/up → редирект
  if (isAuth && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
