import React from 'react';

interface AlertProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  open,
  title = "Konfirmasi",
  description = "Apakah Anda yakin?",
  confirmText = "Ya, lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95">
        
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition text-gray-700"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
