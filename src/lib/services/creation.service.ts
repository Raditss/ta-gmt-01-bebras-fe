import { QuestionTypeEnum } from "@/types/question-type.type";
import {questionsApi} from "@/lib/api";
import {Question} from "@/types/question.type";
import {CreateQuestionDraftRequest, CreateQuestionSubmitRequest} from "@/utils/validations/question.validation";

export interface CreationData {
  questionId: string;
  creatorId: number;
  title: string;
  description: string;
  category: string;
  points: number;
  estimatedTime: number;
  author: string;
  questionType: QuestionTypeEnum;
  content: string;
  isPublished: boolean;
  lastModified: Date;
  hasContent?: boolean;
}


export const creationService = {
  async getCreationData(id: string): Promise<Question> {
    if (id === "new" || id.startsWith("temp-")) {
      throw new Error(
        "Cannot fetch creation data for new or temporary questions. Use local creation instead."
      );
    }

    const response = await questionsApi.getQuestionById(id);
    const question = response.props;

    if (question.isPublished) {
      throw new Error("QUESTION_ALREADY_SUBMITTED");
    }

    return question;
  },

  async saveDraft(createQuestionDraft: CreateQuestionDraftRequest): Promise<Question> {
    createQuestionDraft.isPublished = false;
    if (typeof createQuestionDraft.id === 'string' && createQuestionDraft.id.startsWith("temp-")) {
      const response = await questionsApi.createQuestionDraft(createQuestionDraft);
      const newQuestion = response.props;
      
      if (!newQuestion.id) {
        throw new Error("Failed to get question ID from backend response");
      }

      return newQuestion;
    } else {
      const { id: questionId, ...payload } = createQuestionDraft;
      if (typeof questionId !== 'number') throw new Error("Invalid question ID type");
      const response = await questionsApi.updateQuestion(payload, questionId);
      return response.props;
    }
  },

  saveDraftSync(createQuestionDraft: CreateQuestionDraftRequest) {
    try {
      const { id: questionId, ...payload } = createQuestionDraft;
      if (typeof questionId !== 'number') throw new Error("Invalid question ID type");
      questionsApi.updateQuestionSync(payload, questionId);
    } catch (error) {
      throw new Error(`Failed to save draft synchronously: ${error}`);
    }
  },

  async submitCreation(createQuestion: CreateQuestionSubmitRequest): Promise<Question> {
    createQuestion.isPublished = true;
    if (typeof createQuestion.id === 'string' && createQuestion.id.startsWith("temp-")) {
      const response = await questionsApi.submitQuestion(createQuestion);
      const newQuestion = response.props;

      if (!newQuestion.id) {
        throw new Error("Failed to get question ID from backend response");
      }

      return newQuestion;
    } else {
      const { id: questionId, ...payload } = createQuestion;
      if (typeof questionId !== 'number') throw new Error("Invalid question ID type");
      const response = await questionsApi.updateQuestion(payload, questionId);
      return response.props;
    }
  },
};
