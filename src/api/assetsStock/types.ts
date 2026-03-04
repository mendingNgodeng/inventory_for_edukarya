// api/assetsStock/types.ts

export interface data {
  id_asset_stock: number;
  id_asset: number;
  id_location: number;
  condition:string;
  quantity: number;
  status: string;
  asset: {
    asset_name: string;
    asset_code: string;
    is_rentable: boolean;
    type:{
      name:string,
    }
    category:{
      name:string
    }
  };
  location:{
    name:string
  }
  created_at: string;
  updated_at: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  id_asset: number;
  id_location: number;
  condition:string;
  quantity: number;
}

export interface UpdateData {
  id_asset?: number;
  id_location?: number;
  condition?: string;
  quantity?: number;
  asset?: {
    asset_name: string;
    asset_code: string;
    is_rentable: boolean;
  };
}
