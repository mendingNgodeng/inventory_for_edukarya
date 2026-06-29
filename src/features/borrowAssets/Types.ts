// src/pages/borrowAsset/types.ts

export type TabKey = "STOCK" | "APPROVAL" |"ACTIVE" | "OWN"| "RETURNED";

/** Stock item untuk Cards */
export interface StockItem {
  id_asset_stock: number;
  id_location:number;
  id_asset:number;
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
  due_date:string;
  quantity: number;
  borrowed_date: string;
  returned_date: string | null;

  status:  
  | "MENUNGGU_ADMIN"
  | "MENUNGGU_BOS"
  | "DITOLAK"
  | "DIPINJAM"
  | "DIPAKAI"
  | "DIKEMBALIKAN"
  | "TERLAMBAT";

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

export interface BorrowApprovalTabProps {
  data: BorrowRow[];
  loading: boolean;
  currentRole?: "ADMIN" | "KARYAWAN" | "BOS";
  onApproveAdmin: (row: BorrowRow) => Promise<void>;
  onApproveBoss: (row: BorrowRow) => Promise<void>;
  onReject: (row: BorrowRow, note?: string) => Promise<void>;
}

/** Payload create borrow */
export interface CreateBorrowPayload {
  id_asset_stock: number;
  borrower_id?: number;
  quantity: number;
  due_date:string;
}

/** Payload return (sesuaikan dengan UpdateData kamu) */
export interface ReturnPayload {
  // status: "DIKEMBALIKAN" | string;
   image_after_return: string;
  // optional: returned_date?: string;
  // optional: notes?: string;
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
   onCancel?: (
    row: BorrowRow,
    payload?: {
      cancel_note?: string;
    }
  ) => Promise<void>;
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
export interface BorrowFormData {
  borrower_id: number | "";
  quantity: number;
  due_date:string;
}