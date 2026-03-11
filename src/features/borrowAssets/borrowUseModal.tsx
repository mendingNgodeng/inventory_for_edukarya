import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { useData as useUser } from "../../api/user/hooks";
import { toast } from "sonner";
import SearchSelect from "../../components/ui/search-select";

import type {
  BorrowRow,
  StockItem,
  CreateBorrowPayload,
  BorrowFormData,
} from "./Types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stock: StockItem | null;
  borrowedData: BorrowRow[];
  createBorrow: (payload: CreateBorrowPayload) => Promise<void>;
  afterSuccess?: () => Promise<void> | void;
}

// ADDED: mode pinjam untuk admin
type BorrowMode = "SELF" | "OTHER";

const BorrowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  stock,
  borrowedData,
  createBorrow,
  afterSuccess,
}) => {
  const { Data: user } = useUser();

  // CHANGED:
  // dulu pakai localStorage "admin"
  // sekarang disesuaikan dengan hooks auth kamu yang menyimpan user di key "user"
  const currentUserRaw = localStorage.getItem("user");
  const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;

  // ADDED:
  // cek role user login
  const isAdmin = currentUser?.role === "ADMIN";

  // ADDED:
  // admin punya 2 mode:
  // SELF  = pinjam untuk dirinya sendiri
  // OTHER = pinjamkan ke user lain
  const [borrowMode, setBorrowMode] = useState<BorrowMode>("SELF");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BorrowFormData>();

  // ADDED:
  // dipakai buat info user yang sedang dipilih di select
  const selectedBorrowerId = watch("borrower_id");

  const userOpt = (user ?? []).map((u: any) => ({
    value: u.id_user,
    label: `${u.name}${u.jabatan ? ` - ${u.jabatan}` : ""}`,
  }));

  useEffect(() => {
    if (!isOpen) return;

    // ADDED:
    // setiap modal dibuka, reset mode ke SELF
    setBorrowMode("SELF");

    reset({
      borrower_id: "" as any,
      quantity: 1,
    });
  }, [isOpen, stock, reset]);

  const related = useMemo(() => {
    if (!stock) return [];
    return borrowedData.filter((x) => x.id_asset_stock === stock.id_asset_stock);
  }, [borrowedData, stock]);

  const active = useMemo(() => {
    return related.filter((x) => x.status !== "DIKEMBALIKAN");
  }, [related]);

  const borrowedByEmployees = useMemo(() => {
    return active.filter(
      (x) => x.status === "DIPINJAM" || x.status === "TERLAMBAT"
    );
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

    if (!data.quantity || data.quantity <= 0) {
      setError("quantity", {
        type: "manual",
        message: "Quantity harus lebih dari 0",
      });
      return;
    }

    if (data.quantity > stock.quantity) {
      setError("quantity", {
        type: "manual",
        message: "Quantity melebihi stock tersedia",
      });
      return;
    }

    // ADDED:
    // hanya admin mode OTHER yang wajib memilih karyawan
    if (isAdmin && borrowMode === "OTHER" && !data.borrower_id) {
      setError("borrower_id", {
        type: "manual",
        message: "User wajib dipilih",
      });
      return;
    }

    // CHANGED:
    // payload borrower_id hanya dikirim kalau:
    // - user admin
    // - mode OTHER
    // - borrower_id dipilih
    //
    // kalau SELF / user biasa:
    // borrower_id tidak dikirim
    // backend akan fallback ke actor_id dari token login
    const payload: CreateBorrowPayload = {
      id_asset_stock: stock.id_asset_stock,
      quantity: data.quantity,
      ...(isAdmin && borrowMode === "OTHER" && data.borrower_id
        ? { borrower_id: Number(data.borrower_id) }
        : {}),
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
          {/* info stock */}
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="font-semibold text-gray-900">
              {stock?.asset?.asset_name} ({stock?.asset?.asset_code})
            </div>
            <div className="text-sm text-gray-600">
              Lokasi: {stock?.location?.name} • Stock tersedia:{" "}
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

          {/* ADDED:
              hanya admin yang bisa pilih mode pinjam
          */}
          {isAdmin && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Mode peminjaman
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={borrowMode === "SELF" ? "primary" : "secondary"}
                  onClick={() => setBorrowMode("SELF")}
                >
                  Pinjam untuk saya
                </Button>

                <Button
                  type="button"
                  variant={borrowMode === "OTHER" ? "primary" : "secondary"}
                  onClick={() => setBorrowMode("OTHER")}
                >
                  Pinjamkan ke karyawan
                </Button>
              </div>
            </div>
          )}

          {/* ADDED:
              user biasa tidak perlu pilih siapa yang pinjam
          */}
          {!isAdmin && (
            <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-700">
              Asset akan dipinjam untuk akun yang sedang login.
            </div>
          )}

          {/* form utama */}
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

            {/* CHANGED:
                select user hanya tampil kalau:
                - admin
                - mode OTHER
            */}
            {isAdmin && borrowMode === "OTHER" && (
              <Controller
                name="borrower_id"
                control={control}
                rules={{ required: "User (karyawan) wajib dipilih" }}
                render={({ field }) => (
                  <SearchSelect
                    label="User (karyawan)"
                    value={field.value ?? null}
                    // CHANGED:
                    // paksa hasil select jadi number
                    onChange={(val) => field.onChange(val ? Number(val) : "")}
                    options={userOpt}
                    error={errors.borrower_id?.message as any}
                  />
                )}
              />
            )}
          </div>

          {/* ADDED:
              info visual siapa peminjamnya
          */}
          {isAdmin && borrowMode === "SELF" && (
            <div className="text-sm text-gray-600">
              Peminjaman ini akan dicatat atas nama:
              <span className="font-semibold text-gray-900">
                {" "}
                {currentUser?.name ?? "-"}
              </span>
            </div>
          )}

          {isAdmin && borrowMode === "OTHER" && selectedBorrowerId && (
            <div className="text-sm text-gray-600">
              Peminjaman ini akan dicatat untuk user yang dipilih.
            </div>
          )}

          {/* list aktif */}
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
                          {r.status === "DIPAKAI" ? "Kantor" : r.user?.name ?? "-"}
                        </td>
                        <td className="px-4 py-2">
                          {r.status === "DIPAKAI" ? "-" : r.user?.jabatan ?? "-"}
                        </td>
                        <td className="px-4 py-2">
                          {r.status === "DIPAKAI" ? "-" : r.user?.no_hp ?? "-"}
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