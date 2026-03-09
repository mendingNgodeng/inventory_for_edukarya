import { useEffect, useMemo, useState } from "react";
import type { MaintenanceReturnedTableProps } from "../Types";
import Pagination from "../../../components/ui/pagination"; 
import TableFilters, { type SortOrder } from "../../../components/ui/tablefilters"; 
import { sortByDate } from "../../../components/helper/dateSort"; 

type SortKey = "MAINTENANCE_DATE" | "RETURNED_DATE";

export default function BorrowReturnedTable({ data, loading }: MaintenanceReturnedTableProps) {
 const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

   // sort state
  const [sortBy, setSortBy] = useState<SortKey>("MAINTENANCE_DATE");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  // reset page saat data / sort berubah
  useEffect(() => {
    setPage(1);
  }, [data, sortBy, sortOrder]);

  // data tersortir
  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    if (sortBy === "MAINTENANCE_DATE") {
      return sortByDate(data, (r) => r.created_at, sortOrder);
    }
    // RETURNED_DATE
    return sortByDate(data, (r) => r.updated_at, sortOrder);
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
            { value: "MAINTENANCE_DATE", label: "Tanggal Maintenance" },
            { value: "RETURNED_DATE", label: "Tanggal Kembali" },
          ]}
        />
      </div>
        <div className="h-full overflow-auto">
    
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">Asset</th>
          
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Tanggal Maintenance</th>
            <th className="px-4 py-2 text-left">Tanggal Kembali</th>
            <th className="px-4 py-2 text-left">status</th>

          </tr>
        </thead>
        <tbody className="text-gray-700">
          {pageData.map((r) => (
            <tr key={r.id_asset_maintenance} className="border-t">
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
             
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">
                {r.updated_at ? new Date(r.updated_at).toLocaleString() : "-"}
              </td>
              <td className="px-4 py-2">{r.status}</td>

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