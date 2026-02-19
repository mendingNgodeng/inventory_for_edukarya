import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse, DashboardResponse } from './types';

export class dashboardService {
  static async getDashboard() {
    const { data } = await apiClient.get<ApiResponse<DashboardResponse>>(
      ENDPOINTS.STATISTIC
    );

    return data.data;
  }
}
