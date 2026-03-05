import { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/ui/pagination";
import type { AssetLogsTableProps } from "../pages/Types";

type SortOrder = "DESC" | "ASC";

function parseDescription(input?: string | null) {
  const text = input ?? "";
  if (!text) return { summary: "-", meta: null as any };

  const idx = text.indexOf("META=");
  if (idx === -1) return { summary: text, meta: null as any };

  const summary = text.slice(0, idx).trim().replace(/\|\s*$/, "").trim();
  const metaRaw = text.slice(idx + "META=".length).trim();

  try {
    const meta = JSON.parse(metaRaw);
    return { summary: summary || "-", meta };
  } catch {
    return { summary: summary || "-", meta: { raw: metaRaw } };
  }
}

function formatTimeMobile(d: any) {
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function JsonViewer({ value }: { value: any }) {
  return (
    <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-[320px]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function DetailModal({
  open,
  onClose,
  row,
}: {
  open: boolean;
  onClose: () => void;
  row: any | null;
}) {
  if (!open || !row) return null;

  const parsed = parseDescription(row.description);

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-0 md:p-4">
        <div className="w-full h-full md:h-auto md:max-w-2xl bg-white md:rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <div>
              <div className="text-base font-semibold text-gray-900">
                Detail Log
              </div>
              <div className="text-xs text-gray-500">
                {new Date(row.created_at).toLocaleString()}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-black"
            >
              Tutup
            </button>
          </div>

          {/* ✅ scrollable content (biar enak di HP) */}
          <div className="p-5 space-y-4 overflow-auto max-h-[calc(100vh-140px)] md:max-h-[70vh]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <div className="text-xs text-gray-500">Action</div>
                <div className="text-sm font-semibold text-gray-900">
                  {row.action}
                </div>
              </div>

              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500">Deskripsi</div>
                <div className="text-sm text-gray-800">{parsed.summary}</div>
              </div>
            </div>

            <div>
              <div className="text-xs mb-2 text-black">META</div>
              {parsed.meta ? (
              <div className="text-black">

                <JsonViewer value={parsed.meta} />
                </div>
              ) : (
                <div className="text-sm text-gray-500">Tidak ada META.</div>
              )}
            </div>
          </div>

          <div className="px-5 py-4 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Oke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssetLogsTable({ data, loading }: AssetLogsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState<SortOrder>("DESC");

  // modal state
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  useEffect(() => {
    setPage(1);
  }, [data, sortOrder]);

  const sortedData = useMemo(() => {
    const arr = [...(data ?? [])];
    arr.sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortOrder === "DESC" ? tb - ta : ta - tb;
    });
    return arr;
  }, [data, sortOrder]);

  const total = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  if (loading) return <div className="text-sm text-gray-600">Memuat logs...</div>;
  if (!sortedData.length) return <div className="text-sm text-gray-600">Belum ada logs.</div>;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* header sort (sticky biar enak di mobile) */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="text-sm font-semibold text-gray-700">Riwayat Aktivitas</div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-black">Urutan</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white text-black"
          >
            <option value="DESC">Terbaru</option>
            <option value="ASC">Terlama</option>
          </select>
        </div>
      </div>

      {/* ✅ DESKTOP TABLE */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-700">
              <th className="px-4 py-2 text-left w-[170px]">Waktu</th>
              <th className="px-4 py-2 text-left w-[220px]">Action</th>
              <th className="px-4 py-2 text-left">Deskripsi</th>
              <th className="px-4 py-2 text-right w-[120px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {pageData.map((r) => {
              const parsed = parseDescription(r.description);
              const hasMeta = !!parsed.meta;

              return (
                <tr key={r.id_asset_logs} className="border-t align-top">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 font-medium">{r.action}</td>
                  <td className="px-4 py-2">
                    <div className="line-clamp-2">{parsed.summary}</div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {hasMeta ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRow(r);
                          setOpenDetail(true);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        Lihat Detail
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ MOBILE LIST */}
      <div className="md:hidden divide-y">
        {pageData.map((r) => {
          const parsed = parseDescription(r.description);
          const hasMeta = !!parsed.meta;

          return (
            <div key={r.id_asset_logs} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">
                    {formatTimeMobile(r.created_at)}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {r.action}
                  </div>
                </div>

                {hasMeta ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRow(r);
                      setOpenDetail(true);
                    }}
                    className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 text-black"
                  >
                    Detail
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 shrink-0">-</span>
                )}
              </div>

              <div className="text-sm text-gray-700 line-clamp-3">
                {parsed.summary}
              </div>
            </div>
          );
        })}
      </div>

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

      <DetailModal
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setSelectedRow(null);
        }}
        row={selectedRow}
      />
    </div>
  );
}