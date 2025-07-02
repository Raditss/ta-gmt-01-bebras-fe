import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { questionService } from "@/services/questionService";
import { useAuth } from "@/lib/auth";
import { Question } from "@/model/cfg/question/model";

export const useQuestionAttempt = (
  questionId: string,
  shouldSaveAttempt: boolean = true
) => {
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const durationRef = useRef<number>(0);

  // Initialize or update attempt data
  const initializeAttemptData = (q: Question, duration: number) => {
    if (!user?.id || !shouldSaveAttempt) return;
    q.setAttemptData(String(user.id), duration, "paused");
  };

  // Fetch question data and latest attempt
  useEffect(() => {
    const fetchQuestionAndAttempt = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(questionId);
        const q = new Question(
          questionData.id,
          questionData.title,
          questionData.type,
          questionData.isGenerated,
          questionData.duration
        );

        q.populateQuestionFromString(questionData.content);

        // Only fetch latest attempt if user is logged in and we should save attempts
        if (user?.id && shouldSaveAttempt) {
          const latestAttempt = await questionService.getLatestAttempt(
            questionId,
            String(user.id)
          );

          // Only restore state if there's a draft attempt
          if (latestAttempt && latestAttempt.status === "paused") {
            durationRef.current = latestAttempt.duration;

            // Restore the attempt state if it's a CFG question
            if (questionData.type === "cfg") {
              q.loadSolution(latestAttempt.solution);
            }
            initializeAttemptData(q, latestAttempt.duration);
          } else {
            // Reset duration if no draft attempt
            durationRef.current = 0;
            startTimeRef.current = new Date();
            initializeAttemptData(q, 0);
          }
        }

        setQuestion(q);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch question:", err);
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionAndAttempt();
  }, [questionId, user?.id, shouldSaveAttempt]);

  // Save attempt before unloading or navigating away
  useEffect(() => {
    if (!shouldSaveAttempt || !user?.id) return;

    const saveDraft = async () => {
      if (!question) return;

      const currentDuration =
        durationRef.current +
        Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000
        );

      initializeAttemptData(question, currentDuration);
      await questionService.saveDraft(question.getAttemptData());
    };

    // Handle browser navigation and tab closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!question || !user?.id || !shouldSaveAttempt) return;

      e.preventDefault();
      e.returnValue = "";

      const currentDuration =
        durationRef.current +
        Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000
        );

      initializeAttemptData(question, currentDuration);
      questionService.saveDraftSync(question.getAttemptData());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save attempt on unmount only if not navigating away due to submission
      if (question && user?.id) {
        const attemptData = question.getAttemptData();
        if (!attemptData || attemptData.status !== "completed") {
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
        Math.floor(
          (new Date().getTime() - startTimeRef.current.getTime()) / 1000
        )
      );
    },
  };
};
