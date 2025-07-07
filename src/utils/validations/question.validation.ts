import {z} from "zod";
import {jsonStringSchema} from "@/utils/validations/shared.validation";

export const createQuestionDraftRequestSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  questionTypeId: z.number(),
  content: jsonStringSchema.default('{}'),
  isPublished: z.boolean().default(false),
  title: z.string().default("New Question"),
  points: z.number().default(0),
  estimatedTime: z.number().default(0),
})

export const createQuestionSubmitRequestSchema = z.object({
  id: z.union([z.string(), z.number()]),
  questionTypeId: z.number(),
  content: jsonStringSchema,
  isPublished: z.boolean(),
  title: z.string(),
  points: z.number(),
  estimatedTime: z.number(),
})

export const updateQuestionRequestSchema = z.object({
  questionTypeId: z.number(),
  content: jsonStringSchema,
  isPublished: z.boolean(),
  title: z.string(),
  points: z.number(),
  estimatedTime: z.number(),
})

export const questionResponseSchema = z.object({
  props: z.object({
    id: z.number(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    questionTypeId: z.number().positive("Question Type ID must be positive"),
    isPublished: z.boolean(),
    description: z.string(),
    points: z.number().nonnegative(),
    estimatedTime: z.number().nonnegative(),
    questionType: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    createdAt: z.string(),
    updatedAt: z.string(),
    teacher: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

export const generatedQuestionResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  isGenerated: z.boolean(),
  duration: z.number(),
  type: z.string(),
  content: z.string(),
});

export type CreateQuestionDraftRequest = z.infer<typeof createQuestionDraftRequestSchema>;
export type CreateQuestionSubmitRequest = z.infer<typeof createQuestionSubmitRequestSchema>;
export type UpdateQuestionRequest = z.infer<typeof updateQuestionRequestSchema>;
export type QuestionResponse = z.infer<typeof questionResponseSchema>;
export type GeneratedQuestionResponse = z.infer<typeof generatedQuestionResponseSchema>;