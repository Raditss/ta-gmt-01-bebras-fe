import { apiCore } from './core';
import { LeaderboardApiResponse, TimeFrame } from '@/types/leaderboard.type';
import { DashboardApiResponse } from '@/types/dashboard.type';

export const gamificationApi = {
  /**
   * Fetch all dashboard data for the current user (processed by backend)
   */
  async getDashboardData(): Promise<DashboardApiResponse> {
    try {
      const response = await apiCore.get<DashboardApiResponse>(
        '/gamification/dashboard-stats'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  },

  /**
   * Fetch leaderboard data for a specific timeframe
   */
  async getLeaderboard(
    timeFrame: TimeFrame = TimeFrame.ALL_TIME
  ): Promise<LeaderboardApiResponse> {
    try {
      const response = await apiCore.get<LeaderboardApiResponse>(
        `/gamification/leaderboard?timeFrame=${timeFrame}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      throw new Error('Failed to fetch leaderboard data');
    }
  }
};
