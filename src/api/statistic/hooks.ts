import { useEffect, useState, useCallback } from "react";
import { dashboardService } from "./service";
import type { DashboardSummary, CtgRankByStock,getLatestLogs } from "./types";

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryRanking, setCategoryRanking] = useState<CtgRankByStock[]>([]);
  const [logs, setLogs] = useState<getLatestLogs[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDashboard = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // console.log("ranking:",categoryRanking);
    const data = await dashboardService.getDashboard();
    const ctgRank = await dashboardService.getCtgRank();
    const getLogs = await dashboardService.get5logs();

setSummary(data);
setLogs(getLogs)
setCategoryRanking(ctgRank);
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
    loading,
    error,
    fetchDashboard,
  };
};