import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "http://localhost:3000";

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
    localStorage.removeItem("admin");

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
// import axios from "axios";
// import { toast } from "sonner";

// const BASE_URL = "http://localhost:3000";

// export const publicClient = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// export const privateClient = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // inject token otomatis (private)
// privateClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // handler umum (tanpa logout)
// const handleCommonError = (err: any) => {
//   const status = err?.response?.status;
//   const data = err?.response?.data;

//   if (status === 429) {
//     const retryAfter = data?.retryAfter ?? 0;
//     toast.error(`Terlalu banyak request. Coba lagi dalam ${retryAfter} detik.`);
//   } else if (status >= 500) {
//     toast.error("Terjadi kesalahan pada server.");
//   }

//   return Promise.reject(err);
// };

// // PUBLIC: jangan logout kalau 401
// publicClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err?.response?.status;

//     // contoh: login salah -> 401
//     if (status === 401) {
//       toast.error("Username / password salah.");
//       return Promise.reject(err);
//     }

//     return handleCommonError(err);
//   }
// );

// // PRIVATE: logout hanya kalau 401 dan request memang butuh token
// privateClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const status = err?.response?.status;

//     if (status === 401) {
//       // optional: kalau token memang gak ada, jangan bilang "expired"
//       const token = localStorage.getItem("token");
//       if (!token) {
//         // bisa redirect ke halaman login kalau mau
//         toast.error("Silakan login terlebih dahulu.");
//         window.location.href = "/login"; // sesuaikan route kamu
//         return Promise.reject(err);
//       }

//       localStorage.removeItem("token");
//       localStorage.removeItem("admin");
//       toast.error("Session expired. Silakan login kembali.");
//       window.location.href = "/login"; // jangan /dashboard kalau itu bukan login page
//       return Promise.reject(err);
//     }

//     return handleCommonError(err);
//   }
// );