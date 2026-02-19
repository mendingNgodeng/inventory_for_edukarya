// api/user/types.ts

export interface data {
  id_user: number;
  name: string;
  jabatan: string;
  no_hp: string;

}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateData {
  name: string;
  jabatan: string;
  no_hp: string;
}

export interface UpdateData {
  name?: string;
  jabatan?: string;
  no_hp?: string;
}
