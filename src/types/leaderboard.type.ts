export enum TimeFrame {
  ALL_TIME = 'all-time',
  LAST_MONTH = 'last-month',
  LAST_WEEK = 'last-week'
}

export interface LeaderboardItem {
  user: {
    id: number;
    name: string;
    username: string;
    photoUrl: string | null;
  };
  points: number;
  streak: number;
  order: number;
  solved: number;
}

export interface LeaderboardApiResponse {
  topTen: LeaderboardItem[];
  currentUser: LeaderboardItem;
  totalPlayers: number;
}

export interface LeaderboardData {
  topTen: LeaderboardItem[];
  currentUser: LeaderboardItem;
  totalPlayers: number;
}
