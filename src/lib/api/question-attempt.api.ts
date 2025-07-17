import {
  GeneratedQuestionAttemptRequest, GeneratedQuestionAttemptResponse,
  QuestionAttemptResponse,
  SaveDraftRequest,
  SaveDraftResponse,
  SubmitAnswerRequest, SubmitAnswerResponse
} from "@/utils/validations/question-attempt.validation";
import {API_URL, apiCore} from "@/lib/api/core";

export const questionAttemptApi = {
  async saveDraft(payload: SaveDraftRequest) {
    try {
      const response = await apiCore.post<SaveDraftResponse>("/question-attempts/save-draft", payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to save draft: ${error}`);
    }
  },

  saveDraftSync(questionAttemptDraft: SaveDraftRequest) {
    try {
      if (!navigator.sendBeacon) throw new Error("sendBeacon is not supported in this browser");
      navigator.sendBeacon(
        `${API_URL}/api/question-attempts/save-draft`,
        JSON.stringify(questionAttemptDraft)
      );
    } catch (error) {
      throw new Error(`Failed to save draft synchronously: ${error}`);
    }
  },

  async submit(payload: SubmitAnswerRequest) {
    try {
      const response = await apiCore.post<SubmitAnswerResponse>("/question-attempts/submit", payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit answer: ${error}`);
    }
  },

  async getLatestAttempt(id: string) {
    try {
      const response = await apiCore.get<QuestionAttemptResponse>(`/question-attempts/latest/${parseInt(id)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch latest attempt: ${error}`);
    }
  },

  async checkGeneratedAnswer(payload: GeneratedQuestionAttemptRequest) {
    try {
      const response = await apiCore.post<GeneratedQuestionAttemptResponse>("/question-attempts/check-generated-answer", payload);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check generated answer: ${error}`);
    }
  }
}