// api/assets/types.ts
export type BorrowStatus =
  | "MENUNGGU_ADMIN"
  | "MENUNGGU_BOS"
  | "DITOLAK"
  | "DIPAKAI"
  | "DIPINJAM"
  | "DIKEMBALIKAN"
  | "TERLAMBAT";

export interface data {
  id_asset_borrowed:number;
  id_asset_stock: number;
  id_user: any;
  quantity: number;
  borrowed_date:string,
  returned_date: string;
  status: BorrowStatus;

  due_date:Date;
  late_days:number;

  requested_by_id?: number | null;
  admin_approved_by_id?: number | null;
  admin_approved_at?: string | null;
  boss_approved_by_id?: number | null;
  boss_approved_at?: string | null;
  rejected_by_id?: number | null;
  rejected_at?: string | null;
  approval_note?: string | null;

  requestedBy?: BorrowApprovalUserLite | null;
adminApprovedBy?: BorrowApprovalUserLite | null;
bossApprovedBy?: BorrowApprovalUserLite | null;
rejectedBy?: BorrowApprovalUserLite | null;

  assetStock: {
    asset: {
      asset_name:string;
      asset_code:string;
    };
    location:{
      name:string;
    }
  };
  user: {
    id_user?: number;
    name: string;
    jabatan: string;
    no_hp: string;
    role?: "ADMIN" | "KARYAWAN" | "BOS";
  } | null;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
export interface CreateData {
  id_asset_stock: number;
  borrower_id?: any;
  quantity: number;
  due_date:string;
}

export interface UpdateData {
  id_asset_stock?: number;
  borrower_id?: any;
  quantity?: number;
}

export interface RejectBorrowPayload {
  approval_note?: string;
}

export interface BorrowApprovalUserLite {
  id_user: number;
  name: string;
  username?: string;
  role: "ADMIN" | "KARYAWAN" | "BOS";
  jabatan?: string | null;
  no_hp?: string | null;
}