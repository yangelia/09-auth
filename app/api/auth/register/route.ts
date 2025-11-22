import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("auth/register", body);

    const setCookie = apiRes.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      const response = NextResponse.json(apiRes.data, {
        status: apiRes.status,
      });

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: parsed.Path || "/",
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
        };

        if (parsed.accessToken) {
          response.cookies.set("accessToken", parsed.accessToken, options);
        }
        if (parsed.refreshToken) {
          response.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }

      return response;
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        { status: error.response?.status ?? 500 }
      );
    }

    const err = error as Error;
    logErrorResponse({ message: err.message });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
