// api/ASSET_USE/service.ts

import { privateClient,publicClient} from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  data,
  CreateData,
  UpdateData,
  ApiResponse
} from './types';

export class dataService {
static async getAll(): Promise<data[]> {
  const { data } = await publicClient.get<ApiResponse<data[]>>(
    ENDPOINTS.ASSET_USE
  );
  return data.data; // ambil array di dalamnya
}

static async getById(id: number): Promise<data> {
  const { data } = await publicClient.get<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_USE}/${id}`
  );

  return data.data;
}

static async createUsed(payload: CreateData): Promise<data> {
  const { data } = await privateClient.post<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_USE}/used`,
    payload
  );

  return data.data;
}

static async createBorrow(payload: CreateData): Promise<data> {
  const { data } = await publicClient.post<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_USE}/borrow`,
    payload
  );

  return data.data;
}

static async returnAsset(
  id: number,
  payload: UpdateData
): Promise<data> {
  const { data } = await publicClient.put<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_USE}/${id}/return`,
    payload
  );

  return data.data;
}

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.ASSET_USE}/${id}`);
  }
}
