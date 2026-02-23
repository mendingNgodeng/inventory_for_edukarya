// api/assets/types.ts

export interface data {
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
  };
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  id_asset_stock: number;
  cost: number;
  quantity: number;
  description: string;

}
export interface UpdateData {
  id_asset_stock?: number;
  cost?: number;
  quantity?: number;
  description?: string;

}