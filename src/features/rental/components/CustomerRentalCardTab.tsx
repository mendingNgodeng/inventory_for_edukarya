// src/pages/rental/component/CustomerRentalCardsTab.tsx
import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/ui/pagination";
import CustomerCard from "./CustomerCard";
import RentalModal from "../asset_rental/RentalModal";
import CustomerRentalTable from "./CustomerRentalTable";

export default function CustomerRentalCardsTab({
  customers,
  rentals,
  createRental,
  finishRental,
  cancelRental,
  afterAction,
}: any) {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  // ✅ pagination state (untuk cards customer)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // cocok 3 kolom: 9 = 3 baris

  // reset page kalau list customers berubah (misal search/filter)
  useEffect(() => {
    setPage(1);
  }, [customers]);

  const total = customers?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (customers ?? []).slice(start, start + pageSize);
  }, [customers, page, pageSize]);

  // ===================== rentals per selected customer =====================
  const customerRentals = useMemo(() => {
    if (!selectedCustomer) return [];
    return (rentals ?? []).filter(
      (r: any) => r.id_rental_customer === selectedCustomer.id_rental_customer
    );
  }, [rentals, selectedCustomer]);

  const activeCustomerRentals = useMemo(() => {
    return customerRentals.filter((r: any) => r.status === "AKTIF");
  }, [customerRentals]);

  const handleOpenRental = (cust: any) => {
    setSelectedCustomer(cust);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageCustomers.map((c: any) => (
          <CustomerCard
            key={c.id_rental_customer}
            customer={c}
            onRental={() => handleOpenRental(c)}
          />
        ))}
      </div>

      {/* ✅ Pagination for cards */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={(s: number) => {
            setPageSize(s);
            setPage(1);
          }}
          pageSizeOptions={[6, 9, 12, 18, 24]}
        />
      </div>

      {/* table rental per selected customer */}
      {selectedCustomer && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="font-semibold text-gray-900">
            Rental untuk: {selectedCustomer.name} ({selectedCustomer.phone ?? "-"})
          </div>

          <div className="mt-3">
            <CustomerRentalTable
              rows={activeCustomerRentals}
              onFinish={async (row: any, imageBase64?: string) => {
                await finishRental(
                  row.id_asset_rental,
                  imageBase64 ? { image_after_rental: imageBase64 } : {}
                );
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

      {/* modal assign rental */}
      <RentalModal
        isOpen={open}
        onClose={() => setOpen(false)}
        customer={selectedCustomer}
        onSubmit={async (payload: any) => {
          await createRental(payload);
          await afterAction?.();
          setOpen(false);
        }}
      />
    </div>
  );
}