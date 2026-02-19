// api/assetCategories/types.ts

export interface data {
  id_asset_types: number;
  name: string;
  description: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  name: string;
  description: string;
}

export interface UpdateData {
  name?: string;
  description?: string;
}
