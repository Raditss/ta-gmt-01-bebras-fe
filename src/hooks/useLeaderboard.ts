import { useState, useEffect, useCallback } from 'react';
import { LeaderboardData, TimeFrame } from '@/types/leaderboard.type';
import { gamificationApi } from '@/lib/api';

export const useLeaderboard = (timeFrame: TimeFrame = TimeFrame.ALL_TIME) => {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiResponse = await gamificationApi.getLeaderboard(timeFrame);

      // Use real API data directly without mock processing
      const newLeaderboardData: LeaderboardData = {
        topTen: apiResponse.topTen,
        currentUser: apiResponse.currentUser,
        totalPlayers: apiResponse.totalPlayers
      };

      setLeaderboardData(newLeaderboardData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch leaderboard data'
      );

      // Set fallback data on error
      const fallbackData: LeaderboardData = {
        topTen: [],
        currentUser: {
          user: {
            props: {
              id: 0,
              username: 'user',
              name: 'You',
              photoUrl: null,
              role: 'STUDENT',
              status: 'ACTIVE',
              createdAt: '',
              updatedAt: '',
              verifiedAt: null
            }
          },
          order: 0,
          points: 0,
          streak: 0,
          badges: 0,
          solved: 0
        },
        totalPlayers: 0
      };
      setLeaderboardData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, [timeFrame]);

  // Refresh data manually
  const refresh = useCallback(async () => {
    await fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Auto-refresh on mount and when timeFrame changes
  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  return {
    // Data
    leaderboardData,
    topTen: leaderboardData?.topTen || [],
    currentUser: leaderboardData?.currentUser || null,
    totalPlayers: leaderboardData?.totalPlayers || 0,

    // State
    isLoading,
    error,
    lastUpdated,

    // Actions
    refresh
  };
};
