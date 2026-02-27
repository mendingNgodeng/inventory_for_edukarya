import axios from 'axios';
// const BASE_URL = "http://localhost:3000";
const BASE_URL = "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const privateClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// inject token otomatis (private)
privateClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auto redirect kalau token invalid/expired
privateClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      window.location.href = "/dashboard";
    }
    return Promise.reject(err);
  }
);