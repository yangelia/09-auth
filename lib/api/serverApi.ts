import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

function cookieHeaders() {
  return { Cookie: cookies().toString() };
}

export async function checkSessionServer(): Promise<boolean> {
  try {
    const { data } = await nextServer.get<{ success: boolean }>(
      "/auth/session",
      {
        headers: cookieHeaders(),
      }
    );
    return data.success;
  } catch {
    return false;
  }
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
