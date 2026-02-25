// src/pages/rental/component/CustomerCard.tsx
// import React from "react";
import Button from "../../../components/ui/button";

export default function CustomerCard({ customer, onRental }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-gray-900">{customer.name}</div>
      <div className="text-sm text-gray-600">{customer.name ?? "-"}</div>

      <div className="mt-3">
        {customer.pictureKtp ? (
          <img src={customer.pictureKtp} className="w-full h-32 object-cover rounded-lg border" />
        ) : (
          <div className="w-full h-32 rounded-lg border bg-gray-50 flex items-center justify-center text-sm text-gray-500">
            KTP kosong
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="outline_blue" onClick={onRental}>
          Rental Barang
        </Button>
      </div>
    </div>
  );
}