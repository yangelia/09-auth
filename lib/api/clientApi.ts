import { User } from "@/types/user";
import { nextServer } from "./api";
import { Note } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NewNote {
  title: string;
  content?: string;
  tag: "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
}

/* --- Notes --- */
export const fetchNotes = async (
  query: string,
  page: number,
  tag?: string
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>(`/notes`, {
    params: { search: query, page, perPage: 12, tag },
  });
  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const response = await nextServer.post<Note>(`/notes`, newNote);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
};

/* --- Auth --- */
export type RegisterRequest = { email: string; password: string };
export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = { email: string; password: string };
export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

type CheckSessionResponse = { success: boolean };
export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionResponse>("/auth/session");
  return res.data.success;
};

/* --- Users --- */
export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export type UpdateUserRequest = { username?: string };
export const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};
