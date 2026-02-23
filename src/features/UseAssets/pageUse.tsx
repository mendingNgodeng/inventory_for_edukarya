import React, { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/Dashboardlayout";
import Cards from "./cards";
import BorrowUseModal from "./borrowUseModal";
import { useData as useStock } from "../../api/assetsStock/hooks";
import { useData as useBorrowed } from "../../api/UseAssets/hooks";
// import { useData as useUser } from "../../api/user/hooks";

const Page: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Stock list
  const {
    Data: stockData,
    loading: stockLoading,
    fetchData: refetchStock,
  } = useStock();

  // Borrow/use list
  const {
    Data: borrowedData,
    loading: borrowLoading,
    createBorrow,
    createUsed,
    fetchData: refetchBorrow,
  } = useBorrowed();

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return stockData;

    return stockData.filter((x: any) => {
      const name = x.asset?.asset_name?.toLowerCase() || "";
      const code = x.asset?.asset_code?.toLowerCase() || "";
      const loc = x.location?.name?.toLowerCase() || "";
      return name.includes(term) || code.includes(term) || loc.includes(term);
    });
  }, [stockData, searchTerm]);

  const handleAction = (stock: any) => {
    setSelectedStock(stock);
    setOpenModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-black">
            Pinjam / Pakai Asset
          </h1>

          <div className="text-sm text-gray-500">
            {stockLoading ? "Loading stock..." : `Total stock: ${filtered.length}`}
          </div>
        </div>

        <input
          type="text"
          placeholder="Cari asset / kode / lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          focus:shadow-lg focus:shadow-blue-500/50 font-medium text-gray-700"
        />

        {stockLoading ? (
          <div className="text-sm text-gray-600">Memuat data stock...</div>
        ) : (
          <Cards data={filtered} onBorrow={handleAction} />
        )}

        <BorrowUseModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          stock={selectedStock}
          borrowedData={borrowedData}
          createBorrow={createBorrow}
          afterSuccess={async () => {
            // penting supaya qty & status stock langsung update + list borrower update
            await Promise.all([refetchStock(), refetchBorrow()]);
          }}
        />

        {borrowLoading && (
          <div className="text-sm text-gray-500">Memuat data peminjaman/pemakaian...</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Page;