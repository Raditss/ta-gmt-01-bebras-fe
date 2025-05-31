export interface ICreateQuestion {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  points: number;
  estimatedTime: number;
  author: string;
}

export interface IQuestion extends ICreateQuestion {
  id: string;
  content: string;
  isGenerated: boolean;
  duration: number; // Total time spent on this question
}

export interface IAttempt {
  questionId: string;
  userId: string;
  startTime: Date;
  duration: number;
  status: 'in-progress' | 'completed' | 'paused';
} 