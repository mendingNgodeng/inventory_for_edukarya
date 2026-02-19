import { useEffect, useState, useCallback } from "react";
import { dashboardService } from "./service";
import type { DashboardSummary, CtgRankByStock } from "./types";

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryRanking, setCategoryRanking] = useState<CtgRankByStock[]>([]);
  const [loading, setLoading] = useState(true); // <-- UBAH JADI TRUE
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    console.log("Fetching dashboard data...");
    const data = await dashboardService.getDashboard();

    // console.log("Dashboard data received:", data);
// console.log("Summary value:", data);

setSummary(data);
setCategoryRanking([]);
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
    loading,
    error,
    fetchDashboard,
  };
};