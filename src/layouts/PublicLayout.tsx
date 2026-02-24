import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

export default function PublicLayout() {
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* Navbar versi public: onToggleSidebar dummy atau bikin prop optional */}
      <Navbar onToggleSidebar={() => {}} isSidebarOpen={false} />

      <main className="min-h-screen bg-slate-50">
        <Outlet />
      </main>
    </>
  );
}