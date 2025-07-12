import { apiCore } from './core';
import { LeaderboardApiResponse, TimeFrame } from '@/types/leaderboard.type';

export const leaderboardApi = {
  /**
   * Fetch leaderboard data for a specific timeframe
   */
  async getLeaderboard(
    timeFrame: TimeFrame = TimeFrame.ALL_TIME
  ): Promise<LeaderboardApiResponse> {
    try {
      const response = await apiCore.get<LeaderboardApiResponse>(
        `/leaderboard?timeFrame=${timeFrame}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      throw new Error('Failed to fetch leaderboard data');
    }
  }
};
