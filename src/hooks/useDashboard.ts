import { useCallback, useEffect, useState } from 'react';
import { DashboardData } from '@/models/dashboard/dashboard.model';
import { Code, Target, Zap } from 'lucide-react';
import { gamificationApi } from '@/lib/api/gamification.api';

// Question statistics type
interface QuestionStatistic {
  questionTypeId: number;
  questionTypeName: string;
  completedQuestions: number;
  totalQuestions: number;
}

// Default achievements with icons - moved outside component to prevent recreation
const defaultAchievements = [
  {
    id: 1,
    title: 'First Blood',
    description: 'Solved your first problem like a boss',
    icon: Code,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    earned: false
  },
  {
    id: 2,
    title: 'Speed Demon',
    description: 'Solved 5 problems in one day!',
    icon: Zap,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    earned: false
  },
  {
    id: 3,
    title: 'Streak Master',
    description: 'Maintained a 7-day solving streak',
    icon: Target,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    earned: false
  }
];

// Default recent activity - moved outside component to prevent recreation
const defaultRecentActivity = [
  {
    id: 1,
    title: 'Welcome to the Platform',
    time: 'Start solving problems',
    difficulty: 'Easy' as const,
    status: 'in-progress' as const,
    color: 'bg-blue-500'
  }
];

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [questionStatistics, setQuestionStatistics] = useState<
    QuestionStatistic[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiResponse = await gamificationApi.getDashboardData();

      // Set question statistics from API response
      setQuestionStatistics(apiResponse.questionStatistics || []);

      // Create new dashboard data instance
      const newDashboardData = new DashboardData();

      // Populate with API data
      newDashboardData.updateStats({
        points: apiResponse.stats.points,
        totalPoints: apiResponse.stats.totalPoints,
        streakDays: apiResponse.stats.streakDays,
        weeklyGrind: apiResponse.stats.weeklyGrind,
        level: Math.max(1, Math.floor(apiResponse.stats.points / 100) + 1),
        trophyCurrent: apiResponse.stats.completedQuestions,
        trophyTotal: 50 // Fixed value for now
      });

      // Map achievements with default icons
      const achievementsWithIcons = defaultAchievements.map((defaultAch) => {
        const apiAch = apiResponse.achievements.find(
          (a) => a.id === defaultAch.id
        );
        return {
          ...defaultAch,
          earned: apiAch?.earned || false
        };
      });
      newDashboardData.setAchievements(achievementsWithIcons);

      // Map recent activity or use default
      const recentActivity =
        apiResponse.recentActivity.length > 0
          ? apiResponse.recentActivity.map((activity) => {
              // Format time relative to now
              const date = new Date(activity.completedAt);
              const now = new Date();
              const diffHours = Math.floor(
                (now.getTime() - date.getTime()) / (1000 * 60 * 60)
              );

              let timeText = '';
              if (diffHours < 1) {
                timeText = 'Just now';
              } else if (diffHours < 24) {
                timeText = `${diffHours} hours ago`;
              } else {
                const diffDays = Math.floor(diffHours / 24);
                timeText =
                  diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
              }

              // Color based on status: drafts are orange, completed are green
              let color = 'bg-green-500'; // completed
              if (activity.status === 'in-progress') color = 'bg-orange-500'; // draft

              return {
                id: activity.id,
                title: activity.title,
                time: timeText,
                difficulty: activity.difficulty, // This is now question type (CFG, CIPHER_N, etc.)
                status: activity.status,
                color
              };
            })
          : defaultRecentActivity;

      newDashboardData.setRecentActivity(recentActivity);

      setDashboardData(newDashboardData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      );

      // Set fallback data on error
      const fallbackData = new DashboardData();
      fallbackData.setAchievements(defaultAchievements);
      fallbackData.setRecentActivity(defaultRecentActivity);
      setDashboardData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data manually
  const refresh = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived values for easy access
  const stats = dashboardData?.getStats || {
    points: 0,
    totalPoints: 100,
    streakDays: 0,
    weeklyGrind: [false, false, false, false, false, false, false],
    level: 1,
    trophyCurrent: 0,
    trophyTotal: 50
  };

  const progressPercent = dashboardData?.getProgressPercent || 0;
  const achievements = dashboardData?.getAchievements || defaultAchievements;
  const recentActivity =
    dashboardData?.getRecentActivity || defaultRecentActivity;

  return {
    // Data
    dashboardData,
    stats,
    achievements,
    recentActivity,
    questionStatistics,

    // Computed values
    progressPercent,

    // State
    isLoading,
    error,
    lastUpdated,

    // Actions
    refresh,

    // Convenience getters
    points: stats.points,
    totalPoints: stats.totalPoints,
    level: stats.level,
    streakDays: stats.streakDays,
    weeklyGrind: stats.weeklyGrind,
    trophyCurrent: stats.trophyCurrent,
    trophyTotal: stats.trophyTotal
  };
};
