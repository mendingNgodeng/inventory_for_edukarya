// api/location/types.ts

export interface Location {
  id_location: number;
  name: string;
  description: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
export interface CreateLocationDTO {
  name: string;
  description: string;
}

export interface UpdateLocationDTO {
  name?: string;
  description?: string;
}
