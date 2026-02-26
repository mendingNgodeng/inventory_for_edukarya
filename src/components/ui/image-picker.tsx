// src/components/ui/KtpInput.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label?: string;
  value?: string; // base64
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
  label = "Foto KTP",
  value,
  error,
  required,
  onChange,
  onClear,
  disabled,
}: Props) {
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string>("");
  const [loadingCam, setLoadingCam] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isMobile = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    // cleanup on unmount
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError("");
    setLoadingCam(true);
    try {
      // gunakan facingMode "environment" kalau ada (mobile), kalau tidak ya default
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setOpenCamera(true);
    } catch (e: any) {
      setCameraError(
        e?.message ||
          "Kamera tidak tersedia / tidak diizinkan. Silakan upload file."
      );
      setOpenCamera(false);
      stopCamera();
    } finally {
      setLoadingCam(false);
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, w, h);

    const base64 = canvas.toDataURL("image/jpeg", 0.9);
    onChange(base64);

    stopCamera();
    setOpenCamera(false);
  };

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    onChange(base64);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required ? <span className="text-red-500 ml-1">*</span> : null}
        </label>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Upload file (all platforms) */}
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

        {/* Mobile: capture camera via input (best UX for phones) */}
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

        {/* Desktop: use WebRTC */}
        {!isMobile && (
          <button
            type="button"
            disabled={disabled || loadingCam}
            onClick={startCamera}
            className={[
              "px-3 py-2 border rounded-lg text-sm text-gray-700",
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50",
            ].join(" ")}
          >
            {loadingCam ? "Membuka Kamera..." : "Buka Kamera (Desktop)"}
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

      {/* Camera area (desktop WebRTC) */}
      {openCamera && (
        <div className="border rounded-xl p-3 space-y-2 bg-white">
          <video ref={videoRef} className="w-full rounded-lg border" />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setOpenCamera(false);
              }}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 text-gray-700"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={takePhoto}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 text-gray-700"
            >
              Ambil Foto
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Camera error */}
      {cameraError && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
          {cameraError}
        </div>
      )}

      {/* Preview */}
      {value ? (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Preview</div>
          <img
            src={value}
            alt="Preview KTP"
            className="w-full max-h-60 object-contain rounded-lg border bg-white"
          />
        </div>
      ) : null}

      {/* Error */}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}