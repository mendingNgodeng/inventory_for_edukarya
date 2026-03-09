import { useEffect, useMemo, useState } from "react";
import type { BorrowReturnedTableProps } from "../Types";
import Pagination from "../../../components/ui/pagination"; 
import TableFilters, { type SortOrder } from "../../../components/ui/tablefilters"; 
import { sortByDate } from "../../../components/helper/dateSort"; 

type SortKey = "BORROWED_DATE" | "RETURNED_DATE";

export default function BorrowReturnedTable({ data, loading }: BorrowReturnedTableProps) {
 const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

   // sort state
  const [sortBy, setSortBy] = useState<SortKey>("BORROWED_DATE");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  // reset page saat data / sort berubah
  useEffect(() => {
    setPage(1);
  }, [data, sortBy, sortOrder]);

  // data tersortir
  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    if (sortBy === "BORROWED_DATE") {
      return sortByDate(data, (r) => r.borrowed_date, sortOrder);
    }
    // RETURNED_DATE
    return sortByDate(data, (r) => r.returned_date, sortOrder);
  }, [data, sortBy, sortOrder]);

  const total = sortedData?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // jaga-jaga kalau page > totalPages setelah filter
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);


  if (loading) return <div className="text-sm text-gray-600">Memuat riwayat...</div>;
  if (!sortedData.length) return <div className="text-sm text-gray-600">Belum ada asset yang dikembalikan.</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">

 <div className="bg-white border border-gray-200 rounded-lg p-3">
        <TableFilters<SortKey>
          label="Urutkan berdasarkan"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onChangeSortBy={setSortBy}
          onChangeSortOrder={setSortOrder}
          sortOptions={[
            { value: "BORROWED_DATE", label: "Tanggal Pakai" },
            { value: "RETURNED_DATE", label: "Tanggal Kembali" },
          ]}
        />
      </div>
        <div className="h-full overflow-auto">
    
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Tanggal Pakai</th>
            <th className="px-4 py-2 text-left">Tanggal Kembali</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {pageData.map((r) => (
            <tr key={r.id_asset_borrowed} className="border-t">
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
              <td className="px-4 py-2">
                {r.status === "DIPAKAI" ? "Dipakai Kantor" : (r.user?.name ?? r.id_user ?? "Kantor")}
              </td>
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2">{new Date(r.borrowed_date).toLocaleString()}</td>
              <td className="px-4 py-2">
                {r.returned_date ? new Date(r.returned_date).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        {/*  Pagination */}
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
  );
}