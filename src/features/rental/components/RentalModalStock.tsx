import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import {toast} from 'sonner'

const fieldMsg = (e: any) => (typeof e?.message === "string" ? e.message : undefined);

type Form = {
  id_rental_customer: string;
  id_asset_stock: string;
  quantity: number;
  rental_start: string;
  rental_end: string;
  price: number;
};

export default function RentalModalStock({ isOpen, onClose, stock, customers, onSubmit }: any) {
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<Form>({
    defaultValues: {
      id_rental_customer: "",
      id_asset_stock: "",
      quantity: 1,
      rental_start: "",
      rental_end: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    setServerError("");
    reset({
      id_rental_customer: "",
      id_asset_stock: stock ? String(stock.id_asset_stock) : "",
      quantity: 1,
      rental_start: "",
      rental_end: "",
      price: 0,
    });
  }, [isOpen, reset, stock]);

  const eligibleCustomers = (customers ?? []).filter((c: any) => {
    const ktp = (c.pictureKtp ?? "").trim();
    return ktp !== "";
  });

  const mapBackendErrors = (err: any) => {
    // fallback message
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Request gagal. Cek input kamu.";

    setServerError(msg);

    // kalau backend kirim errors per field (contoh: { errors: { quantity: ["..."] } })
    const be = err?.response?.data?.errors;
    if (be && typeof be === "object") {
      Object.keys(be).forEach((k) => {
        const first = Array.isArray(be[k]) ? be[k][0] : be[k];
        if (typeof first === "string") {
          setError(k as keyof Form, { type: "server", message: first });
        }
      });
    }
  };


  const quantity = watch("quantity")
  const rentalStart = watch("rental_start")
  const rentalEnd = watch("rental_end")
useEffect(() => {
  const unitPrice = Number(stock?.asset?.rental_price ?? 0);
  const qty = Number(quantity ?? 0);

  if (!rentalStart || !rentalEnd || !unitPrice || !qty) {
    setValue("price", 0);
    return;
  }

  const start = new Date(rentalStart).getTime();
  const end = new Date(rentalEnd).getTime();
  const ms = end - start;

  if (!Number.isFinite(ms) || ms <= 0) {
    setValue("price", 0);
    return;
  }

  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  const total = unitPrice * qty * days;

  setValue("price", total);
}, [quantity, rentalStart, rentalEnd, stock, setValue]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rental dari Stock"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="rentalFormStock" isLoading={isSubmitting}>
            Simpan
          </Button>
        </div>
      }
    >
      {!stock ? (
        <div className="text-sm text-gray-600">Pilih stock dulu.</div>
      ) : (
        <>
          {/* error backend tampil di atas */}
          {serverError ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </div>
          ) : null}

          <form
            id="rentalFormStock"
            className="space-y-4"
            onSubmit={handleSubmit(async (v) => {
              try {
                setServerError("");

                await onSubmit({
                  id_rental_customer: Number(v.id_rental_customer),
                  id_asset_stock: Number(v.id_asset_stock),
                  quantity: Number(v.quantity),
                  rental_start: new Date(v.rental_start).toISOString(),
                  rental_end: new Date(v.rental_end).toISOString(),
                  price: Number(v.price),
                  status: "AKTIF",
                });
                toast.success("Data Rental Berhasil dibuat")
              } catch (err: any) {
                mapBackendErrors(err);
                toast.error("Data Rental gagal dibuat: ",err)
              }
            })}
          >
            <div className="p-3 rounded-lg border bg-gray-50">
              <div className="font-semibold text-gray-900">
                {stock.asset?.asset_name ?? "-"} ({stock.asset?.asset_code ?? "-"})
              </div>
              <div className="text-sm text-gray-600">
                Lokasi: {stock.location?.name ?? "-"} • Stock: {stock.quantity ?? 0}
              </div>
            </div>

            {/* customer select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Customer (KTP wajib)
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-gray-700"
                {...register("id_rental_customer", { required: "Customer wajib dipilih" })}
              >
                <option value="">-- pilih --</option>
                {eligibleCustomers.map((c: any) => (
                  <option key={c.id_rental_customer} value={String(c.id_rental_customer)}>
                    {c.name} ({c.phone ?? "-"})
                  </option>
                ))}
              </select>

              {fieldMsg(errors.id_rental_customer) && (
                <div className="text-xs text-red-600 mt-1">{fieldMsg(errors.id_rental_customer)}</div>
              )}
            </div>

            {/* pastiin id_asset_stock juga required (biar ga NaN) */}
            <input
              type="hidden"
              {...register("id_asset_stock", { required: "Stock wajib dipilih" })}
            />
            {fieldMsg(errors.id_asset_stock) && (
              <div className="text-xs text-red-600 mt-1">{fieldMsg(errors.id_asset_stock)}</div>
            )}

            <Input
              label="Quantity"
              type="number"
              {...register("quantity", {
                required: "Quantity wajib",
                valueAsNumber: true,
                min: { value: 1, message: "Minimal 1" },
              })}
              error={errors.quantity?.message}
            />

            <Input
              label="Rental Start"
              type="datetime-local"
              {...register("rental_start", { required: "Tanggal mulai wajib" })}
              error={errors.rental_start?.message}
            />

            <Input
              label="Rental End"
              type="datetime-local"
              {...register("rental_end", { required: "Tanggal selesai wajib" })}
              error={errors.rental_end?.message}
            />
<div className="rounded-lg border bg-gray-50 p-3">
  <div className="text-sm text-gray-600">Harga Rental</div>
  <div className="text-lg font-semibold text-gray-900">
    {new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(watch("price") || 0)}
  </div>
</div>
          </form>
        </>
      )}
    </Modal>
  );
}