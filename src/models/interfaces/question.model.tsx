import {QuestionTypeEnum} from "@/types/question-type.type";
import {QuestionAttemptData} from "@/types/question-attempt.type";

export interface IAttempt {
  setAttemptData(
    duration: number,
    isDraft: boolean
  ): void;
  getAttemptData(): QuestionAttemptData;
  toJSON(): string;
  loadAnswer(json: string): void;
}

export abstract class IQuestion {
  private id: number;
  private type: QuestionTypeEnum;

  protected constructor(
    id: number,
    questionType: QuestionTypeEnum,
  ) {
    this.id = id;
    this.type = questionType;
  }

  abstract populateQuestionFromString(questionString: string): void;

  abstract checkAnswer(): boolean;

  abstract questionToString(): string;

  abstract undo(): boolean;

  abstract redo(): boolean;

  abstract resetToInitialState(): void;

  getId() {
    return this.id;
  }

  getQuestionType() {
    return this.type;
  }
}
