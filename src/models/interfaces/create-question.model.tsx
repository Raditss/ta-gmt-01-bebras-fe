import {Question} from "@/types/question.type";

export abstract class ICreateQuestion {
  private readonly _draft: Question;

  protected constructor(question: Question) {
    this._draft = question;
  }

  abstract contentToString(): string;
  abstract populateFromContentString(contentString: string): void;
  abstract hasRequiredContent(): boolean;
  abstract validateContent(): boolean;

  get draft(): Question {
    return this._draft;
  }
}
