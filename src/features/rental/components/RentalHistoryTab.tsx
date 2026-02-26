// src/pages/rental/component/RentalHistoryTab.tsx
import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination";
import TableFilters, { type SortOrder } from "../../../components/ui/tablefilters";
import { sortByDate } from "../../../components/helper/dateSort";

type SortKey = "START_DATE" | "END_DATE";
type StatusFilter = "ALL" | "SELESAI" | "DIBATALKAN";

export default function RentalHistoryTab({ rentals, searchTerm }: any) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  // filter & sort state
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortKey>("END_DATE");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  // pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1) SEARCH
  const searched = useMemo(() => {
    const term = (searchTerm ?? "").toLowerCase().trim();
    if (!term) return rentals ?? [];

    return (rentals ?? []).filter((r: any) => {
      const cust = r.customer?.name?.toLowerCase?.() ?? "";
      const phone = r.customer?.phone?.toLowerCase?.() ?? "";
      const assetName = r.assetStock?.asset?.asset_name?.toLowerCase?.() ?? "";
      const assetCode = r.assetStock?.asset?.asset_code?.toLowerCase?.() ?? "";
      return (
        cust.includes(term) ||
        phone.includes(term) ||
        assetName.includes(term) ||
        assetCode.includes(term)
      );
    });
  }, [rentals, searchTerm]);

  // 2) STATUS FILTER
  const statusFiltered = useMemo(() => {
    if (status === "ALL") return searched;
    return searched.filter((r: any) => r.status === status);
  }, [searched, status]);

  // 3) SORT BY DATE
  const sorted = useMemo(() => {
    if (!statusFiltered.length) return [];

    if (sortBy === "START_DATE") {
      return sortByDate(statusFiltered, (r: any) => r.rental_start, sortOrder);
    }
    return sortByDate(statusFiltered, (r: any) => r.rental_end, sortOrder);
  }, [statusFiltered, sortBy, sortOrder]);

  // reset page kalau result berubah / filter berubah
  useEffect(() => {
    setPage(1);
  }, [searchTerm, status, sortBy, sortOrder, pageSize]);

  // 4) PAGINATION (HARUS setelah filter+sort)
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  if (!sorted.length) {
    return <div className="text-sm text-gray-600">Belum ada riwayat rental.</div>;
  }

  return (
    <>
      {/* FILTER BAR */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-700">Status</div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="ALL">Semua</option>
            <option value="SELESAI">SELESAI</option>
            <option value="DIBATALKAN">DIBATALKAN</option>
          </select>
        </div>

        <TableFilters<SortKey>
          label="Urutkan berdasarkan"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChangeSortBy={setSortBy}
          onChangeSortOrder={setSortOrder}
          sortOptions={[
            { value: "END_DATE", label: "Tanggal Selesai (Rental End)" },
            { value: "START_DATE", label: "Tanggal Mulai (Rental Start)" },
          ]}
        />
      </div>

      {/*  TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">After Rental</th>
              <th className="px-4 py-2 text-left">Periode</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {pageData.map((r: any) => (
              <tr key={r.id_asset_rental} className="border-t">
                <td className="px-4 py-2">{r.customer?.name ?? "-"}</td>

                <td className="px-4 py-2">
                  {r.assetStock?.asset?.asset_name ?? "-"} (
                  {r.assetStock?.asset?.asset_code ?? "-"})
                </td>

                <td className="px-4 py-2">{r.quantity}</td>
                <td className="px-4 py-2 font-medium">{r.status}</td>

                <td className="px-4 py-2">
                  {r.image_after_rental ? (
                    <button
                      type="button"
                      className="group"
                      onClick={() => {
                        setSelected(r);
                        setOpen(true);
                      }}
                      title="Klik untuk lihat"
                    >
                      <img
                        src={r.image_after_rental}
                        alt="After Rental"
                        className="w-20 h-20 object-cover rounded-lg border group-hover:opacity-90"
                      />
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">Tidak ada foto</span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {new Date(r.rental_start).toLocaleDateString()} →{" "}
                  {new Date(r.rental_end).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/*  PAGINATION */}
        <div className="border-t border-gray-200 bg-white">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(s: number) => {
              setPageSize(s);
              setPage(1);
            }}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>

      {/*  MODAL PREVIEW */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Detail Rental"
        size="lg"
        footer={
          <div className="flex justify-end">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        }
      >
        {!selected ? (
          <div className="text-sm text-gray-600">Tidak ada data dipilih.</div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-gray-50">
              <div className="font-semibold text-gray-900">
                {selected.assetStock?.asset?.asset_name ?? "-"} (
                {selected.assetStock?.asset?.asset_code ?? "-"})
              </div>

              <div className="text-sm text-gray-700 mt-1">
                Customer:{" "}
                <span className="font-medium">{selected.customer?.name ?? "-"}</span>{" "}
                • {selected.customer?.phone ?? "-"}
              </div>

              <div className="text-sm text-gray-700 mt-1">
                Qty: <span className="font-semibold">{selected.quantity}</span>{" "}
                • Status: <span className="font-semibold">{selected.status}</span>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                Periode: {new Date(selected.rental_start).toLocaleString()} →{" "}
                {new Date(selected.rental_end).toLocaleString()}
              </div>

              {typeof selected.price !== "undefined" && (
                <div className="text-sm text-gray-600 mt-1">
                  Price: <span className="font-semibold">{selected.price}</span>
                </div>
              )}
            </div>

            {selected.image_after_rental ? (
              <img
                src={selected.image_after_rental}
                alt="After Rental Large"
                className="w-full max-h-[70vh] object-contain rounded-lg border bg-white"
              />
            ) : (
              <div className="text-sm text-gray-500">Tidak ada foto after rental.</div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}