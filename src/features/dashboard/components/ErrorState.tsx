import { AlertCircle, RefreshCw } from "lucide-react";
import DashboardLayout from "../../../layouts/Dashboardlayout";

interface Props {
  error: string | null;
  onRetry: () => void;
}

const ErrorState: React.FC<Props> = ({ error, onRetry }) => {
  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Ada masalah
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Gagal memuat data dashboard."}
          </p>
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Coba Lagi
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ErrorState;
