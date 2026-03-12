// api/assets/types.ts

export interface data {
  id_assets: number;
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price:number,
  rental_price:number,
  asset_name: string;
  asset_code: string;
  type: {
    name: string;
  };
  category: {
    name: string;
  };
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price:number,
  rental_price:number,
  asset_name: string;
  asset_code: string;
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateData {
 id_asset_types?: number;
  id_asset_categories?: number;
  purchase_price?:number,
  rental_price?:number,
  asset_name?: string;
  is_rentable?: boolean;
  type?: {
    name?: string;
  };
  category?: {
    name?: string;
  };
  created_at?: string;
  updated_at?: string;
}
