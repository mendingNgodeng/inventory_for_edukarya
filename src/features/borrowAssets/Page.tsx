import React, { useMemo, useState, useEffect } from "react";
import Cards from "./cards";
import Pagination from "../../components/ui/pagination";
import BorrowUseModal from "./borrowUseModal";
import Tabs from "./component/tabs";
import type { TabKey } from "./Types";
import BorrowReturnedTable from "./component/borrowReturnedTable";
import ReturnModal from "./component/returnModal";
import BorrowActiveByUserTab from "./component/BorrowActiveKaryawanTab";
import BorrowActiveByUserOwnTab from "./component/BorrowActiveKaryawanOwnTab";
import BorrowApprovalTab from "./component/BorrowApprovalTab";
import { useData as useStock } from "../../api/assetsStock/hooks";
import { useData as useBorrowed } from "../../api/UseAssets/hooks";
import { useAuth } from "../../api/auth/hooks";
const Page: React.FC = () => {
  const [stockPage, setStockPage] = useState(1);
  const [stockPageSize, setStockPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState<TabKey>("STOCK");

  // ADDED: ambil user login
const { getUSER } = useAuth(); // ADDED
const currentUser = getUSER(); // CHANGED
const isAdmin = currentUser?.role === "ADMIN";
const isBoss = currentUser?.role === "BOS";
const canApprove = isAdmin || isBoss;
const canSeeActive = isAdmin || isBoss;
const currentUserId = Number(currentUser?.id_user);

  useEffect(() => {
    setStockPage(1);
  }, [tab, searchTerm]);

  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [openBorrowModal, setOpenBorrowModal] = useState(false);

  const [selectedBorrow, setSelectedBorrow] = useState<any | null>(null);
  const [openReturnModal, setOpenReturnModal] = useState(false);

  const { Data: stockData, loading: stockLoading, fetchData: refetchStock } = useStock();

  const {
    Data: borrowedData,
    loading: borrowLoading,
    createBorrow,
    updateData,
     approveByAdmin,
    approveByBoss,
    rejectBorrow,
      cancelBorrow,
    fetchData: refetchBorrow,
  } = useBorrowed() as any;

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

  const stockTotal = filteredStock?.length ?? 0;
  const stockTotalPages = Math.max(1, Math.ceil(stockTotal / stockPageSize));

  useEffect(() => {
    if (stockPage > stockTotalPages) setStockPage(stockTotalPages);
  }, [stockPage, stockTotalPages]);

  const filteredBorrow = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return borrowedData;

    return borrowedData.filter((x: any) => {
      const assetName = x.assetStock?.asset?.asset_name?.toLowerCase() || "";
      const assetCode = x.assetStock?.asset?.asset_code?.toLowerCase() || "";
      const loc = x.assetStock?.location?.name?.toLowerCase() || "";
      const userName = x.user?.name?.toLowerCase?.() || "";
      return (
        assetName.includes(term) ||
        assetCode.includes(term) ||
        loc.includes(term) ||
        userName.includes(term)
      );
    });
  }, [borrowedData, searchTerm]);

  // approval data
  const approvalBorrow = useMemo(() => {
  return (filteredBorrow ?? []).filter((x: any) => {
    if (isAdmin) return x.status === "MENUNGGU_ADMIN";
    if (isBoss) return x.status === "MENUNGGU_BOS";
    return false;
  });
}, [filteredBorrow, isAdmin, isBoss]);

  // ADMIN: semua pinjaman aktif user-user
  const activeBorrow = useMemo(() => {
    return (filteredBorrow ?? []).filter((x: any) =>
      ["DIPINJAM","TERLAMBAT"].includes(x.status)
    );
  }, [filteredBorrow]);

  // ADDED: pinjaman milik user login
const ownBorrow = useMemo(() => {
  return (filteredBorrow ?? []).filter(
     (x: any) =>
      Number(x.id_user ?? x.user?.id_user) === currentUserId &&
      [
        "MENUNGGU_ADMIN",
        "MENUNGGU_BOS",
        "DITOLAK",
        "DIPINJAM",
        "DIPAKAI",
        "DIBATALKAN",
        "TERLAMBAT",
      ].includes(x.status)
  );
}, [filteredBorrow, currentUserId]);

  const returnedBorrow = useMemo(() => {
    return (filteredBorrow ?? []).filter((x: any) =>
    ["DIKEMBALIKAN", "DITOLAK","DIBATALKAN"].includes(x.status)
  );
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-black">
          Pinjam Asset
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

      <Tabs
        active={tab}
        onChange={setTab}
        role={currentUser?.role}
        counts={{
          stock: filteredStock?.length ?? 0,
          approval: approvalBorrow.length,
          active: activeBorrow.length,
          own: ownBorrow.length, // ADDED
          returned: returnedBorrow.length,
        }}
      />

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

      {/* ACTIVE hanya admin */}
{tab === "ACTIVE" && canSeeActive && (
  <BorrowActiveByUserTab
    data={activeBorrow}
    loading={borrowLoading}
    onReturn={handleOpenReturn}
  />
)}

      {tab === "APPROVAL" && canApprove && (
  <BorrowApprovalTab
    data={approvalBorrow}
    loading={borrowLoading}
    currentRole={currentUser?.role}
    onApproveAdmin={async (row) => {
      await approveByAdmin(row.id_asset_borrowed);
      await refreshAll();
    }}
    onApproveBoss={async (row) => {
      await approveByBoss(row.id_asset_borrowed);
      await refreshAll();
    }}
    onReject={async (row, note) => {
      await rejectBorrow(row.id_asset_borrowed, {
        approval_note: note,
      });
      await refreshAll();
    }}
  />
)}

      {/* OWN untuk semua role */}
     {tab === "OWN" && (
  <BorrowActiveByUserOwnTab
    data={ownBorrow}
    loading={borrowLoading}
    onReturn={handleOpenReturn}
    onCancel={async (row, payload) => {
    await cancelBorrow(row.id_asset_borrowed, payload);
    await refreshAll();
  }}
  />
)}

      {tab === "RETURNED" && (
        <BorrowReturnedTable data={returnedBorrow} loading={borrowLoading} />
      )}

      <BorrowUseModal
        isOpen={openBorrowModal}
        onClose={() => setOpenBorrowModal(false)}
        stock={selectedStock}
        borrowedData={borrowedData}
        createBorrow={createBorrow}
        afterSuccess={refreshAll}
      />

      <ReturnModal
  isOpen={openReturnModal}
  onClose={() => {
    setOpenReturnModal(false);
    setSelectedBorrow(null);
  }}
  row={selectedBorrow}
  onReturn={async (payload) => {
    if (!selectedBorrow) return;

    await updateData(selectedBorrow.id_asset_borrowed, payload);
    await Promise.all([refetchStock(), refetchBorrow()]);
  }}
/>
    </div>
  );
};

export default Page;