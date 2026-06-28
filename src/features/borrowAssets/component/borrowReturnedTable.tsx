import { useEffect, useMemo, useState } from "react";
import type { BorrowReturnedTableProps } from "../Types";
import Pagination from "../../../components/ui/pagination";
import TableFilters, { type SortOrder } from "../../../components/ui/tablefilters";
import { sortByDate } from "../../../components/helper/dateSort";
import Button from "../../../components/ui/button";
import BorrowReturnedDetailModal from "./BorrowReturnedDetailModal";

type SortKey = "BORROWED_DATE" | "RETURNED_DATE";
type AnyRow = any;

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID");
};

export default function BorrowReturnedTable({
  data,
  loading,
}: BorrowReturnedTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [sortBy, setSortBy] = useState<SortKey>("BORROWED_DATE");
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  const [selectedRow, setSelectedRow] = useState<AnyRow | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [data, sortBy, sortOrder]);

  const sortedData = useMemo(() => {
    if (!data?.length) return [];

    if (sortBy === "BORROWED_DATE") {
      return sortByDate(data, (r) => r.borrowed_date, sortOrder);
    }

    return sortByDate(data, (r) => r.returned_date, sortOrder);
  }, [data, sortBy, sortOrder]);

  const total = sortedData?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleOpenDetail = (row: AnyRow) => {
    setSelectedRow(row);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedRow(null);
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Memuat riwayat...</div>;
  }

  if (!sortedData.length) {
    return (
      <div className="text-sm text-gray-600">
        Belum ada asset yang dikembalikan.
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg bg-white">
        <div className="bg-white border-b border-gray-200 rounded-t-lg p-3">
          <TableFilters<SortKey>
            label="Urutkan berdasarkan"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChangeSortBy={setSortBy}
            onChangeSortOrder={setSortOrder}
            sortOptions={[
              { value: "BORROWED_DATE", label: "Tanggal Pinjam" },
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
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Tanggal Pinjam</th>
                <th className="px-4 py-2 text-left">Tanggal Kembali</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {pageData.map((r) => (
                <tr key={r.id_asset_borrowed} className="border-t">
                  <td className="px-4 py-2">
                    {r.assetStock?.asset?.asset_name ?? "-"} (
                    {r.assetStock?.asset?.asset_code ?? "-"})
                  </td>

                  <td className="px-4 py-2">
                    {r.status === "DIPAKAI"
                      ? "Dipakai Kantor"
                      : r.user?.name ?? r.id_user ?? "Kantor"}
                  </td>

                  <td className="px-4 py-2">{r.quantity}</td>

                  <td className="px-4 py-2">{r.status}</td>

                  <td className="px-4 py-2">
                    {formatDateTime(r.borrowed_date)}
                  </td>

                  <td className="px-4 py-2">
                    {formatDateTime(r.returned_date)}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <Button
                      type="button"
                      variant="outline_blue"
                      onClick={() => handleOpenDetail(r)}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      <BorrowReturnedDetailModal
        isOpen={openDetail}
        onClose={handleCloseDetail}
        row={selectedRow}
      />
    </>
  );
}