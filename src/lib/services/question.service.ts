import { questionsApi } from '@/lib/api';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import {
  GeneratedQuestionAttemptRequest,
  GeneratedQuestionAttemptResponse,
  SaveDraftRequest,
  SubmitAnswerRequest
} from '@/utils/validations/question-attempt.validation';
import { Question } from '@/types/question.type';
import { QuestionTypeEnum } from '@/types/question-type.type';
export const questionService = {
  async getQuestionById(id: string): Promise<Question> {
    if (id === 'new') {
      throw new Error(
        'questionService.getQuestionById: Cannot fetch question for new or temporary questions'
      );
    }

    const response = await questionsApi.getQuestionById(id);
    const question = response.props;

    let parsedContent: string;

    // Handle content that might already be parsed (object) or still a string
    let contentObj: Record<string, unknown>;
    if (typeof question.content === 'string') {
      try {
        contentObj = JSON.parse(question.content);
      } catch (_error) {
        console.error('Error parsing question content string:', _error);
        contentObj = {};
      }
    } else {
      // Content is already a parsed object from Prisma
      contentObj = question.content;
    }

    // Transform CFG question content to match the expected structure
    const questionTypeName = question.questionType.name;
    const isCfgQuestion =
      questionTypeName === QuestionTypeEnum.CFG ||
      questionTypeName === 'fish-trader' ||
      questionTypeName === 'CFG';

    if (isCfgQuestion) {
      // The backend data structure already matches what we need
      parsedContent = JSON.stringify(contentObj);
    } else {
      parsedContent =
        typeof question.content === 'string'
          ? question.content
          : JSON.stringify(question.content);
    }

    return {
      ...question,
      content: parsedContent
    };
  },

  async saveDraft(questionAttemptDraft: SaveDraftRequest) {
    return await questionAttemptApi.saveDraft(questionAttemptDraft);
  },

  saveDraftSync(questionAttemptDraft: SaveDraftRequest) {
    try {
      questionAttemptApi.saveDraftSync(questionAttemptDraft);
    } catch (_error) {
      // Silent fail for sync save
    }
  },

  async submitAttempt(questionAttemptSubmit: SubmitAnswerRequest) {
    return await questionAttemptApi.submit(questionAttemptSubmit);
  },

  async getLatestAttempt(questionId: string) {
    try {
      return await questionAttemptApi.getLatestAttempt(questionId);
    } catch (_error) {
      return null;
    }
  },

  async checkGeneratedAnswer(
    data: GeneratedQuestionAttemptRequest
  ): Promise<GeneratedQuestionAttemptResponse> {
    const response = await questionAttemptApi.checkGeneratedAnswer(data);
    return response;
  }
};
