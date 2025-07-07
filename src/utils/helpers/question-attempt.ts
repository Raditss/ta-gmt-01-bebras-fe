import {QuestionAttemptStatusEnum} from "@/types/question-attempt.type";

export function isQuestionAttemptStatusCompleted(isCompleted: boolean): QuestionAttemptStatusEnum {
    return isCompleted ? QuestionAttemptStatusEnum.COMPLETED : QuestionAttemptStatusEnum.PAUSED;
}
