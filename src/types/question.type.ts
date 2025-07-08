import {questionResponseSchema} from "@/utils/validations/question.validation";
import {z} from "zod";
import {Dayjs} from "dayjs";

export type Question = z.infer<typeof questionResponseSchema>["props"];

export interface QuestionCreation {
  id: string | number;
  questionTypeId: number;
  title: string;
  content: string;
  isPublished: boolean;
  points: number;
  estimatedTime: number;
  lastModified?: Dayjs; // updatedAt
}