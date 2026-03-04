// api/user/types.ts
export interface DashboardSummary {
  total_asset: number;
  total_user: number;
  total_category: number;
  total_used_asset: number;
  total_maintenance_asset: number;
}

export interface CtgRankByStock {
  id_asset_categories: number;
  name: string;
  total_stock: number;
}
export interface getLatestLogs {
id_asset_logs: number;
  action: string;
  description:string;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  category_ranking: CtgRankByStock[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

