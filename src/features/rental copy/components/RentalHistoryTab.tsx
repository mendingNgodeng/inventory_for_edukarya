// src/pages/rental/component/RentalHistoryTab.tsx
// import React from "react";

export default function RentalHistoryTab({ rentals }: any) {
  if (!rentals?.length) return <div className="text-sm text-gray-600">Belum ada riwayat rental.</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Periode</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {rentals.map((r: any) => (
            <tr key={r.id_asset_rental} className="border-t">
              <td className="px-4 py-2">{r.customer?.name ?? "-"}</td>
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2 font-medium">{r.status}</td>
              <td className="px-4 py-2">
                {new Date(r.rental_start).toLocaleDateString()} → {new Date(r.rental_end).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}