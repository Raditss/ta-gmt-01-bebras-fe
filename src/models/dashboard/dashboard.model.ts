import { LucideIcon } from 'lucide-react';

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  earned: boolean;
}

export interface RecentActivity {
  id: number;
  title: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'completed' | 'in-progress';
  color: string;
}

export interface DashboardStats {
  points: number;
  totalPoints: number;
  streakDays: number;
  weeklyGrind: boolean[]; // 7 days, true=completed, false=missed
  level: number;
  trophyCurrent: number;
  trophyTotal: number;
}

export class DashboardData {
  private stats: DashboardStats;
  private achievements: Achievement[];
  private recentActivity: RecentActivity[];

  constructor() {
    // Initialize with default values
    this.stats = {
      points: 0,
      totalPoints: 0,
      streakDays: 0,
      weeklyGrind: [false, false, false, false, false, false, false],
      level: 1,
      trophyCurrent: 0,
      trophyTotal: 50
    };
    this.achievements = [];
    this.recentActivity = [];
  }

  // Getters for stats
  get getStats(): DashboardStats {
    return { ...this.stats };
  }

  get getPoints(): number {
    return this.stats.points;
  }

  get getTotalPoints(): number {
    return this.stats.totalPoints;
  }

  get getStreakDays(): number {
    return this.stats.streakDays;
  }

  get getWeeklyGrind(): boolean[] {
    return [...this.stats.weeklyGrind];
  }

  get getLevel(): number {
    return this.stats.level;
  }

  get getTrophyCurrent(): number {
    return this.stats.trophyCurrent;
  }

  get getTrophyTotal(): number {
    return this.stats.trophyTotal;
  }

  get getProgressPercent(): number {
    if (this.stats.totalPoints === 0) return 0;
    return (this.stats.points / this.stats.totalPoints) * 100;
  }

  get getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  get getRecentActivity(): RecentActivity[] {
    return [...this.recentActivity];
  }

  // Setters for updating data
  updateStats(stats: Partial<DashboardStats>): void {
    this.stats = { ...this.stats, ...stats };
  }

  setPoints(points: number): void {
    this.stats.points = points;
  }

  setTotalPoints(totalPoints: number): void {
    this.stats.totalPoints = totalPoints;
  }

  setStreakDays(streakDays: number): void {
    this.stats.streakDays = streakDays;
  }

  setWeeklyGrind(weeklyGrind: boolean[]): void {
    if (weeklyGrind.length === 7) {
      this.stats.weeklyGrind = [...weeklyGrind];
    }
  }

  setLevel(level: number): void {
    this.stats.level = level;
  }

  setTrophyCurrent(trophyCurrent: number): void {
    this.stats.trophyCurrent = trophyCurrent;
  }

  setAchievements(achievements: Achievement[]): void {
    this.achievements = [...achievements];
  }

  setRecentActivity(recentActivity: RecentActivity[]): void {
    this.recentActivity = [...recentActivity];
  }

  // Calculate level based on points (example logic)
  calculateLevel(): number {
    // Simple level calculation: 100 points per level
    return Math.max(1, Math.floor(this.stats.points / 100) + 1);
  }

  // Calculate trophies based on completed questions
  calculateTrophies(completedQuestions: number): number {
    // Simple trophy calculation: 1 trophy per completed question
    return completedQuestions;
  }

  // Update level and trophies based on current points
  updateDerivedStats(): void {
    this.stats.level = this.calculateLevel();
    // Note: trophyCurrent should be set based on completed questions count
    // This would be calculated from the API data
  }

  // Populate from API response
  populateFromApiResponse(data: {
    stats?: Partial<DashboardStats>;
    achievements?: Achievement[];
    recentActivity?: RecentActivity[];
  }): void {
    if (data.stats) {
      this.updateStats(data.stats);
    }
    if (data.achievements) {
      this.setAchievements(data.achievements);
    }
    if (data.recentActivity) {
      this.setRecentActivity(data.recentActivity);
    }
    this.updateDerivedStats();
  }

  // Convert to JSON for debugging/storage
  toJSON(): string {
    return JSON.stringify({
      stats: this.stats,
      achievements: this.achievements,
      recentActivity: this.recentActivity
    });
  }
}
