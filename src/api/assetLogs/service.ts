// api/asset-logs/service.ts
import { privateClient } from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse, AssetLogGroup, AssetLogItem } from "./types";

type ListParams = {
  take?: number;
  skip?: number;
};

function withPagination(params?: ListParams) {
  // axios akan ignore undefined
  return {
    params: {
      take: params?.take,
      skip: params?.skip,
    },
  };
}

export class assetLogsService {
  // GET /asset-logs
  static async getAll(params?: ListParams) {
    const { data } = await privateClient.get<ApiResponse<AssetLogItem[]>>(
      ENDPOINTS.ASSET_LOGS,
      withPagination(params)
    );
    return data.data;
  }

  // GET /asset-logs/:id
  static async getById(id: number) {
    const { data } = await privateClient.get<ApiResponse<AssetLogItem>>(
      `${ENDPOINTS.ASSET_LOGS}/${id}`
    );
    return data.data;
  }

  // ✅ OPTIONAL: group endpoint helper
  // contoh: /asset-logs/location, /asset-logs/rental, dst
  static async getByGroup(group: Exclude<AssetLogGroup, "all">, params?: ListParams) {
    const { data } = await privateClient.get<ApiResponse<AssetLogItem[]>>(
      `${ENDPOINTS.ASSET_LOGS}/${group}`,
      withPagination(params)
    );
    return data.data;
  }

  // ✅ OPTIONAL: biar enak dipanggil tanpa inget string group
  static async getLocation(params?: ListParams) {
    return this.getByGroup("location", params);
  }
  static async getRentalCustomer(params?: ListParams) {
    return this.getByGroup("rental-customer", params);
  }
  static async getUser(params?: ListParams) {
    return this.getByGroup("user", params);
  }
  static async getAsset(params?: ListParams) {
    return this.getByGroup("asset", params);
  }
  static async getAssetStock(params?: ListParams) {
    return this.getByGroup("asset-stock", params);
  }
  static async getTypes(params?: ListParams) {
    return this.getByGroup("types", params);
  }
  static async getCategories(params?: ListParams) {
    return this.getByGroup("categories", params);
  }
  static async getRental(params?: ListParams) {
    return this.getByGroup("rental", params);
  }
  static async getBorrow(params?: ListParams) {
    return this.getByGroup("borrow", params);
  }
  static async getMaintenance(params?: ListParams) {
    return this.getByGroup("maintenance", params);
  }
  static async getDeleteHistory(params?: ListParams) {
    return this.getByGroup("delete-history", params);
  }
  static async getOther(params?: ListParams) {
    return this.getByGroup("other", params);
  }
}