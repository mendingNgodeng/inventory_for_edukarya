import { privateClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse, CtgRankByStock,getLatestLogs,BorrowSummary,RentalSummary,DashboardSummary } from './types';

export class dashboardService {
  static async getDashboard() {
      // const start = performance.now();
    const { data } = await privateClient.get<ApiResponse<DashboardSummary>>(
      ENDPOINTS.STATISTIC
    );
//         const end = performance.now();
//  console.log(`Dashboard API response time: ${(end - start).toFixed(2)}ms`);
    return data.data;
  }
  
  static async getCtgRank() {
    const { data } = await privateClient.get<ApiResponse<CtgRankByStock[]>>(
      ENDPOINTS.CTGRANK
    );
    return data.data;
  }
    static async get5logs() {
    const { data } = await privateClient.get<ApiResponse<getLatestLogs[]>>(
      ENDPOINTS.GET5LOGS
    );
    return data.data;
  }

  static async getBorrowSummary() {
    const { data } = await privateClient.get<ApiResponse<BorrowSummary>>(
      ENDPOINTS.BORROW_SUMMARY
    );
    return data.data;
  }

  static async getRentalSummary() {
    const { data } = await privateClient.get<ApiResponse<RentalSummary>>(
      ENDPOINTS.RENTAL_SUMMARY
    );
    return data.data;
  }
}