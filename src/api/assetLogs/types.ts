// api/asset-logs/types.ts

export type AssetLogAction =
  | "ASSET_STOCK_UPDATE"
  | "ASSET_STOCK_CREATE"
  | "ASSET_STOCK_DELETE"
  | "ASSET_UPDATE"
  | "ASSET_CREATE"
  | "ASSET_DELETE"
  | "ASSET_CATEGORIES_UPDATE"
  | "ASSET_CATEGORIES_CREATE"
  | "ASSET_CATEGORIES_DELETE"
  | "USER(KARYAWAN)_UPDATE"
  | "USER(KARYAWAN)_CREATE"
  | "USER(KARYAWAN)_DELETE"
  | "RENTAL_CUSTOMER_UPDATE"
  | "RENTAL_CUSTOMER_CREATE"
  | "RENTAL_CUSTOMER_DELETE"
  | "ASSET_TYPE_UPDATE"
  | "ASSET_TYPE_CREATE"
  | "ASSET_TYPE_DELETE"
  | "LOCATION_UPDATE"
  | "LOCATION_CREATE"
  | "LOCATION_DELETE"
  | "BORROW_CREATE"
  | "BORROW_RETURN"
  | "BORROW_CANCEL"
  | "USED_CREATE"
  | "USED_RETURN"
  | "RENTAL_CREATE"
  | "RENTAL_FINISH"
  | "RENTAL_CANCEL"
  | "MAINTENANCE_CREATE"
  | "MAINTENANCE_DONE"
  | "STOCK_UPDATE"
  | "STOCK_MOVE"
  | "DELETE_HISTORY"
  | "OTHER";

export interface AssetLogItem {
  id_asset_logs: number;
  action: AssetLogAction;
  description: string | null;
  created_at: string; // biasanya ISO string dari API
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string; // optional (kalau error)
}

// optional: group type biar mudah di UI
export type AssetLogGroup =
  | "all"
  | "location"
  | "rental-customer"
  | "user"
  | "asset"
  | "asset-stock"
  | "types"
  | "categories"
  | "rental"
  | "borrow"
  | "maintenance"
  | "delete-history"
  | "other";