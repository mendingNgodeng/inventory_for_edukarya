// src/pages/assetLogs/Types.ts

export type AssetLogsTabKey = "ALL" | "ASSET_STOCK" | "USER" | "RENTAL_CUSTOMER" | "CATEGORIES" | "TYPES" | "LOCATION" | "ASSET" | "RENTAL" | "BORROW" | "MAINTENANCE";

export interface AssetLogItem {
  id_asset_logs: number;
  action: string;       // kalau mau strict: pakai AssetLogAction dari api/asset-logs/types
  description: string | null;
  created_at: string;   // ISO string
}

export interface AssetLogsTableProps {
  data: AssetLogItem[];
  loading: boolean;
}