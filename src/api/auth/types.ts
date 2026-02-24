export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface Admin {
  id_admin: number;
  username: string;
  password: string; // dari backend memang ikut terkirim
  role: "ADMIN" | string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  admin: Admin;
  token: string;
}

export interface LogoutResponse {
  message: string;
}