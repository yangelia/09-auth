import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosResponse } from "axios";

function cookieHeaders() {
  return { Cookie: cookies().toString() };
}

export async function checkSessionServer(): Promise<
  AxiosResponse<{ success: boolean }>
> {
  return nextServer.get("/auth/session", {
    headers: cookieHeaders(),
  });
}

export async function getMeServer(): Promise<User> {
  const res = await nextServer.get<User>("/users/me", {
    headers: cookieHeaders(),
  });
  return res.data;
}

export async function fetchNotesServer(params: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> {
  const res = await nextServer.get<{ notes: Note[]; totalPages: number }>(
    "/notes",
    {
      params,
      headers: cookieHeaders(),
    }
  );
  return res.data;
}

export async function fetchNoteByIdServer(id: string): Promise<Note> {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: cookieHeaders(),
  });
  return res.data;
}
