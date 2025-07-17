import { Question } from '@/types/question.type';

export abstract class ICreateQuestion {
  private readonly _draft: Question;

  protected constructor(draft: Question) {
    this._draft = draft;
  }

  abstract toJson(): string;

  abstract populateFromContentString(contentString: string): void;

  abstract hasRequiredContent(): boolean;

  abstract validateContent(): boolean;

  get draft() {
    return this._draft;
  }
}
