import { apiClient } from "../client";
import type { LoginRequest, LoginResponse, LogoutResponse } from "./types";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/login", payload);
    return data;
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await apiClient.post<LogoutResponse>("/logout");
    return data;
  },
};