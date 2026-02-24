import { publicClient,privateClient } from "../client";
import { ENDPOINTS } from '../endpoints';
import type { LoginRequest, LoginResponse, LogoutResponse } from "./types";

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await publicClient.post<LoginResponse>(`${ENDPOINTS.AUTH_LOGIN}`, payload);
    return data;
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await privateClient.post<LogoutResponse>(`${ENDPOINTS.AUTH_LOGOUT}`);
    return data;
  },
};