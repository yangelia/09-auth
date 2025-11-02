import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

function cookieHeaders() {
  return { Cookie: cookies().toString() };
}

export async function checkSessionServer(): Promise<User | null> {
  try {
    const { data } = await api.get<User | null>("/auth/session", {
      headers: cookieHeaders(),
    });
    // API возвращает 200 без тела, если не авторизован
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getMeServer(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: cookieHeaders(),
  });
  return data;
}

export async function fetchNotesServer(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}) {
  const { data } = await api.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      headers: cookieHeaders(),
    }
  );
  return data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: cookieHeaders(),
  });
  return data;
}
