import  { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination"; 
import type { BorrowActiveTableProps } from "../Types";

export default function BorrowActiveTable({
  data,
  loading,
  onReturn,
}: BorrowActiveTableProps) {

    const usedOnly = useMemo(() => {
    return (data ?? []).filter((x) => x.status === "DIPAKAI");
  }, [data]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // reset page saat data berubah (misalnya search berubah)
  useEffect(() => {
    setPage(1);
  }, [usedOnly]);

  const total = usedOnly?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // jaga-jaga kalau page > totalPages setelah filter
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return usedOnly.slice(start, start + pageSize);
  }, [usedOnly, page, pageSize]);

  if (loading) return <div className="text-sm text-gray-600">Memuat data peminjaman...</div>;
  if (!usedOnly.length) return <div className="text-sm text-gray-600">Tidak ada peminjaman yang sedang berlangsung.</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="px-4 py-2 text-left">Asset</th>
            <th className="px-4 py-2 text-left">Lokasi</th>
            <th className="px-4 py-2 text-left">User</th>
            <th className="px-4 py-2 text-left">Qty</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Tanggal</th>
            <th className="px-4 py-2 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {pageData.map((r) => (
            <tr key={r.id_asset_borrowed} className="border-t">
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
              <td className="px-4 py-2">{r.assetStock?.location?.name ?? "-"}</td>
              <td className="px-4 py-2">
                {r.status === "DIPAKAI" ? "Kantor" : (r.user?.name ?? r.id_user ?? "-")}
              </td>
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2 font-medium">{r.status}</td>
              <td className="px-4 py-2">{new Date(r.borrowed_date).toLocaleString()}</td>
              <td className="px-4 py-2 text-right">
                <Button type="button" onClick={() => onReturn(r)}>
                  Kembalikan
                </Button>
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
  );
}