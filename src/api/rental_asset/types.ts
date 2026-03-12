//src/api/rental_asset/types.ts


export type RentalStatus = "AKTIF" | "SELESAI" | "DIBATALKAN";

export interface RentalCustomerLite {
  id_rental_customer: number;
  name: string;
  phone?: string | null;
  pictureKtp?: string | null;
}

export interface AssetLite {
  asset_code: string;
  asset_name: string;
  rental_price:number;
  is_rentable?: boolean;
}

export interface LocationLite {
  name: string;
}

export interface AssetStockLite {
  id_asset_stock: number;
  id_asset?: number;
  id_location?: number;
  condition?: string;
  status?: string;
  quantity?: number;

  asset?: AssetLite;
  location?: LocationLite;
}

export interface data {
  id_asset_rental: number;
  id_rental_customer: number;
  id_asset_stock: number;
  quantity: number;
  rental_start: string; 
  rental_end: string;   
  price: number;
  status: RentalStatus;
  image_after_rental?: string | null;
  assetStock?: AssetStockLite;
  customer?: RentalCustomerLite;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface CreateData {
  id_rental_customer: number;
  id_asset_stock: number;
  quantity: number;
  rental_start: string; // kirim ISO string
  rental_end: string;   // kirim ISO string
  price: number;
  status?: RentalStatus; // optional (default AKTIF)
}

export interface UpdateData {
  rental_start?: string;
  rental_end?: string;
  price?: number;
  status?: RentalStatus;
}

export interface FinishPayload {
  image_after_rental?: string; // base64 optional
}