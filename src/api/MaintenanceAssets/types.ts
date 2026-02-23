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
// id_asset_borrowed": 3,
//             "id_asset_stock": 5,
//             "id_user": 1,
//             "quantity": 10,
//             "borrowed_date": "2026-02-18T03:54:57.540Z",
//             "returned_date": "2026-02-18T04:46:18.731Z",
//             "status": "DIKEMBALIKAN",
//             "assetStock": {
//                 "id_asset_stock": 5,
//                 "id_asset": 5,
//                 "id_location": 2,
//                 "condition": "BAIK",
//                 "status": "TERSEDIA",
//                 "quantity": 10,
//                 "created_at": "2026-02-16T13:24:13.913Z",
//                 "updated_at": "2026-02-18T15:29:22.545Z",
//                 "asset": {
//                     "asset_code": "enh1",
//                     "asset_name": "laptop Acer"
//                 },
//                 "location": {
//                     "name": "Ruang 2"
//                 }
//             }