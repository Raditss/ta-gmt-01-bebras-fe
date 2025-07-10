import { z } from 'zod';
import {
  dayJsSchema,
  jsonStringSchema
} from '@/utils/validations/shared.validation';

export const createQuestionMetadataRequestSchema = z.object({
  questionTypeId: z.number().nonnegative('Question Type ID must be positive'),
  title: z.string().min(1, 'Title is required'),
  points: z.number().nonnegative('Points must be non-negative'),
  estimatedTime: z.number().nonnegative('Estimated time must be non-negative')
});

export const createQuestionDraftRequestSchema = z.object({
  id: z.number(),
  questionTypeId: z.number(),
  title: z.string().default('New Question'),
  content: jsonStringSchema.default('{}'),
  points: z.number().default(0),
  estimatedTime: z.number().default(0)
});

export const createQuestionSubmitRequestSchema = z.object({
  id: z.union([z.string(), z.number()]),
  questionTypeId: z.number(),
  title: z.string(),
  content: jsonStringSchema,
  isPublished: z.boolean(),
  points: z.number(),
  estimatedTime: z.number()
});

export const updateQuestionRequestSchema = z.object({
  questionTypeId: z.number(),
  title: z.string(),
  content: jsonStringSchema,
  isPublished: z.boolean(),
  points: z.number(),
  estimatedTime: z.number()
});

export const questionResponseSchema = z.object({
  props: z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    questionTypeId: z.number().positive('Question Type ID must be positive'),
    isPublished: z.boolean(),
    points: z.number().nonnegative(),
    estimatedTime: z.number().nonnegative(),
    questionType: z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      instructions: z.string(),
      createdAt: dayJsSchema,
      updatedAt: dayJsSchema
    }),
    createdAt: dayJsSchema,
    updatedAt: dayJsSchema,
    teacher: z.object({
      id: z.number(),
      name: z.string()
    })
  })
});

export const generatedQuestionResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  isGenerated: z.boolean(),
  duration: z.number(),
  type: z.string(),
  content: z.string()
});

export type CreateQuestionMetadataRequest = z.infer<
  typeof createQuestionMetadataRequestSchema
>;
export type CreateQuestionDraftRequest = z.infer<
  typeof createQuestionDraftRequestSchema
>;
export type CreateQuestionSubmitRequest = z.infer<
  typeof createQuestionSubmitRequestSchema
>;
export type UpdateQuestionRequest = z.infer<typeof updateQuestionRequestSchema>;
export type QuestionResponse = z.infer<typeof questionResponseSchema>;
export type GeneratedQuestionResponse = z.infer<
  typeof generatedQuestionResponseSchema
>;
