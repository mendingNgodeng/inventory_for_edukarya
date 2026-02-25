// src/pages/rental/component/RentalModalCustomer.tsx
// unused
import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { useData as useStock } from "../../../api/assetsStock/hooks";
import type { RentalForm } from "../pages/Types";

const errMsg = (e: unknown) => (typeof (e as any)?.message === "string" ? (e as any).message : undefined);

export default function RentalModalCustomer({ isOpen, onClose, customer, onSubmit }: any) {
  const { Data: stockData, loading } = useStock() as any;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<RentalForm>({
    defaultValues: { id_asset_stock: "", quantity: 1, rental_start: "", rental_end: "", price: 0 },
  });

  useEffect(() => {
    if (!isOpen) return;
    reset({ id_asset_stock: "", quantity: 1, rental_start: "", rental_end: "", price: 0 });
  }, [isOpen, reset]);

  const rentableStocks = (stockData ?? []).filter((s: any) =>
    s?.asset?.is_rentable === true && s?.condition === "BAIK" && s?.status === "TERSEDIA"
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Rental"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="rentalFormCustomer" isLoading={isSubmitting}>Simpan</Button>
        </div>
      }
    >
      {!customer ? (
        <div className="text-sm text-gray-600">Pilih customer dulu.</div>
      ) : (
        <form
          id="rentalFormCustomer"
          onSubmit={handleSubmit(async (v) => {
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Asset</label>
            <select className="w-full border rounded-lg px-3 py-2"
              {...register("id_asset_stock", { required: "Asset wajib dipilih" })}
            >
              <option className="text-gray-700" value="">-- pilih --</option>
              {rentableStocks.map((s: any) => (
                <option key={s.id_asset_stock} value={String(s.id_asset_stock)}>
                  {s.asset?.asset_name} ({s.asset?.asset_code}) • {s.location?.name} • stok {s.quantity}
                </option>
              ))}
            </select>
            {errMsg(errors.id_asset_stock) && <div className="text-xs text-red-600 mt-1">{errMsg(errors.id_asset_stock)}</div>}
          </div>

          <Input
            label="Quantity"
            type="number"
            {...register("quantity", { required: "Quantity wajib", valueAsNumber: true, min: { value: 1, message: "Minimal 1" } })}
            error={errMsg(errors.quantity)}
          />
          <Input
            label="Rental Start"
            type="datetime-local"
            {...register("rental_start", { required: "Tanggal mulai wajib" })}
            error={errMsg(errors.rental_start)}
          />
          <Input
            label="Rental End"
            type="datetime-local"
            {...register("rental_end", { required: "Tanggal selesai wajib" })}
            error={errMsg(errors.rental_end)}
          />
          <Input
            label="Price"
            type="number"
            {...register("price", { valueAsNumber: true, min: { value: 0, message: "Tidak boleh negatif" } })}
            error={errMsg(errors.price)}
          />

          {loading ? <div className="text-sm text-gray-500">Memuat stock...</div> : null}
        </form>
      )}
    </Modal>
  );
}