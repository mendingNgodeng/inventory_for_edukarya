// FinishRentalModal.tsx
import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import { toast } from "sonner";
import ImagePicker from "../../../components/ui/image-picker";

import { dataService as rentalCustomerService } from "../../../api/rental_customer/service";
import type { data as RentalCustomerData } from "../../../api/rental_customer/types";

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
  // ✅ foto barang setelah rental (yang wajib)
  const [afterImage, setAfterImage] = useState<string>("");

  const [loading, setLoading] = useState(false);

  // ✅ KTP decrypted via getById
  const [customerDetail, setCustomerDetail] = useState<RentalCustomerData | null>(null);
  const [loadingKtp, setLoadingKtp] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setAfterImage("");
    setLoading(false);
    setCustomerDetail(null);

    const id = rental?.id_rental_customer;
    if (!id) return;

    (async () => {
      try {
        setLoadingKtp(true);
        const detail = await rentalCustomerService.getById(id);
        setCustomerDetail(detail); // pictureKtp sudah decrypt di backend
      } catch {
        setCustomerDetail(null);
      } finally {
        setLoadingKtp(false);
      }
    })();
  }, [isOpen, rental?.id_rental_customer]);

  const ktp = customerDetail?.pictureKtp;

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
              if (!afterImage) {
                toast.error("Foto barang wajib diupload sebelum selesai.");
                return;
              }

              try {
                setLoading(true);
                await onSubmit({ image_after_rental: afterImage });
                toast.success("Rental berhasil diselesaikan");
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
          {/* ✅ detail rental */}
          <div className="p-3 rounded-lg border bg-gray-50 space-y-2">
            <div className="font-semibold text-gray-900">
              {rental.assetStock?.asset?.asset_name ?? "-"} (
              {rental.assetStock?.asset?.asset_code ?? "-"})
            </div>

            <div className="text-sm text-gray-600">
              Customer: {rental.customer?.name ?? "-"} • {rental.customer?.phone ?? "-"}
            </div>

            {/* ✅ Foto KTP dari getById (decrypt backend) */}
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

          {/* ✅ Foto barang after rental (WAJIB) */}
          <div>
            <ImagePicker
              label="Upload Foto Barang Setelah Rental (Wajib)"
              value={afterImage}
              required
              onChange={(b64) => setAfterImage(b64)}
              onClear={() => setAfterImage("")}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}