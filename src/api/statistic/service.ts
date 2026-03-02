import { privateClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse, CtgRankByStock, DashboardSummary } from './types';

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
  
}