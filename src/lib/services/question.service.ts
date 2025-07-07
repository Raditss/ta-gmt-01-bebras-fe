import {questionsApi} from "@/lib/api";
import {questionAttemptApi} from "@/lib/api/question-attempt.api";
import {
  GeneratedQuestionAttemptRequest,
  GeneratedQuestionAttemptResponse, SaveDraftRequest, SubmitAnswerRequest
} from "@/utils/validations/question-attempt.validation";
import {Question} from "@/types/question.type";


export const questionService = {
  async getQuestionById(id: string): Promise<Question> {
    if (id === "new") {
      throw new Error(
        "questionService.getQuestionById: Cannot fetch question for new or temporary questions"
      );
    }

    try {
      const response = await questionsApi.getQuestionById(id);
      const question = response.props;

      let parsedContent: string;
      try {
        JSON.parse(question.content);
        parsedContent = question.content;
      } catch {
        parsedContent = question.content;
      }

      return {
        ...question,
        content: parsedContent,
      };
    } catch (error) {
      console.error(
        "🚨 DEBUG: Error in questionService.getQuestionById:",
        error
      );
      throw error;
    }
  },
  
  async saveDraft(questionAttemptDraft: SaveDraftRequest) {
    try {
      return await questionAttemptApi.saveDraft(
        questionAttemptDraft
      );
    } catch (error) {
      throw error;
    }
  },

  saveDraftSync(questionAttemptDraft: SaveDraftRequest) {
    try {
      questionAttemptApi.saveDraftSync(questionAttemptDraft);
    } catch (error) {
      console.error('🚨 DEBUG: Error in saveDraftSync:', error);
    }
  },

  async submitAttempt(questionAttemptSubmit: SubmitAnswerRequest) {
    try {
      return await questionAttemptApi.submit(
        questionAttemptSubmit
      );
    } catch (error) {
      console.error("🚨 DEBUG: Error in submitAttempt:", error);
      throw error;
    }
  },

  async getLatestAttempt(questionId: string) {
    try {
      return await questionAttemptApi.getLatestAttempt(questionId)
    } catch (error) {
      console.error("🚨 DEBUG: Error in getLatestAttempt:", error);
      return null;
    }
  },

  async checkGeneratedAnswer(
    data: GeneratedQuestionAttemptRequest
  ): Promise<GeneratedQuestionAttemptResponse> {
    try {
      const response = await questionAttemptApi.checkGeneratedAnswer(data);
      return response;
    } catch (error) {
      console.error("🚨 DEBUG: Error in checkGeneratedAnswer:", error);
      throw error;
    }
  },
};
