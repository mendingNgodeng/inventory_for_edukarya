import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // [TAMBAHAN] react-hook-form untuk handle form state
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import { toast } from "sonner";

export default function PayRentalModal({
  isOpen,
  onClose,
  rental,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  rental: any | null;
  onSubmit: (payload: { payment_amount: number; payment_note?: string }) => Promise<void>;
}) {

  // [PERUBAHAN]
  // sebelumnya pakai useState untuk paymentAmount dan paymentNote
  // sekarang diganti dengan react-hook-form supaya konsisten dengan modal rental lain
  const {
    register,
    // handleSubmit,
    reset,
    // setError,
    watch,
    formState: {
         errors, 
        // isSubmitting 
    },
  } = useForm<{
    payment_amount: number;
    payment_note?: string;
  }>({
    defaultValues: {
      payment_amount: 0,
      payment_note: "",
    },
  });

  const [loading, setLoading] = useState(false); // masih dipakai untuk tombol loading

  // [TAMBAHAN]
  // setiap modal dibuka atau rental berubah, form di-reset
  // supaya nilai lama tidak terbawa
  useEffect(() => {
    if (!isOpen) return;

    reset({
      payment_amount: 0,
      payment_note: "",
    });
  }, [isOpen, rental?.id_asset_rental, reset]);

  // [TAMBAHAN]
  // helper untuk format Rupiah
  const formatIDR = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value || 0);

  // [TAMBAHAN]
  // watch dipakai untuk membaca nilai input secara realtime
  // supaya preview sisa pembayaran bisa langsung berubah
  const paymentAmount = watch("payment_amount") || 0;

  // sisa tagihan dari rental
  const remaining = Number(rental?.remaining_amount ?? 0);

  // hitung sisa setelah bayar
  const afterPay = Math.max(0, remaining - Number(paymentAmount || 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pembayaran Rental"
      size="md"
      footer={
        <div className="flex justify-end gap-3">

          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>

          {/* 
            [PERUBAHAN]
            sebelumnya tombol submit manual onClick
            sekarang tetap manual tapi menggunakan data dari watch()
          */}
          <Button
            type="button"
            isLoading={loading}
            onClick={async () => {

              // validasi frontend sederhana
              if (!paymentAmount || paymentAmount <= 0) {
                toast.error("Nominal pembayaran harus lebih dari 0.");
                return;
              }

              if (paymentAmount > remaining) {
                toast.error("Nominal pembayaran melebihi sisa tagihan.");
                return;
              }

              try {
                setLoading(true);

                await onSubmit({
                  payment_amount: Number(paymentAmount),

                  // note bisa kosong
                  payment_note: watch("payment_note")?.trim() || undefined,
                });

                onClose();

              } catch (e: any) {
                toast.error(e?.message || "Gagal menyimpan pembayaran");
              } finally {
                setLoading(false);
              }
            }}
          >
            Simpan Pembayaran
          </Button>
        </div>
      }
    >
      {!rental ? (
        <div className="text-sm text-gray-600">Tidak ada data rental.</div>
      ) : (
        <div className="space-y-4">

          {/* 
            [TAMBAHAN]
            Ringkasan data rental supaya admin tahu konteks pembayaran
          */}
          <div className="rounded-lg border bg-gray-50 p-3 space-y-2">

            <div className="font-semibold text-gray-900">
              {rental.assetStock?.asset?.asset_name ?? "-"} (
              {rental.assetStock?.asset?.asset_code ?? "-"})
            </div>

            <div className="text-sm text-gray-600">
              Customer: {rental.customer?.name ?? "-"} • {rental.customer?.phone ?? "-"}
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">

              <div>
                Total Rental:{" "}
                <span className="font-semibold">
                  {formatIDR(Number(rental.price ?? 0))}
                </span>
              </div>

              <div>
                DP:{" "}
                <span className="font-semibold">
                  {formatIDR(Number(rental.dp_amount ?? 0))}
                </span>
              </div>

              <div>
                Sisa Tagihan:{" "}
                <span className="font-semibold text-red-600">
                  {formatIDR(remaining)}
                </span>
              </div>

              <div>
                Status Pembayaran:{" "}
                <span className="font-semibold">
                  {rental.payment_status ?? "-"}
                </span>
              </div>

            </div>
          </div>

          {/* 
            [TAMBAHAN]
            input nominal pembayaran
            menggunakan react-hook-form register
          */}
          <Input
            label="Nominal Pembayaran"
            type="number"
            {...register("payment_amount", {
              required: "Nominal pembayaran wajib diisi",
              valueAsNumber: true,
              min: { value: 1, message: "Nominal pembayaran harus lebih dari 0" },
              validate: (value) =>
                Number(value) <= remaining || "Nominal pembayaran melebihi sisa tagihan",
            })}
            error={errors.payment_amount?.message}
          />

          {/* 
            [TAMBAHAN]
            preview realtime sisa pembayaran setelah input
          */}
          <div className="rounded-lg border bg-white p-3 text-sm text-gray-700">
            Sisa setelah bayar:{" "}
            <span className="font-semibold">
              {formatIDR(afterPay)}
            </span>
          </div>

          {/* 
            [TAMBAHAN]
            catatan pembayaran opsional
          */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Catatan Pembayaran
            </label>

            <textarea
              {...register("payment_note")}
              rows={3}
              placeholder="Contoh: transfer pelunasan tahap 2"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      )}
    </Modal>
  );
}