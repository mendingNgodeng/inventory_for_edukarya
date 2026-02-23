import React, { useEffect ,useMemo} from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { toast } from "sonner";

import type { StockItem, BorrowRow, UseFormData, CreateUsedPayload } from "./Types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem | null;

  borrowedData: BorrowRow[]; // buat info ringkas jika mau
  createUsed: (payload: CreateUsedPayload) => Promise<void>;

  afterSuccess?: () => Promise<void> | void;
}

const UseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  stock,
  borrowedData,
  createUsed,
  afterSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UseFormData>();

  useEffect(() => {
    if (!isOpen) return;
    reset({ quantity: 1 });
  }, [isOpen, stock, reset]);

   const related = useMemo(() => {
      if (!stock) return [];
      return borrowedData.filter((x) => x.id_asset_stock === stock.id_asset_stock);
    }, [borrowedData, stock]);
  
    const active = useMemo(() => {
      return related.filter((x) => x.status !== "DIKEMBALIKAN") ;
    }, [related]);

  const onSubmitForm = async (data: UseFormData) => {
    if (!stock) return;

    if (!data.quantity || data.quantity <= 0) {
      setError("quantity", { type: "manual", message: "Quantity harus lebih dari 0" });
      return;
    }
    if (data.quantity > stock.quantity) {
      setError("quantity", { type: "manual", message: "Quantity melebihi stock tersedia" });
      return;
    }

    const payload: CreateUsedPayload = {
      id_asset_stock: stock.id_asset_stock,
      quantity: data.quantity,
      id_user: null, // ✅ DIPAKAI
    };

    try {
      await createUsed(payload);
      toast.success("Asset berhasil dipakai");
      await afterSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Gagal memproses.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pakai Asset (Kantor)"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="UseForm" isLoading={isSubmitting}>
            Pakai
          </Button>
        </div>
      }
    >
      {!stock ? (
        <div className="text-sm text-gray-600">Tidak ada stock dipilih.</div>
      ) : (
        <form id="UseForm" onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="font-semibold text-gray-900">
              {stock?.asset?.asset_name ?? "-"} ({stock?.asset?.asset_code ?? "-"})
            </div>
            <div className="text-sm text-gray-600">
              Lokasi: {stock?.location?.name ?? "-"} • Stock tersedia:{" "}
              <span className="font-semibold">{stock?.quantity ?? 0}</span>
            </div>
          </div>

          <Input
            label="Quantity"
            type="number"
            {...register("quantity", { required: "Quantity wajib diisi", valueAsNumber: true })}
            error={errors.quantity?.message}
          />

          {/* optional: kamu bisa tampilkan ringkas total sedang DIPAKAI untuk stock ini */}
          {/* biar simple, skip dulu */}

             <div className="mt-2 space-y-3">
            <div className="font-semibold text-gray-900">Sedang dipinjam / dipakai</div>

            {active.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada yang meminjam / memakai asset ini.</div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-700">
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">User</th>
                      <th className="px-4 py-2 text-left">Jabatan</th>
                      <th className="px-4 py-2 text-left">Phone</th>
                      <th className="px-4 py-2 text-left">Qty</th>
                      <th className="px-4 py-2 text-left">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {active.map((r) => (
                      <tr key={r.id_asset_borrowed} className="border-t">
                        <td className="px-4 py-2 font-medium">{r.status}</td>
                        <td className="px-4 py-2">{r.status === "DIPAKAI" ? "Kantor" : (r.user?.name ?? "-")}</td>
                        <td className="px-4 py-2">{r.status === "DIPAKAI" ? "-" : (r.user?.jabatan ?? "-")}</td>
                        <td className="px-4 py-2">{r.status === "DIPAKAI" ? "-" : (r.user?.no_hp ?? "-")}</td>
                        <td className="px-4 py-2">{r.quantity}</td>
                        <td className="px-4 py-2">{new Date(r.borrowed_date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UseModal;