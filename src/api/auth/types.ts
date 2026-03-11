export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface user {
  id_user: number;
  username: string;
  name:string;
  password: string; // dari backend memang ikut terkirim
  role: "ADMIN" | string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: user;
  token: string;
}

export interface LogoutResponse {
  message: string;
}