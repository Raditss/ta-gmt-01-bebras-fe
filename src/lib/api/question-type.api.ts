import {QuestionTypeResponse} from "@/utils/validations/question-type.validation";
import {apiCore} from "@/lib/api/core";

export const questionTypeApi = {
  async getQuestionTypes(): Promise<QuestionTypeResponse[]> {
    const response = await apiCore.get<QuestionTypeResponse[]>("/question-types");
    return response.data;
  },
}