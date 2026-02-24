// api/user/types.ts

export interface data {
  id_rental_customer: number;
  name: string;
  phone: string;
  pictureKtp:string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  name: string;
  phone: string;
  pictureKtp:string;
}

export interface UpdateData {
  name?: string;
  phone?: string;
}
