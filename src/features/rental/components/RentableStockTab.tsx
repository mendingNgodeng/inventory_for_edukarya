// src/pages/rental/component/RentableStockTab.tsx
import { useEffect, useMemo, useState } from "react";
import RentableStockCard from "./RentableStockCard";
import RentalModalStock from "./RentalModalStock";
import Pagination from "../../../components/ui/pagination";

export default function RentableStockTab({
  customers,
  stocks,
  createRental,
  afterAction,
}: any) {
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  // ✅ pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // cocok 3 kolom (3x3)

  const openModal = (s: any) => {
    setSelectedStock(s);
    setOpen(true);
  };

  // ✅ reset page ketika data berubah (misal search/filter dari parent)
  useEffect(() => {
    setPage(1);
  }, [stocks?.length, pageSize]);

  const total = stocks?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (stocks ?? []).slice(start, start + pageSize);
  }, [stocks, page, pageSize]);

  if (!stocks?.length)
    return <div className="text-sm text-gray-600">Tidak ada stock rentable.</div>;

  return (
    <div className="space-y-4">
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pageData.map((s: any) => (
          <RentableStockCard
            key={s.id_asset_stock}
            stock={s}
            onRent={() => openModal(s)}
          />
        ))}
      </div>

      {/* ✅ PAGINATION */}
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
          pageSizeOptions={[6, 9, 12, 24]}
        />
      </div>

      {/* MODAL */}
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