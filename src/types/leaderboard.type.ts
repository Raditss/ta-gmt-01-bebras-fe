export enum TimeFrame {
  ALL_TIME = 'all-time',
  LAST_MONTH = 'last-month',
  LAST_WEEK = 'last-week'
}

export interface LeaderboardItem {
  user: {
    props: {
      id: number;
      username: string;
      name: string;
      photoUrl: string | null;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      verifiedAt: string | null;
    };
  };
  points: number;
  streak: number;
  badges: number;
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
