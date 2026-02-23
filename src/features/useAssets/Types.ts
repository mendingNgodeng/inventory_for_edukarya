// src/pages/borrowAsset/types.ts

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

/** Row untuk peminjaman/pemakaian (borrowedData) */
export interface BorrowRow {
  id_asset_borrowed: number;
  id_asset_stock: number;
  id_user: number | null;

  quantity: number;
  borrowed_date: string;
  returned_date: string | null;

  status: string; // DIPINJAM | DIPAKAI | DIKEMBALIKAN | TERLAMBAT
  user?: {
    id_user?: number;
    name?: string;
    jabatan?: string;
    no_hp?: string;
  } | null;

  assetStock?: {
    asset?: { asset_name?: string; asset_code?: string };
    location?: { name?: string };
  };
}

/** Payload create borrow */
export interface CreateBorrowPayload {
  id_asset_stock: number;
  id_user: number;
  quantity: number;
}

/** Payload return (sesuaikan dengan UpdateData kamu) */
export interface ReturnPayload {
  status: "DIKEMBALIKAN" | string;
}

/** Props Cards */
export interface CardsProps {
  data: StockItem[];
  onBorrow: (stock: StockItem) => void;
}

/** Props BorrowActiveTable */
export interface BorrowActiveTableProps {
  data: BorrowRow[];
  loading: boolean;
  onReturn: (row: BorrowRow) => void;
}

/** Props BorrowReturnedTable */
export interface BorrowReturnedTableProps {
  data: BorrowRow[];
  loading: boolean;
}

/** Props ReturnModal */
export interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: BorrowRow | null;
  onReturn: (payload: ReturnPayload) => Promise<void>;
}

export interface CreateUsedPayload {
  id_asset_stock: number;
  quantity: number;
  id_user?: number | null; // untuk DIPAKAI biasanya null
}

export interface UseFormData {
  quantity: number;
}