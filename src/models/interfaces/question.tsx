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
  private title: string;
  private duration: number;
  private startTime: Date;

  protected constructor(
    id: number,
    title: string,
    questionType: QuestionTypeEnum,
    duration: number,
    startTime: Date
  ) {
    this.id = id;
    this.type = questionType;
    this.title = title;
    this.duration = duration;
    this.startTime = startTime;
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

  getTitle() {
    return this.title;
  }

  getDuration() {
    return this.duration;
  }

  getStartTime() {
    return this.startTime;
  }

  getQuestionType() {
    return this.type;
  }
}
