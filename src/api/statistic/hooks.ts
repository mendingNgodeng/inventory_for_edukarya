import { useEffect, useState, useCallback } from "react";
import { dashboardService } from "./service";
import type { DashboardSummary, CtgRankByStock,getLatestLogs,BorrowSummary,RentalSummary } from "./types";

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryRanking, setCategoryRanking] = useState<CtgRankByStock[]>([]);
  const [logs, setLogs] = useState<getLatestLogs[]>([]);
  const [borrowSummary, setBorrowSummary] = useState<BorrowSummary | null>(null);
  const [rentalSummary, setRentalSummary] = useState<RentalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDashboard = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

   const [
        data,
        ctgRank,
        getLogs,
        borrowSum,
        rentalSum,
      ] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getCtgRank(),
        dashboardService.get5logs(),
        dashboardService.getBorrowSummary(),
        dashboardService.getRentalSummary(),
      ]);

setSummary(data);
setLogs(getLogs)
setCategoryRanking(ctgRank);
setBorrowSummary(borrowSum);
      setRentalSummary(rentalSum);
  } catch (error) {
    console.error("Failed to fetch dashboard", error);
    setError(error instanceof Error ? error.message : "Failed to load dashboard");
  } finally {
    setLoading(false); // INI YANG KURANG
  }
}, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    summary,
    categoryRanking,
    logs,
    borrowSummary,
    rentalSummary,
    loading,
    error,
    fetchDashboard,
  };
};