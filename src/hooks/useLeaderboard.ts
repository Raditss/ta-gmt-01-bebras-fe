import { useCallback, useEffect, useState } from 'react';
import {
  LeaderboardData,
  LeaderboardItem,
  TimeFrame
} from '@/types/leaderboard.type';
import { gamificationApi } from '@/lib/api';

// Mock data for fields not provided by backend yet
const mockUserStats = (item: LeaderboardItem): LeaderboardItem => {
  // Mock solved problems based on points (roughly points/10)
  const solved = Math.floor(item.points / 10) + Math.floor(Math.random() * 20);

  // Mock badge based on points
  let badge = 'Beginner';
  if (item.points >= 2000) badge = 'Expert';
  else if (item.points >= 1500) badge = 'Advanced';
  else if (item.points >= 1000) badge = 'Intermediate';

  return {
    ...item,
    solved,
    badge
  };
};

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

      // Add mock data for fields not provided by backend
      const topTenWithMockData = apiResponse.topTen.map((item) =>
        mockUserStats(item)
      );

      const currentUserWithMockData = mockUserStats(apiResponse.currentUser);

      // Calculate total players (mock for now)
      const totalPlayers = Math.max(1247, apiResponse.topTen.length * 125);

      const newLeaderboardData: LeaderboardData = {
        topTen: topTenWithMockData,
        currentUser: currentUserWithMockData,
        totalPlayers
      };

      setLeaderboardData(newLeaderboardData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch leaderboard data'
      );

      // Set fallback data on error (the current mock data)
      const fallbackData: LeaderboardData = {
        topTen: [
          {
            order: 1,
            name: 'Radit',
            points: 2350,
            streak: 28,
            badges: 12,
            solved: 245,
            badge: 'Expert'
          },
          {
            order: 2,
            name: 'Bayu',
            points: 2120,
            streak: 15,
            badges: 10,
            solved: 198,
            badge: 'Advanced'
          },
          {
            order: 3,
            name: 'Rere',
            points: 1980,
            streak: 22,
            badges: 9,
            solved: 187,
            badge: 'Advanced'
          },
          {
            order: 4,
            name: 'Naufal',
            points: 1850,
            streak: 12,
            badges: 10,
            solved: 165,
            badge: 'Intermediate'
          },
          {
            order: 5,
            name: 'Sekar',
            points: 1790,
            streak: 8,
            badges: 8,
            solved: 156,
            badge: 'Intermediate'
          },
          {
            order: 6,
            name: 'Ardhi',
            points: 1720,
            streak: 18,
            badges: 7,
            solved: 142,
            badge: 'Intermediate'
          },
          {
            order: 7,
            name: 'Maya',
            points: 1650,
            streak: 5,
            badges: 7,
            solved: 134,
            badge: 'Beginner'
          },
          {
            order: 8,
            name: 'James',
            points: 1540,
            streak: 14,
            badges: 6,
            solved: 128,
            badge: 'Beginner'
          }
        ],
        currentUser: {
          order: 156,
          name: 'You',
          points: 1285,
          streak: 3,
          badges: 12,
          solved: 128,
          badge: 'Intermediate'
        },
        totalPlayers: 1247
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
