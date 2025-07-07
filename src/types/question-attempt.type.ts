export enum QuestionAttemptStatusEnum {
  PAUSED = "paused",
  COMPLETED = "completed",
}

export interface QuestionAttemptData {
  questionId: number;
  duration: number;
  isDraft: boolean;
  answer: string;
}