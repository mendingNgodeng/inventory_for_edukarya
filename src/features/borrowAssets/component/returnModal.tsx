import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import { toast } from "sonner";
import type { ReturnModalProps, ReturnPayload } from "../Types";
import ImagePicker from "../../../components/ui/image-picker";

export default function ReturnModal({
  isOpen,
  onClose,
  row,
  onReturn,
}: ReturnModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageAfterReturn, setImageAfterReturn] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setImageAfterReturn("");
    setImageError("");
    setLoading(false);
  }, [isOpen, row]);

  const handleReturn = async () => {
    if (!row) return;

    if (!imageAfterReturn) {
      setImageError("Foto pengembalian wajib diisi");
      return;
    }

    if (!imageAfterReturn.startsWith("data:image/")) {
      setImageError("File harus berupa gambar");
      return;
    }

    const payload: ReturnPayload = {
      image_after_return: imageAfterReturn,
    };

    try {
      setLoading(true);

      await onReturn(payload);

      toast.success("Berhasil dikembalikan");
      onClose();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Gagal mengembalikan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Pengembalian"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>

          <Button type="button" isLoading={loading} onClick={handleReturn}>
            Kembalikan
          </Button>
        </div>
      }
    >
      {!row ? (
        <div className="text-sm text-gray-600">Tidak ada data dipilih.</div>
      ) : (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
            <div>
              <b>Asset:</b>{" "}
              {row.assetStock?.asset?.asset_name ?? "-"} (
              {row.assetStock?.asset?.asset_code ?? "-"})
            </div>

            <div>
              <b>User:</b>{" "}
              {row.status === "DIPAKAI"
                ? "Kantor"
                : row.user?.name ?? row.id_user ?? "-"}
            </div>

            <div>
              <b>Qty:</b> {row.quantity}
            </div>

            <div>
              <b>Status:</b> {row.status}
            </div>
          </div>

          <ImagePicker
            label="Foto kondisi asset saat dikembalikan"
            required
            value={imageAfterReturn}
            error={imageError}
            disabled={loading}
            onChange={(base64) => {
              setImageAfterReturn(base64);

              if (base64) {
                setImageError("");
              }
            }}
            onClear={() => {
              setImageAfterReturn("");
              setImageError("");
            }}
          />

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Pastikan barang sudah diterima kembali dan foto menunjukkan kondisi
            asset dengan jelas sebelum menekan <b>Kembalikan</b>.
          </div>
        </div>
      )}
    </Modal>
  );
}