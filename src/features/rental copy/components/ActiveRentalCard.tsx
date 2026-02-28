// src/pages/rental/components/ActiveRentalCard.tsx
// import React from "react";
import Button from "../../../components/ui/button";
import Alert from "../../../components/ui/alert";
import { useState } from "react";

export default function ActiveRentalCard({
  rental,
  onFinish,
  onCancel,

}: {
  rental: any;
  onFinish: () => void;
  onCancel: () => Promise<void>;

}) {
  const assetName = rental.assetStock?.asset?.asset_name ?? "-";
  const assetCode = rental.assetStock?.asset?.asset_code ?? "-";
  const custName = rental.customer?.name ?? "-";
  const custPhone = rental.customer?.phone ?? "-";
  // const ktp = rental.customer?.pictureKtp;
  const [openCancel,setOpenCancel] = useState(false)
  const [loadingCancel,setLoadingCancel] = useState(false)
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div>
        <div className="font-semibold text-gray-900">
          {assetName} ({assetCode})
        </div>
        <div className="text-sm text-gray-600">
          Customer: <span className="font-medium">{custName}</span> • {custPhone}
        </div>
      </div>

      <div className="text-sm text-gray-700">
        Qty: <span className="font-semibold">{rental.quantity}</span>
        <div className="text-gray-600">
          {new Date(rental.rental_start).toLocaleString()} →{" "}
          {new Date(rental.rental_end).toLocaleString()}
        </div>
      </div>

      <div>
      
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline_blue" type="button" onClick={onFinish}>
          Selesaikan
        </Button>
        <Button variant="danger" type="button" onClick={() => setOpenCancel(true)}>
          Batalkan
        </Button>
      </div>
    <Alert 
    open={openCancel}
    title="Batalkan Rental?"
    description={`Rental Untuk ${assetName}(${assetCode}) akan dibatalkan. Aksi ini tidak dapat dibatalkan`}
    confirmText="Ya, Batalkan"
    cancelText="Kembali"
    loading={loadingCancel}
    onCancel={() => setOpenCancel(false)}
    onConfirm={async () => {
      try{
        setLoadingCancel(true);
        await onCancel();
        setLoadingCancel(false);
      }finally{
        setLoadingCancel(false);
      }
    }}
     
    />
    </div>

  );
}