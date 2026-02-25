// FinishRentalModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import { toast } from "sonner";

import { dataService as rentalCustomerService } from "../../../api/rental_customer/service"; 
import type { data as RentalCustomerData } from "../../../api/rental_customer/types";

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function FinishRentalModal({
  isOpen,
  onClose,
  rental,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  rental: any | null;
  onSubmit: (payload: { image_after_rental: string }) => Promise<void>;
}) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ state untuk KTP decrypted
  const [customerDetail, setCustomerDetail] = useState<RentalCustomerData | null>(null);
  const [loadingKtp, setLoadingKtp] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setImage("");
    setLoading(false);
    setCustomerDetail(null);

    const id = rental?.id_rental_customer; // pastikan field ini ada di rental
    if (!id) return;

    (async () => {
      try {
        setLoadingKtp(true);
        const detail = await rentalCustomerService.getById(id);
        setCustomerDetail(detail); // ✅ sudah decrypt dari backend
      } catch (e) {
        setCustomerDetail(null);
      } finally {
        setLoadingKtp(false);
      }
    })();
  }, [isOpen, rental?.id_rental_customer]);

  const ktp = customerDetail?.pictureKtp; // ✅ decrypted dataURL

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selesaikan Rental"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="button"
            isLoading={loading}
            onClick={async () => {
              if (!image) {
                toast.error("Foto barang wajib diupload sebelum selesai.");
                return;
              }
              try {
                setLoading(true);
                await onSubmit({ image_after_rental: image });
                onClose();
              } catch (e: any) {
                toast.error(e?.message || "Gagal menyelesaikan rental");
              } finally {
                setLoading(false);
              }
            }}
          >
            Selesaikan
          </Button>
        </div>
      }
    >
      {!rental ? (
        <div className="text-sm text-gray-600">Tidak ada data rental.</div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 rounded-lg border bg-gray-50 space-y-2">
            <div className="font-semibold text-gray-900">
              {rental.assetStock?.asset?.asset_name ?? "-"} (
              {rental.assetStock?.asset?.asset_code ?? "-"})
            </div>
            <div className="text-sm text-gray-600">
              Customer: {rental.customer?.name ?? "-"} • {rental.customer?.phone ?? "-"}
            </div>

            {/* ✅ Foto KTP dari getById */}
            <div>
              <div className="text-xs text-gray-500 mb-1">Foto KTP</div>
              {loadingKtp ? (
                <div className="text-sm text-gray-500">Memuat KTP...</div>
              ) : ktp ? (
                <img
                  src={ktp}
                  alt="KTP"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-40 rounded-lg border bg-white flex items-center justify-center text-sm text-gray-500">
                  KTP kosong
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Upload Foto Barang (wajib)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setImage("");
                  return;
                }
                const base64 = await fileToBase64(file);
                setImage(base64);
              }}
            />
            {image && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Preview</div>
                <img
                  src={image}
                  alt="after rental"
                  className="w-full max-h-60 object-contain rounded border"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}