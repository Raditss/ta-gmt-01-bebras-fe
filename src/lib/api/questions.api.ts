import {API_URL, apiCore} from "./core";
import {QuestionTypeEnum} from "@/types/question-type.type";
import {
  CreateQuestionDraftRequest, CreateQuestionMetadataRequest, CreateQuestionSubmitRequest,
  GeneratedQuestionResponse,
  QuestionResponse, UpdateQuestionRequest
} from "@/utils/validations/question.validation";

export const questionsApi = {
  async getQuestions() {
    const response = await apiCore.get<QuestionResponse[]>("/questions");
    return response.data;
  },

  async getQuestionById(id: string): Promise<QuestionResponse> {
    const response = await apiCore.get<QuestionResponse>(`/questions/${id}`);
    return response.data;
  },

  async generateQuestion(
      type: QuestionTypeEnum,
  ): Promise<GeneratedQuestionResponse> {
    const response = await apiCore.post<GeneratedQuestionResponse>(
        `/questions/generate`,
        {
          type,
        }
    );
    return response.data;
  },

  async createQuestionMetadata(createQuestionMetadataPayload: CreateQuestionMetadataRequest): Promise<QuestionResponse> {
    try {
      const response = await apiCore.post<QuestionResponse>(
          `/questions/metadata`,
          createQuestionMetadataPayload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createQuestionDraft(createQuestionDraftPayload: CreateQuestionDraftRequest): Promise<QuestionResponse> {
    try {
      const { id: _id, ...payload } = createQuestionDraftPayload;
      const response = await apiCore.post<QuestionResponse>(
          `/questions`,
          payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateQuestion(updateQuestionPayload: UpdateQuestionRequest, id: number): Promise<QuestionResponse> {
    try {
      const response = await apiCore.patch<QuestionResponse>(
          `/questions/${id}`,
          updateQuestionPayload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateQuestionSync(updateQuestionPayload: UpdateQuestionRequest, id: number): void {
    try {
      if (!navigator.sendBeacon) throw new Error("sendBeacon is not supported in this browser");
      navigator.sendBeacon(
          `${API_URL}/api/questions/${id}`,
          JSON.stringify(updateQuestionPayload)
      );
    } catch (error) {
      throw new Error(`Failed to update question synchronously: ${error}`);
    }
  },

  async submitQuestion(createQuestionSubmitPayload: CreateQuestionSubmitRequest): Promise<QuestionResponse> {
    try {
      const { id: _id, ...payload } = createQuestionSubmitPayload;
      const response = await apiCore.post<QuestionResponse>(
          `/questions`,
          payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
