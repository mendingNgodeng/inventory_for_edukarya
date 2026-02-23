import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import { toast } from "sonner";
import type { ReturnModalProps, ReturnPayload } from "../Types";

export default function ReturnModal({ isOpen, onClose, row, onReturn }: ReturnModalProps) {
  const [loading, setLoading] = useState(false);

  const handleReturn = async () => {
    if (!row) return;
    const payload: ReturnPayload = { status: "DONE" };

    try {
      setLoading(true);
      await onReturn(payload);
      toast.success("Berhasil dikembalikan");
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || "Gagal mengembalikan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Pengembalian"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
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
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <b>Asset:</b> {row.assetStock?.asset?.asset_name ?? "-"} ({row.assetStock?.asset?.asset_code ?? "-"})
          </div>
          {/* <div>
            <b>User:</b> {row.status === "DIPAKAI" ? "Kantor" : (row.user?.name ?? row.id_user ?? "-")}
          </div> */}
          <div>
            <b>Qty:</b> {row.quantity}
          </div>
             <div className="text-gray-500">
            Pastikan barang sudah baik sebelum menekan <b>Kembalikan</b>.
          </div>
        </div>
      )}
    </Modal>
  );
}