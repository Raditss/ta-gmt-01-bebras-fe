export enum TimeFrame {
  ALL_TIME = 'all-time',
  LAST_MONTH = 'last-month',
  LAST_WEEK = 'last-week'
}

export interface LeaderboardItem {
  name: string;
  points: number;
  streak: number;
  badges: number;
  order: number;
  // Mock fields that aren't provided by backend yet
  solved?: number;
  badge?: string;
}

export interface LeaderboardApiResponse {
  topTen: LeaderboardItem[];
  currentUser: LeaderboardItem;
}

export interface LeaderboardData {
  topTen: LeaderboardItem[];
  currentUser: LeaderboardItem;
  totalPlayers: number;
}
