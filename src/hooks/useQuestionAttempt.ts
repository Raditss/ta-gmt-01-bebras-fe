import { questionService } from "@/lib/services/question.service";
import { useEffect, useRef, useState } from "react";
import {useAuth} from "@/hooks/useAuth";
import {IAttempt, IQuestion} from "@/models/interfaces/question";
import {getQuestionTypeByName, QuestionTypeEnum} from "@/types/question-type.type";
import dayjs, {Dayjs} from "dayjs";


type QuestionConstructor<T extends IQuestion & IAttempt> = new (
  id: number,
  title: string,
  questionType: QuestionTypeEnum,
  duration: number,
) => T;

export const useQuestionAttempt = <T extends IQuestion & IAttempt>(
  questionId: string,
  Model: QuestionConstructor<T>,
  shouldSaveAttempt: boolean = true
) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<Dayjs>(dayjs());
  const durationRef = useRef<number>(0);

  const initializeAttemptData = (q: T, duration: number) => {
    if (!shouldSaveAttempt) return;
    q.setAttemptData(duration, true);
  };

  useEffect(() => {
    const fetchQuestionAndAttempt = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(questionId);
        const q = new Model(
          questionData.id,
          questionData.title,
          getQuestionTypeByName(questionData.questionType.name),
          0,
        );

        q.populateQuestionFromString(questionData.content);

        if (shouldSaveAttempt) {
          const latestAttempt = await questionService.getLatestAttempt(
            questionId
          );

          if (latestAttempt && latestAttempt.isDraft) {
            durationRef.current = latestAttempt.duration;

            startTimeRef.current = dayjs();

            q.loadAnswer(JSON.stringify(latestAttempt.answer));
            initializeAttemptData(q, latestAttempt.duration);
          } else {
            durationRef.current = 0;
            startTimeRef.current = dayjs();
            initializeAttemptData(q, 0);
          }
        } else {
          durationRef.current = 0;
          startTimeRef.current = dayjs();
        }

        setQuestion(q);
        setError(null);
      } catch (_err) {
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAttempt();
  }, [questionId, shouldSaveAttempt]);

  useEffect(() => {
    if (!shouldSaveAttempt || !user?.id) return;

    const saveDraft = async () => {
      if (!question) return;

      const currentDuration =
        durationRef.current +
        dayjs().diff(dayjs(startTimeRef.current), 'second')

      initializeAttemptData(question, currentDuration);
      const attemptData = question.getAttemptData();
       await questionService.saveDraft({
        questionId: attemptData.questionId,
        duration: attemptData.duration,
        answer: JSON.parse(attemptData.answer),
      });
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!question || !user?.id || !shouldSaveAttempt) return;

      e.preventDefault();

      const currentDuration =
        durationRef.current +
        dayjs().diff(dayjs(startTimeRef.current), 'second')


      initializeAttemptData(question, currentDuration);
      const attemptData = question.getAttemptData();
      questionService.saveDraftSync({
        questionId: attemptData.questionId,
        duration: attemptData.duration,
        answer: JSON.parse(attemptData.answer),
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (question && user?.id) {
        const attemptData = question.getAttemptData();
        if (!attemptData || !attemptData.isDraft) {
          saveDraft();
        }
      }
    };
  }, [question, questionId, user, shouldSaveAttempt]);

  return {
    question,
    loading,
    error,
    currentDuration: () => {
      return (
        durationRef.current +
        dayjs().diff(dayjs(startTimeRef.current), 'second')
      );
    },
  };
};
