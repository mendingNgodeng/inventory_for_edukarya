import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import { toast } from "sonner";

type AnyRow = any;

interface BorrowCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: AnyRow | null;
  onCancel: (
    row: AnyRow,
    payload?: {
      cancel_note?: string;
    }
  ) => Promise<void>;
}

export default function BorrowCancelModal({
  isOpen,
  onClose,
  row,
  onCancel,
}: BorrowCancelModalProps) {
  const [cancelNote, setCancelNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setCancelNote("");
    setLoading(false);
  }, [isOpen, row]);

  const handleCancel = async () => {
    if (!row) return;

    try {
      setLoading(true);

      await onCancel(row, {
        cancel_note: cancelNote.trim() || undefined,
      });

      toast.success("Request peminjaman berhasil dibatalkan");
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Gagal membatalkan request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Batalkan Request Peminjaman"
      size="md"
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

          <Button
            type="button"
            variant="danger"
            onClick={handleCancel}
            isLoading={loading}
          >
            Batalkan Request
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
              <b>Lokasi:</b> {row.assetStock?.location?.name ?? "-"}
            </div>

            <div>
              <b>Qty:</b> {row.quantity}
            </div>

            <div>
              <b>Status:</b> {row.status}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Catatan pembatalan
            </label>

            <textarea
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              rows={3}
              placeholder="Opsional, contoh: barang tidak jadi dipakai"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            Request hanya bisa dibatalkan sebelum disetujui. Setelah status
            menjadi <b>DIPINJAM</b>
          </div>
        </div>
      )}
    </Modal>
  );
}