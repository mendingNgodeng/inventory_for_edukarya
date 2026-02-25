// src/pages/rental/Page.tsx
import React, { useMemo, useState } from "react";
import Tabs from "../components/tabs";
import type { RentalTabKey } from "../pages/Types";

import CustomerTab from "../components/CustomerTab";
import RentalByCustomerTab from "./RentalByCustomerTab";
import RentableStockTab from "../components/RentableStockTab";
import RentalHistoryTab from "../components/RentalHistoryTab";

import { useData as useCustomers } from "../../../api/rental_customer/hooks";
import { useData as useRentals } from "../../../api/rental_asset/hooks";
import { useData as useStock } from "../../../api/assetsStock/hooks";

export default function Page() {
  const [tab, setTab] = useState<RentalTabKey>("CUSTOMER");
  const [searchTerm, setSearchTerm] = useState("");

  // fetch
  const {
    Data: customers,
    loading: customerLoading,
    fetchData: refetchCustomers,
  } = useCustomers() as any;

  const {
    Data: rentals,
    loading: rentalLoading,
    fetchData: refetchRentals,
    createRental,
    finishRental,
    cancelRental,
    updateData: updateRental, // kalau ada
  } = useRentals() as any;

  const {
    Data: stocks,
    loading: stockLoading,
    fetchData: refetchStocks,
  } = useStock() as any;

  const loading = customerLoading || rentalLoading || stockLoading;

  const refreshAll = async () => {
    await Promise.all([refetchCustomers?.(), refetchRentals?.(), refetchStocks?.()]);
  };

  // ✅ rentables stock (filtered)
  const rentableStocks = useMemo(() => {
    return (stocks ?? []).filter(
      (s: any) =>
        s.asset?.is_rentable === true &&
        s.status === "TERSEDIA" &&
        s.condition === "BAIK" &&
        (s.quantity ?? 0) > 0
    );
  }, [stocks]);

  // ✅ history count
  const historyCount = useMemo(() => {
    return (rentals ?? []).filter(
      (r: any) => r.status === "SELESAI" || r.status === "DIBATALKAN"
    ).length;
  }, [rentals]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Rental</h1>
        <div className="text-sm text-gray-500">{loading ? "Loading..." : ""}</div>
      </div>

      {/* Search BAR (1 untuk semua tab) */}
      <input
        type="text"
        placeholder="Cari customer / asset / lokasi..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          focus:shadow-lg focus:shadow-blue-500/50 font-medium text-gray-700"
      />

      {/* Tabs */}
      <Tabs
        active={tab}
        onChange={setTab}
        counts={{
          customer: customers?.length ?? 0,
          byCustomer: customers?.length ?? 0,
          stock: rentableStocks.length,
          history: historyCount,
        }}
      />

      {/* Content: ✅ pass props data dari parent */}
      {tab === "CUSTOMER" && (
        <CustomerTab searchTerm={searchTerm} />
      )}

      {tab === "RENTAL_BY_CUSTOMER" && (
        <RentalByCustomerTab
          searchTerm={searchTerm}
          customers={customers ?? []}
          rentals={rentals ?? []}
          createRental={createRental}
          finishRental={finishRental}
          cancelRental={cancelRental}
          updateRental={updateRental}
          afterAction={refreshAll}
        />
      )}

      {tab === "RENTABLE_STOCK" && (
        <RentableStockTab
          searchTerm={searchTerm}
          customers={customers ?? []}
          stocks={rentableStocks}
          createRental={createRental}
          afterAction={refreshAll}
        />
      )}

      {tab === "HISTORY" && (
        <RentalHistoryTab
          searchTerm={searchTerm}
          rentals={rentals ?? []}
        />
      )}
    </div>
  );
}