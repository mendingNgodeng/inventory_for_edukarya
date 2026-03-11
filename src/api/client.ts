import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_URL_API;

export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const privateClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ===============================
   PRIVATE REQUEST (Inject Token)
================================= */
privateClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===============================
   GLOBAL ERROR HANDLER
================================= */

const handleResponseError = (err: any) => {
  const status = err?.response?.status;
  const data = err?.response?.data;

  // RATE LIMIT
  if (status === 429) {
    const retryAfter = data?.retryAfter ?? 0;

    toast.error(
      `Terlalu banyak request. Coba lagi dalam ${retryAfter} detik.`
    );

    return Promise.reject(err);
  }

  // UNAUTHORIZED (private only normally)
  if (status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.error("Session expired. Silakan login kembali.");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

    return Promise.reject(err);
  }

  // GENERIC ERROR (optional)
  if (status >= 500) {
    toast.error("Terjadi kesalahan pada server.");
  }

  return Promise.reject(err);
};

/* ===============================
   APPLY INTERCEPTOR
================================= */

publicClient.interceptors.response.use(
  (res) => res,
  handleResponseError
);

privateClient.interceptors.response.use(
  (res) => res,
  handleResponseError
);
