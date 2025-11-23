import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosResponse } from "axios";

function cookieHeaders() {
  return { Cookie: cookies().toString() };
}

function cookieHeadersFromString(cookieHeader: string) {
  return { Cookie: cookieHeader };
}

// ❗ Теперь возвращаем полный AxiosResponse и можем работать как из server-компонента, так и из middleware
export async function checkSessionServer(
  cookieHeader?: string
): Promise<AxiosResponse<{ success: boolean }>> {
  const headers = cookieHeader
    ? cookieHeadersFromString(cookieHeader)
    : cookieHeaders();

  return nextServer.get<{ success: boolean }>("/auth/session", {
    headers,
  });
}

export async function getMeServer(): Promise<User> {
  const { data } = await nextServer.get<User>("/users/me", {
    headers: cookieHeaders(),
  });
  return data;
}

export async function fetchNotesServer(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const { data } = await nextServer.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      headers: cookieHeaders(),
    }
  );
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: cookieHeaders(),
  });
  return data;
}
