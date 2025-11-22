import { User } from "@/types/user";
import { nextServer } from "./api";
import { Note, CreateNoteRequest } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/* --- Notes --- */
export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number = 12,
  tag?: string
): Promise<FetchNotesResponse> => {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage, tag },
  });
  return response.data;
};

export const createNote = async (newNote: CreateNoteRequest): Promise<Note> => {
  const response = await nextServer.post<Note>("/notes", newNote);
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

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post("/auth/register", data);

  // NoteHub API возвращает: { user: {...}, message: "Registration successful" }
  if (!res.data || !res.data.user) {
    throw new Error("Invalid response from server");
  }

  return res.data.user as User;
};

export type LoginRequest = { email: string; password: string };

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post("/auth/login", data);

  if (!res.data || !res.data.user) {
    throw new Error("Invalid response from server");
  }

  return res.data.user as User;
};

type CheckSessionResponse = { success: boolean };

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionResponse>("/auth/session");
  return res.data.success;
};

/* --- Users --- */
export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export type UpdateUserRequest = { username?: string };

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};
