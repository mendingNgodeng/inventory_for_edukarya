// src/pages/rental/component/RentalModal.tsx
import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { useData as useStock } from "../../../api/assetsStock/hooks";
import {type RentalForm} from "../pages/Types"
export default function RentalModal({ isOpen, onClose, customer, onSubmit }: any) {
  const { Data: stockData, loading } = useStock() as any;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<RentalForm>();

  useEffect(() => {
    if (!isOpen) return;
    reset({
      id_asset_stock: "",
      quantity: 1,
      rental_start: "",
      rental_end: "",
      price: 0,
      id_rental_customer: customer?.id_rental_customer,
    });
  }, [isOpen, customer, reset]);

  const rentableStocks = (stockData ?? []).filter((s: any) =>
    s?.status === "TERSEDIA" &&
    s?.condition === "BAIK" &&
    s?.asset?.is_rentable === true
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Rental"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="rentalForm" isLoading={isSubmitting}>
            Simpan
          </Button>
        </div>
      }
    >
      {!customer ? (
        <div className="text-sm text-gray-600">Pilih customer dulu.</div>
      ) : (
        <form
          id="rentalForm"
          onSubmit={handleSubmit(async (v) => {
            // pastikan kirim ISO string
            await onSubmit({
              id_rental_customer: customer.id_rental_customer,
              id_asset_stock: Number(v.id_asset_stock),
              quantity: Number(v.quantity),
              rental_start: new Date(v.rental_start).toISOString(),
              rental_end: new Date(v.rental_end).toISOString(),
              price: Number(v.price),
              status: "AKTIF",
            });
          })}
          className="space-y-4"
        >
          <div className="p-3 rounded-lg border bg-gray-50">
            <div className="font-semibold text-gray-900">{customer.name}</div>
            <div className="text-sm text-gray-600">{customer.phone ?? "-"}</div>
          </div>

          {/* select stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Asset</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              {...register("id_asset_stock", { required: "Asset wajib dipilih" })}
            >
              <option value="">-- pilih --</option>
              {rentableStocks.map((s: any) => (
                <option key={s.id_asset_stock} value={s.id_asset_stock}>
                  {s.asset?.asset_name} ({s.asset?.asset_code}) - {s.location?.name} - stok {s.quantity}
                </option>
              ))}
            </select>
            {errors.id_asset_stock?.message && (
              <div className="text-xs text-red-600 mt-1">{String(errors.id_asset_stock.message)}</div>
            )}
          </div>

          <Input
            label="Quantity"
            type="number"
            {...register("quantity", { required: "Quantity wajib", valueAsNumber: true, min: 1 })}
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

          <Input
            label="Price"
            type="number"
            {...register("price", { valueAsNumber: true, min: 0 })}
            error={errors.price?.message}
          />

          {loading ? <div className="text-sm text-gray-500">Memuat stock...</div> : null}
        </form>
      )}
    </Modal>
  );
}