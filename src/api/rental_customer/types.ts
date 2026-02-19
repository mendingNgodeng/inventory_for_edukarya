// api/user/types.ts

export interface data {
  id_renta_customer: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}
