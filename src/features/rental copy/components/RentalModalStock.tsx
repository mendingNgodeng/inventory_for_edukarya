// src/pages/rental/component/RentalModalStock.tsx
import React, { useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import type { RentalForm } from "../pages/Types";

const errMsg = (e: unknown) => (typeof (e as any)?.message === "string" ? (e as any).message : undefined);

type Form = RentalForm & { id_rental_customer: string };

export default function RentalModalStock({ isOpen, onClose, stock, customers, onSubmit }: any) {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<Form>({
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
    return ktp !== ""; // base64 random string atau data:* tetap string
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rental dari Stock"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="rentalFormStock" isLoading={isSubmitting}>Simpan</Button>
        </div>
      }
    >
      {!stock ? (
        <div className="text-sm text-gray-600">Pilih stock dulu.</div>
      ) : (
        <form
          id="rentalFormStock"
          onSubmit={handleSubmit(async (v) => {
            await onSubmit({
              id_rental_customer: Number(v.id_rental_customer),
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
            <div className="font-semibold text-gray-900">
              {stock.asset?.asset_name ?? "-"} ({stock.asset?.asset_code ?? "-"})
            </div>
            <div className="text-sm text-gray-600">
              Lokasi: {stock.location?.name ?? "-"} • Stock: {stock.quantity ?? 0}
            </div>
          </div>

          {/* customer select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Customer (KTP wajib)</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              {...register("id_rental_customer", { required: "Customer wajib dipilih" })}
            >
              <option value="">-- pilih --</option>
              {eligibleCustomers.map((c: any) => (
                <option className="text-gray-700" key={c.id_rental_customer} value={String(c.id_rental_customer)}>
                  {c.name} ({c.phone ?? "-"})
                </option>
              ))}
            </select>
            {errMsg(errors.id_rental_customer) && <div className="text-xs text-red-600 mt-1">{errMsg(errors.id_rental_customer)}</div>}
          </div>

          {/* hidden-ish asset stock */}
          <input type="hidden" {...register("id_asset_stock")} />

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
        </form>
      )}
    </Modal>
  );
}