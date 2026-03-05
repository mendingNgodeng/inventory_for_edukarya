//maintenanceAssets/component/borrowActiveTable - sebenranya maintenance
import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination"; 
import type { MaintenanceActiveTableProps } from "../Types";

export default function MaintenanceActiveTable({
  data,
  loading,
  onReturn,
}: MaintenanceActiveTableProps) {

    const usedOnly = useMemo(() => {
    return (data ?? []).filter((x) => x.status === "ON_PROGRESS");
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
console.log("ActiveTable data len:", data?.length);
console.log("ActiveTable usedOnly len:", usedOnly.length);
console.log("ActiveTable statuses:", (data ?? []).map(x => x.status));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return usedOnly.slice(start, start + pageSize);
  }, [usedOnly, page, pageSize]);

  if (loading) return <div className="text-sm text-gray-600">Memuat data asset...</div>;
  if (!usedOnly.length) return <div className="text-sm text-gray-600">Tidak ada maintenance yang sedang berlangsung.</div>;

  return (
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
          {pageData.map((r) => (
            <tr key={r.id_asset_maintenance} className="border-t">
              <td className="px-4 py-2">
                {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
              </td>
              <td className="px-4 py-2">{r.assetStock?.location?.name ?? "-"}</td>
              <td className="px-4 py-2">{r.quantity}</td>
              <td className="px-4 py-2 font-medium">{r.status}</td>
              <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
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