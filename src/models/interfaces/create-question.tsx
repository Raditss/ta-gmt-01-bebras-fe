import { CreateQuestionDraftRequest as CreateQuestionDraft } from "@/utils/validations/question.validation";

export abstract class ICreateQuestion {
  private _createQuestionDraft: CreateQuestionDraft;

  protected constructor(
    questionTypeId: number,
    content: string = "{}",
    isPublished: boolean = false,
    title: string = "New Question",
    points: number = 0,
    estimatedTime: number = 0,
    id?: string | number,
  ) {
    this._createQuestionDraft = {
      id,
      questionTypeId,
      content,
      isPublished,
      title,
      points,
      estimatedTime,
    };
  }

  abstract contentToString(): string;
  abstract populateFromContentString(contentString: string): void;

  get createQuestionDraft(): CreateQuestionDraft {
    return this._createQuestionDraft;
  }

  set createQuestionDraft(value: CreateQuestionDraft) {
    this._createQuestionDraft = value;
  }
}
