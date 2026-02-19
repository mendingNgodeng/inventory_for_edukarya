// api/location/service.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  data,
  CreateData,
  UpdateData,
  ApiResponse
} from './types';

export class dataService {
static async getAll(): Promise<data[]> {
  const { data } = await apiClient.get<ApiResponse<data[]>>(
    ENDPOINTS.RENTAL_CUSTOMER
  );
  return data.data; // ambil array di dalamnya
}


static async getById(id: number): Promise<data> {
  const { data } = await apiClient.get<ApiResponse<data>>(
    `${ENDPOINTS.RENTAL_CUSTOMER}/${id}`
  );
  return data.data;
}

static async create(payload: CreateData): Promise<data> {
  const { data } = await apiClient.post<ApiResponse<data>>(
    ENDPOINTS.RENTAL_CUSTOMER,
    payload
  );

  return data.data;
}

static async update(
  id: number,
  payload: UpdateData
): Promise<data> {
  const { data } = await apiClient.put<ApiResponse<data>>(
    `${ENDPOINTS.RENTAL_CUSTOMER}/${id}`,
    payload
  );

  return data.data;
}

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.RENTAL_CUSTOMER}/${id}`);
  }
}
