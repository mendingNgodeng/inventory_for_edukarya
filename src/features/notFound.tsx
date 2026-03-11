import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="text-center max-w-md">
        
        <h1 className="text-7xl font-bold text-blue-600">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Kamu siapa? Dimana rumahnya?
        </h2>

        <p className="mt-2 text-gray-500">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Kembali ke Dashboard
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>
        </div>

      </div>
    </div>
  );
}