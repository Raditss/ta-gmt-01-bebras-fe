import { questionResponseSchema } from "@/utils/validations/question.validation";
import {z} from "zod";

export type Question = z.infer<typeof questionResponseSchema>["props"];