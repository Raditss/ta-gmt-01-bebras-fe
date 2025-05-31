import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IAttempt } from '@/types/question';
import { questionService } from '@/services/questionService';
import { useAuth } from '@/lib/auth';
import { Question } from '@/model/cfg/question/model';

export const useQuestionAttempt = (questionId: string, shouldSaveAttempt: boolean = true) => {
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<Date>(new Date());
  const durationRef = useRef<number>(0);

  // Fetch question data
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await questionService.getQuestionById(questionId);
        const q = new Question(data.id, data.title, data.type, data.isGenerated, data.duration);
        q.populateQuestionFromString(JSON.stringify(data.content));
        setQuestion(q);
        durationRef.current = data.duration;
      } catch (err) {
        setError('Failed to fetch question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  // Save attempt before unloading or navigating away
  useEffect(() => {
    if (!shouldSaveAttempt) return;

    const saveAttempt = async () => {
      if (!question || !user?.id) return;

      const currentDuration = durationRef.current + 
        Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);

      const attempt: IAttempt = {
        questionId,
        userId: String(user.id),
        startTime: startTimeRef.current,
        duration: currentDuration,
        status: 'paused'
      };

      await questionService.saveAttempt(attempt);
    };

    // Handle browser navigation and tab closing
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      saveAttempt();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save attempt on unmount
      saveAttempt();
    };
  }, [question, questionId, user, shouldSaveAttempt]);

  return {
    question,
    loading,
    error,
    currentDuration: () => {
      return durationRef.current + 
        Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
    }
  };
}; 