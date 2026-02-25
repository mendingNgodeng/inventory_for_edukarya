// src/pages/rental/component/RentalByCustomerTab.tsx
import React, { useMemo, useState } from "react";
import ActiveRentalCard from "../components/ActiveRentalCard";
import FinishRentalModal from "../components/FinishRentalModal";
import { toast } from "sonner";

export default function RentalByCustomerTab({
  rentals,
  finishRental,
  cancelRental,
  afterAction,
  searchTerm,
}: {
  rentals: any[];
  finishRental: (id: number, payload: { image_after_rental: string }) => Promise<void>;
  cancelRental: (id: number) => Promise<void>;
  afterAction: () => Promise<void>;
  searchTerm: string;
}) {
  const [selectedRental, setSelectedRental] = useState<any | null>(null);
  const [openFinish, setOpenFinish] = useState(false);

  const activeRentals = useMemo(() => {
    const base = (rentals ?? []).filter((r: any) => r.status === "AKTIF");

    const term = searchTerm.toLowerCase().trim();
    if (!term) return base;

    return base.filter((r: any) => {
      const assetName = r.assetStock?.asset?.asset_name?.toLowerCase?.() ?? "";
      const assetCode = r.assetStock?.asset?.asset_code?.toLowerCase?.() ?? "";
      const custName = r.customer?.name?.toLowerCase?.() ?? "";
      const custPhone = r.customer?.phone?.toLowerCase?.() ?? "";
      return (
        assetName.includes(term) ||
        assetCode.includes(term) ||
        custName.includes(term) ||
        custPhone.includes(term)
      );
    });
  }, [rentals, searchTerm]);

  if (!activeRentals.length) {
    return (
      <div className="text-sm text-gray-600">
        Tidak ada rental yang sedang aktif.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeRentals.map((r: any) => (
          <ActiveRentalCard
            key={r.id_asset_rental}
            rental={r}
            onFinish={() => {
              setSelectedRental(r);
              setOpenFinish(true);
            }}
            onCancel={async () => {
              try {
                await cancelRental(r.id_asset_rental);
                await afterAction();
                toast.success("Rental berhasil dibatalkan");
              } catch (e: any) {
                toast.error(e?.message || "Gagal membatalkan rental");
              }
            }}
          />
        ))}
      </div>

      <FinishRentalModal
        isOpen={openFinish}
        onClose={() => setOpenFinish(false)}
        rental={selectedRental}
        onSubmit={async (payload) => {
          if (!selectedRental) return;
          await finishRental(selectedRental.id_asset_rental, payload);
          await afterAction();
          toast.success("Rental selesai");
        }}
      />
    </div>
  );
}