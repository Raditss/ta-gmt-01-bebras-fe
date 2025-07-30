export interface DashboardApiResponse {
  stats: {
    points: number;
    totalPoints: number;
    streakDays: number;
    weeklyGrind: boolean[];
    completedQuestions: number;
  };
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    earned: boolean;
    category: string;
  }>;
  recentActivity: Array<{
    id: number;
    questionId: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'completed' | 'in-progress';
    completedAt: string;
    pointsEarned: number;
  }>;
  questionStatistics: Array<{
    questionTypeId: number;
    questionTypeName: string;
    completedQuestions: number;
    totalQuestions: number;
  }>;
}
