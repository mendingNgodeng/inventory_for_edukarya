//src/api/rental_asset/service.ts

import { privateClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, data, CreateData, UpdateData, FinishPayload,PayRentalPayload } from "./types";

export class rentalAssetService {
  static async getAll(): Promise<data[]> {
    const res = await privateClient.get<ApiResponse<data[]>>(ENDPOINTS.ASSET_RENTAL);
    return res.data.data;
  }

  static async getById(id: number): Promise<data> {
    const res = await privateClient.get<ApiResponse<data>>(`${ENDPOINTS.ASSET_RENTAL}/${id}`);
    return res.data.data;
  }

  static async create(payload: CreateData): Promise<data> {
    const res = await privateClient.post<ApiResponse<data>>(ENDPOINTS.ASSET_RENTAL, payload);
    return res.data.data;
  }

  static async update(id: number, payload: UpdateData): Promise<data> {
    const res = await privateClient.put<ApiResponse<data>>(`${ENDPOINTS.ASSET_RENTAL}/${id}`, payload);
    return res.data.data;
  }

  static async finish(id: number, payload?: FinishPayload): Promise<data> {
    const res = await privateClient.put<ApiResponse<data>>(
      `${ENDPOINTS.ASSET_RENTAL}/${id}/finish`,
      payload ?? {}
    );
    return res.data.data;
  }
static async pay(id: number, payload: PayRentalPayload): Promise<data> {
    const res = await privateClient.put<ApiResponse<data>>(
      `${ENDPOINTS.ASSET_RENTAL}/${id}/pay`,
      payload
    );
    return res.data.data;
  }

  static async cancel(id: number): Promise<data> {
    const res = await privateClient.put<ApiResponse<data>>(
      `${ENDPOINTS.ASSET_RENTAL}/${id}/cancel`,
      {}
    );
    return res.data.data;
  }

  static async delete(id: number): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.ASSET_RENTAL}/${id}`);
  }
    static async deleteAllNonActive(): Promise<void> {
    await privateClient.delete(`${ENDPOINTS.ASSET_RENTAL}/nonActive`);
  }
}