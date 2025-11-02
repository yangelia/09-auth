import { api } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// Notes
export const fetchNotes = (params: any) =>
  api.get("/notes", { params }).then((r) => r.data);
export const fetchNoteById = (id: string) =>
  api.get(`/notes/${id}`).then((r) => r.data);
export const createNote = (note: Partial<Note>) =>
  api.post("/notes", note).then((r) => r.data);
export const deleteNote = (id: string) =>
  api.delete(`/notes/${id}`).then((r) => r.data);

// Auth
export const register = (data: { email: string; password: string }) =>
  api.post("/auth/register", data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then((r) => r.data);

export const logout = () => api.post("/auth/logout");

export const checkSession = () => api.get("/auth/session").then((r) => r.data);

// Users
export const getMe = () => api.get("/users/me").then((r) => r.data);
export const updateMe = (data: Partial<User>) =>
  api.patch("/users/me", data).then((r) => r.data);
