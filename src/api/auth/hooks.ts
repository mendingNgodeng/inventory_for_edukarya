import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "./service";
import type { LoginRequest } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(payload);

      // simpan token
      localStorage.setItem(TOKEN_KEY, response.token);

      // jangan simpan password
      const { password, ...safeUSER } = response.user;
      localStorage.setItem(USER_KEY, JSON.stringify(safeUSER));

      navigate("/dashboard");

      return response;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Login gagal. Periksa username dan password.";

      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore error logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      navigate("/login");
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEY);
  };

  const getUSER = () => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  };

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated,
    getUSER,
  };
};