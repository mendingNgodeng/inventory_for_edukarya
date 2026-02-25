//src/api/rental_asset/service.ts

import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, data, CreateData, UpdateData, FinishPayload } from "./types";

export class rentalAssetService {
  static async getAll(): Promise<data[]> {
    const res = await apiClient.get<ApiResponse<data[]>>(ENDPOINTS.ASSET_RENTAL);
    return res.data.data;
  }

  static async getById(id: number): Promise<data> {
    const res = await apiClient.get<ApiResponse<data>>(`${ENDPOINTS.ASSET_RENTAL}/${id}`);
    return res.data.data;
  }

  static async create(payload: CreateData): Promise<data> {
    const res = await apiClient.post<ApiResponse<data>>(ENDPOINTS.ASSET_RENTAL, payload);
    return res.data.data;
  }

  static async update(id: number, payload: UpdateData): Promise<data> {
    const res = await apiClient.put<ApiResponse<data>>(`${ENDPOINTS.ASSET_RENTAL}/${id}`, payload);
    return res.data.data;
  }

  static async finish(id: number, payload?: FinishPayload): Promise<data> {
    const res = await apiClient.put<ApiResponse<data>>(
      `${ENDPOINTS.ASSET_RENTAL}/${id}/finish`,
      payload ?? {}
    );
    return res.data.data;
  }

  static async cancel(id: number): Promise<data> {
    const res = await apiClient.put<ApiResponse<data>>(
      `${ENDPOINTS.ASSET_RENTAL}/${id}/cancel`,
      {}
    );
    return res.data.data;
  }

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.ASSET_RENTAL}/${id}`);
  }
}