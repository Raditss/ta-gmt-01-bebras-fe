import { questionService } from "@/lib/services/question.service";
import { useEffect, useRef, useState } from "react";
import {IAttempt, IQuestion} from "@/models/interfaces/question.model";
import dayjs, {Dayjs} from "dayjs";


type SolveQuestionConstructionModel<SolveQuestionModel extends IQuestion & IAttempt> = new (
  id: number,
) => SolveQuestionModel;

export const useSolveQuestion = <SolveQuestionModel extends IQuestion & IAttempt>(
  questionId: string,
  solveQuestionModel: SolveQuestionConstructionModel<SolveQuestionModel>,
) => {
  const [question, setQuestion] = useState<SolveQuestionModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<Dayjs>(dayjs());
  const durationRef = useRef<number>(0);

  const initializeAttemptData = (q: SolveQuestionModel, duration: number) => {
    q.setAttemptData(duration, true);
  };

  useEffect(() => {
    const fetchQuestionAndAttempt = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(questionId);
        const q = new solveQuestionModel(questionData.id,);

        q.populateQuestionFromString(questionData.content);

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

        setQuestion(q);
        setError(null);
      } catch (_err) {
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAttempt();
  }, [questionId]);

  useEffect(() => {
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
      if (!question) return;

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
      if (question) {
        const attemptData = question.getAttemptData();
        if (!attemptData || !attemptData.isDraft) {
          saveDraft();
        }
      }
    };
  }, [question, questionId]);

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
