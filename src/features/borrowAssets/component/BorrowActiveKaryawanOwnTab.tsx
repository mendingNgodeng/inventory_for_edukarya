import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination";
import type { BorrowActiveTableProps } from "../Types";
import BorrowDetailModal from "./BorrowDetailModal";
import BorrowCancelModal from "./BorrowCancelModal";
type AnyRow = any;

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID");
};

const getStatusBadgeClass = (status: string) => {
  if (status === "DIPINJAM" || status === "TERLAMBAT") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "DIBATALKAN") {
  return "bg-orange-100 text-orange-700";
  }

  if (status === "MENUNGGU_ADMIN" || status === "MENUNGGU_BOS") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "DITOLAK") {
    return "bg-red-100 text-red-700";
  }

  if (status === "DIKEMBALIKAN") {
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-700";
};

export default function BorrowActiveByUserOwnTab({
  data,
  loading,
  onReturn,
  onCancel,
}: BorrowActiveTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selected, setSelected] = useState<AnyRow | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedCancel, setSelectedCancel] = useState<AnyRow | null>(null);
  const [openCancel, setOpenCancel] = useState(false);

  const activeOnly = useMemo(
    () =>
      (data ?? []).filter((x: AnyRow) =>
        [
          "DIPINJAM",
          "TERLAMBAT",
          "MENUNGGU_BOS",
          "MENUNGGU_ADMIN",
          "DIBATALKAN",
          "DITOLAK",
        ].includes(x.status)
      ),
    [data]
  );

  const total = activeOnly.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [pageSize, total]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return activeOnly.slice(start, start + pageSize);
  }, [activeOnly, page, pageSize]);

  const handleOpenDetail = (row: AnyRow) => {
    setSelected(row);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelected(null);
  };

  const handleOpenCancel = (row: AnyRow) => {
  setSelectedCancel(row);
  setOpenCancel(true);
};

const handleCloseCancel = () => {
  setOpenCancel(false);
  setSelectedCancel(null);
};

  if (loading) {
    return <div className="text-sm text-gray-600">Memuat data peminjaman...</div>;
  }

  if (!activeOnly.length) {
    return (
      <div className="text-sm text-gray-600">
        Anda belum memiliki peminjaman aktif.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Menampilkan daftar asset yang sedang Anda pinjam / ajukan.
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="px-4 py-2 text-left">Asset</th>
                <th className="px-4 py-2 text-left">Lokasi</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {pageData.map((r: AnyRow) => (
                <tr key={r.id_asset_borrowed} className="border-t">
                  <td className="px-4 py-2">
                    {r.assetStock?.asset?.asset_name ?? "-"} (
                    {r.assetStock?.asset?.asset_code ?? "-"})
                  </td>

                  <td className="px-4 py-2">
                    {r.assetStock?.location?.name ?? "-"}
                  </td>

                  <td className="px-4 py-2">{r.quantity}</td>

                  <td className="px-4 py-2 font-medium">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {formatDateTime(r.borrowed_date)}
                  </td>

                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline_blue"
                        onClick={() => handleOpenDetail(r)}
                      >
                        Detail
                      </Button>

                    {["MENUNGGU_ADMIN", "MENUNGGU_BOS"].includes(r.status) && onCancel ? (
  <Button
    type="button"
    variant="danger"
    onClick={() => handleOpenCancel(r)}
  >
    Batalkan
  </Button>
) : ["DIPINJAM", "TERLAMBAT"].includes(r.status) ? (
  <Button type="button" onClick={() => onReturn(r)}>
    Kembalikan
  </Button>
) : (
  <span className="self-center text-xs text-gray-400">
    Tidak ada aksi
  </span>
)}
                    </div>
                  </td>
                </tr>
              ))}

              {!pageData.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data peminjaman.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
      </div>

      <BorrowDetailModal
        isOpen={openDetail}
        onClose={handleCloseDetail}
        selected={selected}
        onReturn={onReturn}
      />

      <BorrowCancelModal
  isOpen={openCancel}
  onClose={handleCloseCancel}
  row={selectedCancel}
  onCancel={async (row, payload) => {
    if (!onCancel) return;
    await onCancel(row, payload);
  }}
/>

    </>
  );
}