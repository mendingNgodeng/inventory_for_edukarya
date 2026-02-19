import { useEffect, useState } from "react";
import { dashboardService } from "./service";
import type { DashboardSummary, CtgRankByStock } from "./types";

export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categoryRanking, setCategoryRanking] = useState<CtgRankByStock[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboard();
      setSummary(data.summary);
      setCategoryRanking(data.category_ranking);
    } catch (error) {
      console.error("Failed to fetch dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    summary,
    categoryRanking,
    loading,
    fetchDashboard,
  };
};
