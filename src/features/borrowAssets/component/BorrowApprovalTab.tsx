import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination";
import type { BorrowApprovalTabProps, BorrowRow } from "../Types";

export default function BorrowApprovalTab({
  data,
  loading,
  currentRole,
  onApproveAdmin,
  onApproveBoss,
  onReject,
}: BorrowApprovalTabProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const approvalRows = useMemo(() => {
    return (data ?? []).filter((x: BorrowRow) => {
      if (currentRole === "ADMIN") return x.status === "MENUNGGU_ADMIN";
      if (currentRole === "BOS") return x.status === "MENUNGGU_BOS";
      return false;
    });
  }, [data, currentRole]);

  const total = approvalRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [pageSize, total]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return approvalRows.slice(start, start + pageSize);
  }, [approvalRows, page, pageSize]);

  const handleApprove = async (row: BorrowRow) => {
    try {
      if (currentRole === "ADMIN") {
        await onApproveAdmin(row);
        toast.success("Request disetujui admin. Menunggu approval bos.");
        return;
      }

      if (currentRole === "BOS") {
        await onApproveBoss(row);
        toast.success("Request disetujui bos. Asset berhasil dipinjam.");
        return;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal approve");
    }
  };

  const handleReject = async (row: BorrowRow) => {
    try {
      await onReject(row, rejectNote.trim() || undefined);
      toast.success("Request peminjaman ditolak");
      setRejectingId(null);
      setRejectNote("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal menolak request");
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Memuat data approval...</div>;
  }

  if (!approvalRows.length) {
    return <div className="text-sm text-gray-600">Tidak ada request yang menunggu approval.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {currentRole === "ADMIN"
          ? "Request dari karyawan yang menunggu approval admin."
          : "Request yang menunggu approval bos."}
      </div>

      <div className="border border-gray-200 rounded-lg overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="px-4 py-2 text-left">Asset</th>
              <th className="px-4 py-2 text-left">Lokasi</th>
              <th className="px-4 py-2 text-left">Peminjam</th>
              <th className="px-4 py-2 text-left">Jabatan</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Tanggal Request</th>
              <th className="px-4 py-2 text-left">Tanggal Pengembalian</th>
              <th className="px-4 py-2 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {pageData.map((row: BorrowRow) => (
              <tr key={row.id_asset_borrowed} className="border-t align-top">
                <td className="px-4 py-2">
                  {row.assetStock?.asset?.asset_name ?? "-"} (
                  {row.assetStock?.asset?.asset_code ?? "-"})
                </td>

                <td className="px-4 py-2">
                  {row.assetStock?.location?.name ?? "-"}
                </td>

                <td className="px-4 py-2">
                  {row.user?.name ?? "-"}
                </td>

                <td className="px-4 py-2">
                  {row.user?.jabatan ?? "-"}
                </td>

                <td className="px-4 py-2">{row.quantity}</td>

                <td className="px-4 py-2 font-semibold">
                  <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-2">
                  {new Date(row.borrowed_date).toLocaleString()}
                </td>

                <td className="px-4 py-2">
                  {new Date(row.due_date).toLocaleString()}
                </td>

                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => handleApprove(row)}
                    >
                      Approve
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        setRejectingId(row.id_asset_borrowed);
                        setRejectNote("");
                      }}
                    >
                      Tolak
                    </Button>
                  </div>

                  {rejectingId === row.id_asset_borrowed && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        rows={2}
                        placeholder="Catatan penolakan opsional"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectNote("");
                          }}
                        >
                          Batal
                        </Button>

                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleReject(row)}
                        >
                          Konfirmasi Tolak
                        </Button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
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