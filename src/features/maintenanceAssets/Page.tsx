import React, { useMemo, useState,useEffect} from "react";
import DashboardLayout from "../../layouts/Dashboardlayout";
import Cards from "./cards";
import Pagination from "../../components/ui/pagination";
import BorrowUseModal from "./borrowUseModal";
import Tabs from "./component/tabs";
import type { TabKey, StockItem, ReturnPayload } from "./Types";
import BorrowActiveTable from "./component/borrowActiveTable";
import BorrowReturnedTable from "./component/borrowReturnedTable";
import ReturnModal from "./component/returnModal";
import { useData as useStock } from "../../api/assetsStock/hooks";
import { useData as useBorrowed } from "../../api/MaintenanceAssets/hooks";


// pagination

const Page: React.FC = () => {
  const [stockPage, setStockPage] = useState(1);
const [stockPageSize, setStockPageSize] = useState(12); // cocok utk grid 3 kolom (12 = 4 baris)
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<TabKey>("STOCK");

useEffect(() => {
  setStockPage(1);
}, [tab, searchTerm]);


  // modal pinjam
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [openBorrowModal, setOpenBorrowModal] = useState(false);

  // modal return
  const [selectedBorrow, setSelectedBorrow] = useState<any | null>(null);
  const [openReturnModal, setOpenReturnModal] = useState(false);

  const { Data: stockData, loading: stockLoading, fetchData: refetchStock } = useStock();

  const {
    Data: data,
    loading: borrowLoading,
    createMaintenance,
    // createUsed, // kalau dipakai kantor ada
    updateData, // 
    returnAsset,
    fetchData: refetchBorrow,
  } = useBorrowed() as any;

  // ====== FILTER STOCK LIST (tab STOCK) ======
  const filteredStock = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return stockData;

    return stockData.filter((x: any) => {
      const name = x.asset?.asset_name?.toLowerCase() || "";
      const code = x.asset?.asset_code?.toLowerCase() || "";
      const loc = x.location?.name?.toLowerCase() || "";
      return name.includes(term) || code.includes(term) || loc.includes(term);
    });
  }, [stockData, searchTerm]);
// pagination
  const pagedStock = useMemo(() => {
  const start = (stockPage - 1) * stockPageSize;
  return (filteredStock ?? []).slice(start, start + stockPageSize);
}, [filteredStock, stockPage, stockPageSize]);

const stockTotal = filteredStock?.length ?? 0;
const stockTotalPages = Math.max(1, Math.ceil(stockTotal / stockPageSize));

useEffect(() => {
  if (stockPage > stockTotalPages) setStockPage(stockTotalPages);
}, [stockPage, stockTotalPages]);
  // ====== FILTER BORROW LIST (tab ACTIVE + RETURNED) ======
  const filteredBorrow = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;

    return data.filter((x: any) => {
      const assetName = x.assetStock?.asset?.asset_name?.toLowerCase() || "";
      const assetCode = x.assetStock?.asset?.asset_code?.toLowerCase() || "";
      const loc = x.assetStock?.location?.name?.toLowerCase() || "";
     
      return (
        assetName.includes(term) ||
        assetCode.includes(term) ||
        loc.includes(term)
      );
    });
  }, [data, searchTerm]);

 const usedOnly = useMemo(() => {
  return (filteredBorrow ?? []).filter((x: any) => x.status === "ON_PROGRESS");
}, [filteredBorrow]);

  const returnedBorrow = useMemo(() => {
    return (filteredBorrow ?? []).filter((x: any) => x.status === "DONE");
  }, [filteredBorrow]);

  const handleBorrow = (stock: any) => {
    setSelectedStock(stock);
    setOpenBorrowModal(true);
  };

  const handleOpenReturn = (row: any) => {
    setSelectedBorrow(row);
    setOpenReturnModal(true);
  };

  const refreshAll = async () => {
    await Promise.all([refetchStock(), refetchBorrow()]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Maintenance Asset
          </h1>

          <div className="text-sm text-gray-500">
            {stockLoading || borrowLoading ? "Loading..." : ""}
          </div>
        </div>

        <input
          type="text"
          placeholder="Cari asset / kode / lokasi / user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          focus:shadow-lg focus:shadow-blue-500/50 font-medium text-gray-700"
        />

        {/* Navbar/tab dibawah search bar */}
        <Tabs
          active={tab}
          onChange={setTab}
          counts={{
            stock: filteredStock?.length ?? 0,
            active: usedOnly.length,
            returned: returnedBorrow.length,
          }}
        />

        {/* CONTENT */}
        {tab === "STOCK" && (
          <>
            {stockLoading ? (
              <div className="text-sm text-gray-600">Memuat data stock...</div>
            ) : (
              <Cards data={filteredStock} onBorrow={handleBorrow} />
            )}

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Pagination
            page={stockPage}
            pageSize={stockPageSize}
            total={stockTotal}
            onPageChange={setStockPage}
            onPageSizeChange={(s) => {
              setStockPageSize(s);
              setStockPage(1);
            }}
            pageSizeOptions={[6, 12, 24, 48]}
          />
        </div>
          </>
        )}

        {tab === "ACTIVE" && (
          <BorrowActiveTable
            data={usedOnly}
            loading={borrowLoading}
            onReturn={handleOpenReturn}
          />
        )}

        {tab === "RETURNED" && (
          <BorrowReturnedTable data={returnedBorrow} loading={borrowLoading} />
        )}

        {/* MODAL PINJAM */}
        <BorrowUseModal
          isOpen={openBorrowModal}
          onClose={() => setOpenBorrowModal(false)}
          stock={selectedStock}
          data={data}
          createMaintenance={createMaintenance}
          afterSuccess={refreshAll}
        />

        {/* MODAL RETURN */}
     <ReturnModal
  isOpen={openReturnModal}
  onClose={() => setOpenReturnModal(false)}
  row={selectedBorrow}
  onReturn={async (payload) => {
    if (!selectedBorrow) return;
    await returnAsset(selectedBorrow.id_asset_maintenance, payload);
    await Promise.all([refetchStock(), refetchBorrow()]);
  }}
/>
      </div>
    </DashboardLayout>
  );
};

export default Page;