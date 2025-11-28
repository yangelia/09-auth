import { NextResponse, NextRequest } from "next/server";

const publicRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/profile", "/notes"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  // ЛОГ: показываем, что происходит
  console.log(
    "MIDDLEWARE:",
    JSON.stringify(
      {
        pathname,
        cookie: request.headers.get("cookie"),
        isPublic,
        isPrivate,
      },
      null,
      2
    )
  );

  // Проверяем сессию через NoteHub API
  const session = await fetch("https://notehub-api.goit.study/auth/session", {
    method: "GET",
    credentials: "include",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const data = await session.json().catch(() => ({ success: false }));
  const isAuth = data?.success === true;

  // ЛОГ: статус авторизации
  console.log(
    "SESSION:",
    JSON.stringify(
      {
        success: data.success,
        isAuth,
      },
      null,
      2
    )
  );

  // Если не авторизован, но идёт на приватный route → redirect
  if (!isAuth && isPrivate) {
    console.log("ACTION: redirect → /sign-in");

    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Если авторизован, но идёт на sign-in/sign-up → redirect → /profile
  if (isAuth && isPublic) {
    console.log("ACTION: redirect → /profile");

    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  console.log("ACTION: next()");

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
