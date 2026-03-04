// import React from "react";
import type { AssetLogsTabKey } from "./Types";

export default function Tabs({
  active,
  onChange,
  counts,
}: {
  active: AssetLogsTabKey;
  onChange: (t: AssetLogsTabKey) => void;
  counts: { all: number; assetStock: number,user:number,rental_customer:number,categories:number,types:number,location:number,asset:number,rental:number,borrow:number,maintenance:number};
}) {
  const btn = (key: AssetLogsTabKey, label: string, count: number) => {
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
        <span className={isActive ? "opacity-90" : "text-gray-500"}>
          ({count})
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {btn("ALL", "Semua", counts.all)}
      {btn("ASSET_STOCK", "Stok Aset", counts.assetStock)}
      {btn("USER", "User (karyawan)", counts.user)}
      {btn("RENTAL_CUSTOMER", "Rental Customer", counts.rental_customer)}
      {btn("CATEGORIES", "Kategori Aset", counts.categories)}
      {btn("TYPES", "Tipe Aset", counts.types)}
      {btn("LOCATION", "Lokasi Aset", counts.location)}
      {btn("ASSET", "Aset", counts.asset)}
      {btn("RENTAL", "Rental Barang", counts.rental)}
      {btn("BORROW", "Penggunaan Barang", counts.borrow)}
      {btn("MAINTENANCE", "Maintenance Barang", counts.maintenance)}
    </div>
  );
}