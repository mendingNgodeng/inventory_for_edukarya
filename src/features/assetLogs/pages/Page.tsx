import React, { useEffect, useMemo, useState } from "react";
import Tabs from "./Tabs";
import AssetLogsTable from "../tables/assetLogsTable";
import type { AssetLogsTabKey } from "./Types";

//  hook yang dibuat sebelumnya
import { useAssetLogs } from "../../../api/assetLogs/hooks";

const Page: React.FC = () => {
  const [tab, setTab] = useState<AssetLogsTabKey>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // reset search optional saat ganti tab (kalau mau)
    // setSearchTerm("");
  }, [tab]);

  // ambil data per tab = easy to manage i guess
const allLogs = useAssetLogs({ group: "all", autoFetch: false });
const stockLogs = useAssetLogs({ group: "asset-stock", autoFetch: false });
const userLogs = useAssetLogs({ group: "user", autoFetch: false });
const rental_customerLogs = useAssetLogs({ group: "rental-customer", autoFetch: false });
const categoriesLogs = useAssetLogs({ group: "categories", autoFetch: false });
const typesLogs = useAssetLogs({ group: "types", autoFetch: false });
const locationLogs = useAssetLogs({ group: "location", autoFetch: false });
const assetLogs = useAssetLogs({ group: "asset", autoFetch: false });
const rentalLogs = useAssetLogs({ group: "rental", autoFetch: false });
const borrowLogs = useAssetLogs({ group: "borrow", autoFetch: false });
const maintenanceLogs = useAssetLogs({ group: "maintenance", autoFetch: false });



// lazy request
useEffect(() => {
  if (tab === "ALL") allLogs.fetchLogs();
  if (tab === "ASSET_STOCK") stockLogs.fetchLogs();
  if (tab === "USER") userLogs.fetchLogs();
  if (tab === "RENTAL_CUSTOMER") rental_customerLogs.fetchLogs();
  if (tab === "CATEGORIES") categoriesLogs.fetchLogs();
  if (tab === "TYPES") typesLogs.fetchLogs();
  if (tab === "LOCATION") locationLogs.fetchLogs();
  if (tab === "ASSET") assetLogs.fetchLogs();
  if (tab === "RENTAL") rentalLogs.fetchLogs();
  if (tab === "BORROW") borrowLogs.fetchLogs();
  if (tab === "MAINTENANCE") maintenanceLogs.fetchLogs();

}, [tab, allLogs.fetchLogs, stockLogs.fetchLogs, userLogs.fetchLogs]);

const activeHook = useMemo(() => {
  const map = {
    ALL: allLogs,
    ASSET_STOCK: stockLogs,
    USER: userLogs,
    RENTAL_CUSTOMER: rental_customerLogs,
    CATEGORIES: categoriesLogs,
    TYPES: typesLogs,
    LOCATION:locationLogs,
    ASSET:assetLogs,
    RENTAL:rentalLogs,
    BORROW:borrowLogs,
    MAINTENANCE:maintenanceLogs,

  } as const;

  return map[tab];
}, [tab, allLogs, stockLogs, userLogs]);
  const rawData = activeHook.logs ?? [];
  const loading = activeHook.loading;

  // ===== FILTER SEARCH =====
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return rawData;

    return rawData.filter((x: any) => {
      const action = String(x.action ?? "").toLowerCase();
      const desc = String(x.description ?? "").toLowerCase();
      const time = String(x.created_at ?? "").toLowerCase();
      return action.includes(term) || desc.includes(term) || time.includes(term);
    });
  }, [rawData, searchTerm]);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          Asset Logs
        </h1>

        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : ""}
        </div>
      </div>

      {/* search */}
      <input
        type="text"
        placeholder="Cari action / deskripsi / waktu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          focus:shadow-lg focus:shadow-blue-500/50 font-medium text-gray-700"
      />

      {/* tabs */}
      <Tabs
        active={tab}
        onChange={setTab}
        counts={{
          all: allLogs.logs?.length ?? 0,
          assetStock: stockLogs.logs?.length ?? 0,
          user: userLogs.logs?.length ?? 0,
          rental_customer: rental_customerLogs.logs?.length ?? 0,
          categories: categoriesLogs.logs?.length ?? 0,
          types: typesLogs.logs?.length ?? 0,
          location:locationLogs.logs?.length ?? 0,
          asset:assetLogs.logs?.length ?? 0,
          rental:rentalLogs.logs?.length ?? 0,
          borrow:borrowLogs.logs?.length ?? 0,
          maintenance:maintenanceLogs.logs?.length ?? 0,

        }}
      />

      {/* content */}
      <AssetLogsTable data={filtered as any} loading={loading} />
    </div>
  );
};

export default Page;