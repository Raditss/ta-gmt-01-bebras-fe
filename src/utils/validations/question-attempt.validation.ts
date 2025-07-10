import { z } from 'zod';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { dayJsSchema } from '@/utils/validations/shared.validation';

export const saveDraftRequestSchema = z.object({
  questionId: z.number().positive('Question ID must be positive'),
  duration: z
    .number()
    .int()
    .nonnegative('Duration must be a non-negative integer'),
  answer: z.object({}).passthrough().optional()
});

export const submitAnswerRequestSchema = z.object({
  questionId: z.number().positive('Question ID must be positive'),
  duration: z
    .number()
    .int()
    .nonnegative('Duration must be a non-negative integer'),
  answer: z.object({}).passthrough()
});

export const generatedQuestionAttemptRequestSchema = z.object({
  type: z.nativeEnum(QuestionTypeEnum),
  questionContent: z.string().min(1, 'Question content must not be empty'),
  answer: z.string()
});

export const saveDraftResponseSchema = z.object({
  questionId: z.number(),
  studentId: z.number(),
  duration: z.number(),
  answer: z.object({}).passthrough(),
  isCompleted: z.boolean(),
  isDraft: z.boolean(),
  createdAt: dayJsSchema,
  updatedAt: dayJsSchema
});

export const submitAnswerResponseSchema = z.object({
  attempt: z.object({}).passthrough(),
  isCorrect: z.boolean(),
  points: z.number(),
  scoringDetails: z
    .object({
      explanation: z.string(),
      timeBonus: z.number(),
      newTotalScore: z.number(),
      questionsCompleted: z.number()
    })
    .optional()
});

export const questionAttemptResponseSchema = z.object({
  questionId: z.number(),
  studentId: z.number(),
  duration: z.number(),
  answer: z.object({}).passthrough(),
  isCompleted: z.boolean(),
  isDraft: z.boolean(),
  createdAt: dayJsSchema,
  updatedAt: dayJsSchema
});

export const generatedQuestionAttemptResponseSchema = z.object({
  isCorrect: z.boolean()
});

export type SaveDraftRequest = z.infer<typeof saveDraftRequestSchema>;
export type SubmitAnswerRequest = z.infer<typeof submitAnswerRequestSchema>;
export type GeneratedQuestionAttemptRequest = z.infer<
  typeof generatedQuestionAttemptRequestSchema
>;
export type SaveDraftResponse = z.infer<typeof saveDraftResponseSchema>;
export type SubmitAnswerResponse = z.infer<typeof submitAnswerResponseSchema>;
export type QuestionAttemptResponse = z.infer<
  typeof questionAttemptResponseSchema
>;
export type GeneratedQuestionAttemptResponse = z.infer<
  typeof generatedQuestionAttemptResponseSchema
>;
