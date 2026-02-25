// src/pages/rental/component/RentableStockTab.tsx
import React, { useState } from "react";
import RentableStockCard from "./RentableStockCard";
import RentalModalStock from "./RentalModalStock";

export default function RentableStockTab({ customers, stocks, createRental, afterAction }: any) {
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const openModal = (s: any) => {
    setSelectedStock(s);
    setOpen(true);
  };

  if (!stocks?.length) return <div className="text-sm text-gray-600">Tidak ada stock rentable.</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stocks.map((s: any) => (
          <RentableStockCard key={s.id_asset_stock} stock={s} onRent={() => openModal(s)} />
        ))}
      </div>

      <RentalModalStock
        isOpen={open}
        onClose={() => setOpen(false)}
        stock={selectedStock}
        customers={customers}
        onSubmit={async (payload: any) => {
          await createRental(payload);
          await afterAction?.();
          setOpen(false);
        }}
      />
    </div>
  );
}