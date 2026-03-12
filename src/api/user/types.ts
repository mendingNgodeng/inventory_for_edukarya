// api/user/types.ts

export interface data {
  id_user: number;
  name: string;
  username: string;
  password: string;
  role:string;
  jabatan?: string;
  no_hp?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
export interface CreateData {
  name: string;
  username: string;
  password: string;
  role:string;
  jabatan?: string;
  no_hp?: string;
}

export interface UpdateData {
  name?:string;
  username?: string;
  password?: string;
  // role?:string;
  jabatan?: string;
  no_hp?: string;
}
