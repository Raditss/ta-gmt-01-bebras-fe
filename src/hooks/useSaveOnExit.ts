import { useEffect } from 'react';
import { questionService } from '@/services/questionService';
import { Question } from '@/model/cfg/question/model';
import { IAttempt } from '@/model/interfaces/question';

interface SaveOnExitParams {
  question: Question | null;
  userId: string | undefined;
  questionId: string;
  startTime: Date;
  onSave?: () => Promise<void>; // Optional callback for additional save logic
}

/**
 * Hook to handle saving question attempts when user exits/navigates away
 * @param params SaveOnExitParams object containing necessary data for saving
 * @example
 * ```tsx
 * useSaveOnExit({
 *   question,
 *   userId: user?.id,
 *   questionId: id,
 *   startTime,
 *   onSave: async () => {
 *     // Additional save logic here
 *   }
 * });
 * ```
 */
export const useSaveOnExit = ({
  question,
  userId,
  questionId,
  startTime,
  onSave
}: SaveOnExitParams) => {
  useEffect(() => {
    const createAttempt = (): IAttempt | null => {
      if (!question || !userId) return null;

      const currentDuration = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      return {
        questionId,
        userId: String(userId),
        startTime,
        duration: currentDuration,
        status: 'paused',
        currentState: question.getCurrentState(),
        steps: question.getSteps()
      };
    };

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';

      const attempt = createAttempt();
      if (attempt) {
        // Use sync save for beforeunload
        questionService.saveDraftSync(attempt);
      }

      return '';
    };

    const cleanup = async () => {
      const attempt = createAttempt();
      if (attempt) {
        // Use async save for normal unmount
        await questionService.saveDraft(attempt);
      }
      if (onSave) {
        await onSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save on component unmount
      cleanup();
    };
  }, [question, userId, questionId, startTime, onSave]);
}; 