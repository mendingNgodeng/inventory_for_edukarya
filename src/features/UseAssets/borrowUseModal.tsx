import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Select from "../../components/ui/select";
import { useData as useUser } from "../../api/user/hooks";
import { toast } from "sonner";

type BorrowRow = {
  id_asset_borrowed: number;
  id_asset_stock: number;
  id_user: any;
  quantity: number;
  borrowed_date: string;
  returned_date: string | null;
  status: string; // DIPINJAM | DIPAKAI | DIKEMBALIKAN | TERLAMBAT
  assetStock: {
    asset: { asset_name: string; asset_code: string };
    location: { name: string };
  };
  user:{
    name:string,
    jabatan:string,
    no_hp:string
  }
};

type StockItem = {
  id_asset_stock: number;
  quantity: number;
  status: string;
  condition: string;
  asset: { asset_name: string; asset_code: string };
  location: { name: string };
};

type Payload = {
  id_asset_stock: number;
  id_user: number;
  quantity: number;
};

type BorrowFormData = {
  id_user: number;
  quantity: number;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem | null;

  borrowedData: BorrowRow[];
  createBorrow: (payload: Payload) => Promise<void>;

  afterSuccess?: () => Promise<void> | void;
}

const BorrowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  stock,
  borrowedData,
  createBorrow,
  afterSuccess,
}) => {
  const { Data: user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BorrowFormData>();

  // reset saat modal dibuka / ganti stock
  useEffect(() => {
    if (!isOpen) return;
    reset({
      id_user: "" as any,
      quantity: 1,
    });
  }, [isOpen, stock, reset]);

  // transaksi terkait untuk stock ini
  const related = useMemo(() => {
    if (!stock) return [];
    return borrowedData.filter((x) => x.id_asset_stock === stock.id_asset_stock);
  }, [borrowedData, stock]);

  // yang masih aktif (belum dikembalikan) 
  const active = useMemo(() => {
    return related.filter((x) => x.status !== "DIKEMBALIKAN");
  }, [related]);

  const borrowedByEmployees = useMemo(() => {
    return active.filter((x) => x.status === "DIPINJAM" || x.status === "TERLAMBAT");
  }, [active]);

  const usedByOffice = useMemo(() => {
    return active.filter((x) => x.status === "DIPAKAI");
  }, [active]);

  const totalBorrowedQty = useMemo(() => {
    return borrowedByEmployees.reduce((sum, r) => sum + (r.quantity || 0), 0);
  }, [borrowedByEmployees]);

  const totalUsedQty = useMemo(() => {
    return usedByOffice.reduce((sum, r) => sum + (r.quantity || 0), 0);
  }, [usedByOffice]);

  const onSubmitForm = async (data: BorrowFormData) => {
    if (!stock) return;

    // validasi quantity terhadap stock (dynamic)
    if (!data.quantity || data.quantity <= 0) {
      setError("quantity", { type: "manual", message: "Quantity harus lebih dari 0" });
      return;
    }
    if (data.quantity > stock.quantity) {
      setError("quantity", {
        type: "manual",
        message: "Quantity melebihi stock tersedia",
      });
      return;
    }

    // validasi user
    if (!data.id_user) {
      setError("id_user", { type: "manual", message: "User wajib dipilih" });
      return;
    }

    const payload: Payload = {
      id_asset_stock: stock.id_asset_stock,
      id_user: data.id_user,
      quantity: data.quantity,
    };

    try {
      await createBorrow(payload);
      toast.success("Asset berhasil dipinjam");

      await afterSuccess?.();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Gagal memproses.";
      toast.error(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pinjam Asset"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="BorrowForm" isLoading={isSubmitting}>
            Pinjam
          </Button>
        </div>
      }
    >
      {!stock ? (
        <div className="text-sm text-gray-600">Tidak ada stock dipilih.</div>
      ) : (
        <form
          id="BorrowForm"
          onSubmit={handleSubmit(onSubmitForm)}
          className="space-y-4"
        >
          {/* Info stock */}
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="font-semibold text-gray-900">
              {stock.asset.asset_name} ({stock.asset.asset_code})
            </div>
            <div className="text-sm text-gray-600">
              Lokasi: {stock.location.name} • Stock tersedia:{" "}
              <span className="font-semibold">{stock.quantity}</span>
            </div>

            <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">
                Dipinjam karyawan: <b>{totalBorrowedQty}</b>
              </span>
              <span className="px-2 py-1 rounded bg-orange-50 text-orange-700">
                Dipakai kantor: <b>{totalUsedQty}</b>
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              {...register("quantity", {
                required: "Quantity wajib diisi",
                valueAsNumber: true,
              })}
              error={errors.quantity?.message}
            />

            <Select
              label="Karyawan"
              options={(user ?? []).map((u: any) => ({
                value: u.id_user,
                label: u.name+" - "+u.jabatan
              }))}
              registration={register("id_user", {
                required: "User wajib dipilih",
                valueAsNumber: true,
              })}
              error={errors.id_user?.message}
            />
          </div>

          {/* List aktif */}
          <div className="mt-2 space-y-3">
            <div className="font-semibold text-gray-900">
              Sedang dipinjam / dipakai
            </div>

            {active.length === 0 ? (
              <div className="text-sm text-gray-600">
                Belum ada yang meminjam / memakai asset ini.
              </div>
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
                        <td className="px-4 py-2">
                          {r.status === "DIPAKAI" ? "Kantor" : (r.user.name ?? "-")}
                        </td>
                          <td className="px-4 py-2">
                          {r.status === "DIPAKAI" ? "Kantor" : (r.user.jabatan ?? "-")}
                        </td>
                          <td className="px-4 py-2">
                          {r.status === "DIPAKAI" ? "Kantor" : (r.user.no_hp ?? "-")}
                        </td>
                        <td className="px-4 py-2">{r.quantity}</td>
                        <td className="px-4 py-2">
                          {new Date(r.borrowed_date).toLocaleString()}
                        </td>
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

export default BorrowModal;