// api/location/service.ts

import { privateClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  data,
  CreateData,
  UpdateData,
  ApiResponse
} from './types';

export class dataService {
static async getAll(): Promise<data[]> {
  const { data } = await privateClient.get<ApiResponse<data[]>>(
    ENDPOINTS.TYPES
  );

  return data.data; // ambil array di dalamnya
}


static async getById(id: number): Promise<data> {
  const { data } = await privateClient.get<ApiResponse<data>>(
    `${ENDPOINTS.TYPES}/${id}`
  );

  return data.data;
}

static async create(payload: CreateData): Promise<data> {
  const { data } = await privateClient.post<ApiResponse<data>>(
    ENDPOINTS.TYPES,
    payload
  );

  return data.data;
}

static async update(
  id: number,
  payload: UpdateData
): Promise<data> {
  const { data } = await privateClient.put<ApiResponse<data>>(
    `${ENDPOINTS.TYPES}/${id}`,
    payload
  );

  return data.data;
}

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.TYPES}/${id}`);
  }
}
