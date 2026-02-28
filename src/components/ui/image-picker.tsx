// input file and foto with preview included with base64 
import { useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";

type Props = {
  label?: string;
  value?: string;
  error?: string;
  required?: boolean;
  onChange: (base64: string) => void;
  onClear?: () => void;
  disabled?: boolean;
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ImagePicker({
  label = "Foto or upload foto",
  value,
  error,
  required,
  onChange,
  onClear,
  disabled,
}: Props) {
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const webcamRef = useRef<Webcam>(null);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  // ✅ constraints aman (jangan terlalu keras biar ga error di linux)
  const videoConstraints = useMemo(
    () => ({
      width: 1280,
      height: 720,
      facingMode: { ideal: "environment" }, // fallback otomatis
    }),
    []
  );

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    onChange(base64);
  };

  const handleOpenCamera = () => {
    setCameraError("");
    setOpenCamera(true);
  };

  const handleTakePhoto = () => {
    setCameraError("");
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setCameraError(
        "Gagal mengambil foto. Pastikan kamera aktif dan browser mengizinkan akses kamera."
      );
      return;
    }
    onChange(imageSrc);
    setOpenCamera(false);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Upload file (semua platform) */}
        <label
          className={[
            "px-3 py-2 border rounded-lg text-sm cursor-pointer text-gray-700",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50",
          ].join(" ")}
        >
          Pilih File
          <input
            disabled={disabled}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>

        {/* Mobile capture: paling reliable di HP */}
        {isMobile && (
          <label
            className={[
              "px-3 py-2 border rounded-lg text-sm cursor-pointer text-gray-700",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50",
            ].join(" ")}
          >
            Ambil Foto (HP)
            <input
              disabled={disabled}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        )}

        {/* Desktop webcam */}
        {!isMobile && (
          <button
            type="button"
            disabled={disabled}
            onClick={handleOpenCamera}
            className={[
              "px-3 py-2 border rounded-lg text-sm text-gray-700",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50",
            ].join(" ")}
          >
            Buka Kamera (Desktop)
          </button>
        )}

        {/* Clear */}
        {value && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              onClear?.();
              onChange("");
            }}
            className="px-3 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Webcam area */}
      {openCamera && (
        <div className="border rounded-xl p-3 space-y-2 bg-white">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full rounded-lg border bg-black"
            onUserMedia={() => setCameraError("")}
            onUserMediaError={(e) =>
              setCameraError(
                (e as any)?.message ||
                  "Kamera tidak bisa dibuka. Coba browser lain / cek permission."
              )
            }
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenCamera(false)}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 text-gray-700"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleTakePhoto}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Ambil Foto
            </button>
          </div>

          {cameraError && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {value ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Preview</div>
          <img
            src={value}
            alt="Preview"
            className="w-full max-h-60 object-contain rounded-lg border bg-white"
          />
        </div>
      ) : null}

      {/* Error */}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}