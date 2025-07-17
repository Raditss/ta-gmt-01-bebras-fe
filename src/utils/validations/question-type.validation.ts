import { z } from 'zod';

export const questionTypeResponseSchema = z.object({
  props: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    instructions: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
});

export type QuestionTypeResponse = z.infer<typeof questionTypeResponseSchema>;
