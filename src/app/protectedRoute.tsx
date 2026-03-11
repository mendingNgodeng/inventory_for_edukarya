import { Navigate, Outlet,useLocation  } from "react-router-dom";

const USER_KEY = "user";
const TOKEN_KEY = "token";
export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
const rawUser = localStorage.getItem(USER_KEY);
  const user = rawUser ? JSON.parse(rawUser) : null;


  if (!user) {
    localStorage.removeItem(TOKEN_KEY);
    return <Navigate to="/login" replace />;
  }

  // route yang boleh diakses oleh KARYAWAN
  const karyawanAllowedPaths = ["/dashboard", "/borrow-assets"];


  if (
    user.role === "KARYAWAN" &&
    !karyawanAllowedPaths.includes(location.pathname)
  ) {
    return <Navigate to="/borrow-assets" replace />;
  }
  return <Outlet />;
}