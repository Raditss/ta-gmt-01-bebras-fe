import { QuestionTypeEnum } from '@/types/question-type.type';
import { QuestionAttemptData } from '@/types/question-attempt.type';

export interface IAttempt {
  setAttemptData(duration: number, isDraft: boolean): void;

  getAttemptData(): QuestionAttemptData;

  toJSON(): string;

  loadAnswer(json: string): void;
}

export abstract class IQuestion {
  private readonly _id: number;
  private readonly _type: QuestionTypeEnum;

  protected constructor(id: number, questionType: QuestionTypeEnum) {
    this._id = id;
    this._type = questionType;
  }

  abstract populateQuestionFromString(questionString: string): void;

  abstract resetToInitialState(): void;

  get id() {
    return this._id;
  }

  getQuestionType() {
    return this._type;
  }
}
