import { api } from "./client";
import type { AuthUser, LoginRequest, LoginResponse } from "../types/auth";

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", body);
  return data;
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}