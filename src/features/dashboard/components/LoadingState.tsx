import DashboardLayout from "../../../layouts/Dashboardlayout";

const LoadingState = () => {
  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
          <p className="text-sm text-gray-400 mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoadingState;
