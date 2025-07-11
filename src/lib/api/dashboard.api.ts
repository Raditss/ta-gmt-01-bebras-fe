import { apiCore } from './core';
import { DashboardApiResponse } from '@/types/dashboard.type';

export const dashboardApi = {
  /**
   * Fetch all dashboard data for the current user (processed by backend)
   */
  async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      const response = await apiCore.get<DashboardApiResponse>(
        '/question-attempts/dashboard-stats'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
};
