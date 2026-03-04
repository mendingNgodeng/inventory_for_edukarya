import  { useMemo } from "react";
import { Clock } from "lucide-react";
import type { getLatestLogs } from "../../../api/statistic/types"; // sesuaikan path

function stripMeta(desc?: string | null) {
  const text = desc ?? "-";
  const idx = text.indexOf("META=");
  if (idx === -1) return text;
  // ambil sebelum META= dan rapihin trailing "|"
  return text.slice(0, idx).trim().replace(/\|\s*$/, "").trim();
}

export default function RecentActivities({ logs }: { logs: getLatestLogs[] }) {
  const items = useMemo(() => {
    return (logs ?? []).slice(0, 5).map((x) => ({
      id: x.id_asset_logs,
      action: x.action,
      desc: stripMeta(x.description),
    }));
  }, [logs]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-black">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Aktivitas Terbaru
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {!items.length ? (
          <div className="text-sm text-gray-500">Belum ada aktivitas.</div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
              <p className="text-sm font-semibold text-gray-800">{a.action}</p>
              <p className="text-sm text-gray-500">{a.desc || "-"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}