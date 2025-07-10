import { apiCore } from './core';
import { QuestionTypeEnum } from '@/types/question-type.type';
import {
  CreateQuestionMetadataRequest,
  CreateQuestionSubmitRequest,
  GeneratedQuestionResponse,
  QuestionResponse,
  UpdateQuestionRequest
} from '@/utils/validations/question.validation';

interface GetQuestionsParams {
  skip?: number;
  take?: number;
  search?: string;
}

interface QuestionsApiResponse {
  data: QuestionResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const questionsApi = {
  async getQuestions(
    params?: GetQuestionsParams
  ): Promise<QuestionsApiResponse> {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) {
      searchParams.append('skip', params.skip.toString());
    }
    if (params?.take !== undefined) {
      searchParams.append('take', params.take.toString());
    }
    if (params?.search && params.search.trim()) {
      searchParams.append('search', params.search.trim());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/questions?${queryString}` : '/questions';

    const response = await apiCore.get<QuestionsApiResponse>(url);
    return response.data;
  },

  async getQuestionById(id: string): Promise<QuestionResponse> {
    const response = await apiCore.get<QuestionResponse>(`/questions/${id}`);
    return response.data;
  },

  async generateQuestion(
    type: QuestionTypeEnum
  ): Promise<GeneratedQuestionResponse> {
    const response = await apiCore.post<GeneratedQuestionResponse>(
      `/questions/generate`,
      {
        type
      }
    );
    return response.data;
  },

  async createQuestionMetadata(
    createQuestionMetadataPayload: CreateQuestionMetadataRequest
  ): Promise<QuestionResponse> {
    const response = await apiCore.post<QuestionResponse>(
      `/questions/metadata`,
      createQuestionMetadataPayload
    );
    return response.data;
  },

  async updateQuestion(
    updateQuestionPayload: UpdateQuestionRequest,
    id: number
  ): Promise<QuestionResponse> {
    const response = await apiCore.patch<QuestionResponse>(
      `/questions/${id}`,
      updateQuestionPayload
    );
    return response.data;
  },

  async submitQuestion(
    createQuestionSubmitPayload: CreateQuestionSubmitRequest
  ): Promise<QuestionResponse> {
    const { id: _id, ...payload } = createQuestionSubmitPayload;
    const response = await apiCore.post<QuestionResponse>(
      `/questions`,
      payload
    );
    return response.data;
  }
};
