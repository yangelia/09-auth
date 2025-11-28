import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Отправляем запрос к NoteHub API
    const apiRes = await api.post("auth/login", body);

    // Извлекаем cookie
    const setCookie = apiRes.headers["set-cookie"];

    // Формируем ответ
    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    // Передаём все куки корректно (append делает это весомо лучше чем set)
    if (setCookie && Array.isArray(setCookie)) {
      for (const cookie of setCookie) {
        response.headers.append("Set-Cookie", cookie);
      }
    } else if (typeof setCookie === "string") {
      response.headers.append("Set-Cookie", setCookie);
    }

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
