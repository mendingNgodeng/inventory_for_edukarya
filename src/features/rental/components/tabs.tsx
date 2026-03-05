// src/pages/rental/component/Tabs.tsx
// import React from "react";
import type { RentalTabKey } from "../pages/Types";

export default function Tabs({
  active,
  onChange,
  counts,
}: {
  active: RentalTabKey;
  onChange: (t: RentalTabKey) => void;
  counts: { customer: number; byCustomer: number; stock: number; history: number };
}) {
  const btn = (key: RentalTabKey, label: string, count: number) => {
    const isActive = active === key;
    return (
      <button
        type="button"
        onClick={() => onChange(key)}
        className={[
          "px-4 py-2 rounded-lg text-sm font-semibold border transition",
          isActive
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        {label}{" "}
        <span className={isActive ? "opacity-90" : "text-gray-500"}>({count})</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {btn("CUSTOMER", "Customer", counts.customer)}
      {btn("RENTAL_BY_CUSTOMER", "Rental per Customer", counts.byCustomer)}
      {btn("RENTABLE_STOCK", "Stock Rentable", counts.stock)}
      {btn("HISTORY", "Riwayat", counts.history)}
    </div>
  );
}