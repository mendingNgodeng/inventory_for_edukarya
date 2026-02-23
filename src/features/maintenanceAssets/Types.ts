// src/pages/maintenanceAssets/types.ts

export type TabKey = "STOCK" | "ACTIVE" | "RETURNED";

/** Stock item untuk Cards */
export interface StockItem {
  id_asset_stock: number;
  quantity: number;
  status: string;
  condition: string;
  asset?: {
    asset_name?: string;
    asset_code?: string;
    is_rentable?: boolean;
  };
  location?: {
    name?: string;
  };
}

/** Row untuk maintenance (borrowedData) */
export interface maintenanceRow {
  id_asset_maintenance:number;
  id_asset_stock: number;
  quantity: number;
  cost: number;
  created_at:string,
  updated_at:string,
  description: string;
  status: string;
  assetStock: {
    asset: {
      asset_name:string;
      asset_code:string;
    };
    location:{
      name:string;
    }
}}

/** Payload create */
export interface CreateMaintenancePayload {
  id_asset_stock: number;
  cost: number;
  quantity: number;
  description: string;
}

/** Payload return (sesuaikan dengan UpdateData kamu) */
export interface ReturnPayload {
  status: "DONE" | string;
}

/** Props Cards */
export interface CardsProps {
  data: StockItem[];
  onBorrow: (stock: StockItem) => void;
}

/** Props BorrowActiveTable */
export interface MaintenanceActiveTableProps {
  data: maintenanceRow[];
  loading: boolean;
  onReturn: (row: maintenanceRow) => void;
}

/** Props BorrowReturnedTable */
export interface MaintenanceReturnedTableProps {
  data: maintenanceRow[];
  loading: boolean;
}

/** Props ReturnModal */
export interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: maintenanceRow | null;
  onReturn: (payload: ReturnPayload) => Promise<void>;
}

export interface maintenanceFormData {
 id_asset_stock: number;
  cost: number;
  quantity: number ;
  description: string;
}