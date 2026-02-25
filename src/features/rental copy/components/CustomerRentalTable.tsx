// src/pages/rental/component/CustomerRentalTable.tsx
// import React from "react";
import Button from "../../../components/ui/button";

export default function CustomerRentalTable({ rows, onFinish, onCancel }: any) {
  if (!rows?.length) return <div className="text-sm text-gray-600">Tidak ada rental aktif.</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Mulai</th>
            <th className="px-4 py-2 text-left">Selesai</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {rows.map((r: any) => (
            <tr key={r.id_asset_rental} className="border-t">
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2">{new Date(r.rental_start).toLocaleString()}</td>
              <td className="px-4 py-2">{new Date(r.rental_end).toLocaleString()}</td>
              <td className="px-4 py-2 font-medium">{r.status}</td>
              <td className="px-4 py-2 text-right space-x-2">
                <Button variant="outline_blue" type="button" onClick={() => onFinish(r)}>
                  Selesaikan
                </Button>
                <Button variant="danger" type="button" onClick={() => onCancel(r)}>
                  Batalkan
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}