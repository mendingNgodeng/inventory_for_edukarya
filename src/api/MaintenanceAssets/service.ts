// api/ASSET_MAINTENANCE/service.ts

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
    ENDPOINTS.ASSET_MAINTENANCE
  );
  return data.data; // ambil array di dalamnya
}


static async getById(id: number): Promise<data> {
  const { data } = await privateClient.get<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_MAINTENANCE}/${id}`
  );

  return data.data;
}

static async createMaintenance(payload: CreateData): Promise<data> {
  const { data } = await privateClient.post<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_MAINTENANCE}`,
    payload
  );

  return data.data;
}

static async returnAsset(
  id: number,
): Promise<data> {
  const { data } = await privateClient.put<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_MAINTENANCE}/${id}/return`,
  );
  return data.data;
}

static async update(
  id: number,
  payload: UpdateData
): Promise<data> {
  const { data } = await privateClient.put<ApiResponse<data>>(
    `${ENDPOINTS.ASSET_MAINTENANCE}/${id}`,
    payload
  );

  return data.data;
}

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.ASSET_MAINTENANCE}/${id}`);
  }
}
