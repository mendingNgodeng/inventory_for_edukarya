import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination";
import type { BorrowActiveTableProps } from "../Types";

type AnyRow = any;

export default function BorrowActiveByUserOwnTab({
  data,
  loading,
  onReturn,
}: BorrowActiveTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // CHANGED:
  // untuk "Pinjaman anda", langsung ambil data aktif milik user login
  const activeOnly = useMemo(
    () =>
      (data ?? []).filter((x: AnyRow) =>
        ["DIPINJAM"].includes(x.status)
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
    <div className="space-y-4">
      {/* header */}
      <div className="text-sm text-gray-600">
        Menampilkan daftar asset yang sedang Anda pinjam.
      </div>

      {/* table */}
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
                <td className="px-4 py-2 font-medium">{r.status}</td>
                <td className="px-4 py-2">
                  {new Date(r.borrowed_date).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <Button type="button" onClick={() => onReturn(r)}>
                    Kembalikan
                  </Button>
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
  );
}