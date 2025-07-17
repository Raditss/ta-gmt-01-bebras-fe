import {questionsApi} from "@/lib/api";
import {Question} from "@/types/question.type";
import {CreateQuestionSubmitRequest, UpdateQuestionRequest} from "@/utils/validations/question.validation";


export const creationService = {
  async getCreateQuestionData(id: string): Promise<Question> {
    const response = await questionsApi.getQuestionById(id);
    const question = response.props;

    if (question.isPublished) {
      throw new Error("QUESTION_ALREADY_SUBMITTED");
    }

    return question;
  },

  async updateCreateQuestion(questionId: number, updateQuestionRequest: UpdateQuestionRequest): Promise<Question> {
    const response = await questionsApi.updateQuestion(updateQuestionRequest, questionId);
    return response.props;
  },

  async submitCreateQuestion(createQuestion: CreateQuestionSubmitRequest): Promise<Question> {
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
