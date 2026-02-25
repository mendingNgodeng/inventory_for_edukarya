// src/pages/rental/component/RentalByCustomerTab.tsx
import React, { useMemo, useState } from "react";
import CustomerCard from "../components/CustomerCard";
import RentalModalCustomer from "../components/RentalModalCustomer";
import CustomerRentalTable from "../components/CustomerRentalTable";

export default function RentalByCustomerTab({
  customers,
  rentals,
  createRental,
  finishRental,
  cancelRental,
  afterAction,
}: any) {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const customerRentals = useMemo(() => {
    if (!selectedCustomer) return [];
    return (rentals ?? []).filter((r: any) => r.id_rental_customer === selectedCustomer.id_rental_customer);
  }, [rentals, selectedCustomer]);

  const activeRows = useMemo(
    () => customerRentals.filter((r: any) => r.status === "AKTIF"),
    [customerRentals]
  );

  return (
    <div className="space-y-4">
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(customers ?? []).map((c: any) => (
          <CustomerCard
            key={c.id_rental_customer}
            customer={c}
            onRental={() => {
              setSelectedCustomer(c);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {/* table for selected */}
      {selectedCustomer && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="font-semibold text-gray-900">
            Rental untuk: {selectedCustomer.name} ({selectedCustomer.phone ?? "-"})
          </div>

          <div className="mt-3">
            <CustomerRentalTable
              rows={activeRows}
              onFinish={async (row: any) => {
                await finishRental(row.id_asset_rental, {}); // foto optional, bisa tambah modal finish nanti
                await afterAction?.();
              }}
              onCancel={async (row: any) => {
                await cancelRental(row.id_asset_rental);
                await afterAction?.();
              }}
            />
          </div>
        </div>
      )}

      <RentalModalCustomer
        isOpen={open}
        onClose={() => setOpen(false)}
        customer={selectedCustomer}
        onSubmit={async (payload: any) => {
          await createRental(payload);
          await afterAction?.();
          setOpen(false);
        }}
      />
      {/* {console.log("RentalByCustomerTab customers:", customers)}
{console.log("isArray?", Array.isArray(customers), "len:", customers?.length)} */}
    </div>
  );
}