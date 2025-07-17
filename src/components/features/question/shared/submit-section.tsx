'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SubmissionModalSolver } from '@/components/features/question/submission-modal.solver';
import { questionService } from '@/lib/services/question.service';

interface SubmissionResult {
  isCorrect: boolean;
  points: number;
  streak: number;
  timeTaken: number;
  scoringDetails?: {
    explanation: string;
    timeBonus: number;
    newTotalScore: number;
    questionsCompleted: number;
  };
}

interface QuestionModel {
  setAttemptData: (duration: number, isDraft: boolean) => void;
  getAttemptData: () => {
    questionId: number;
    duration: number;
    isDraft: boolean;
    answer: string;
  };
}

interface SubmitSectionProps {
  question: QuestionModel; // The question model instance
  getCurrentDuration: () => number;
  answerArr: unknown[]; // Current answer array
  isDisabled?: boolean; // Whether submit should be disabled
  className?: string; // Additional styling
  buttonText?: string; // Custom button text
  redirectPath?: string; // Where to redirect after submission
  onSubmissionSuccess?: () => void; // Called after successful submission
}

export function SubmitSection({
  question,
  getCurrentDuration,
  answerArr,
  isDisabled = false,
  className = 'w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 text-lg',
  buttonText = 'Submit Answer',
  redirectPath = '/problems',
  onSubmissionSuccess
}: SubmitSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  // Handle submit button click
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  // Confirm submit - actual submission logic
  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;

    try {
      const duration = getCurrentDuration();
      question.setAttemptData(duration, false);
      const attemptData = question.getAttemptData();
      const response = await questionService.submitAttempt({
        questionId: attemptData.questionId,
        duration: attemptData.duration,
        answer: JSON.parse(attemptData.answer)
      });

      // Take the answer from the response
      const isCorrect = response.isCorrect;
      const points = response.points;
      const scoringDetails = response.scoringDetails;

      const streak = isCorrect ? 1 : 0;

      setSubmissionResult({
        isCorrect,
        points,
        streak,
        timeTaken: duration,
        scoringDetails
      });

      // Call the success callback to mark as submitted
      onSubmissionSuccess?.();
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // You could add error handling here
    }
  }, [question, getCurrentDuration, onSubmissionSuccess]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsSubmitting(false);
    setSubmissionResult(null);
    router.push(redirectPath);
  }, [router, redirectPath]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsSubmitting(false);
  }, []);

  return (
    <>
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isDisabled || answerArr.length === 0}
        className={className}
      >
        {buttonText}
      </Button>

      {/* Submission Modal */}
      <SubmissionModalSolver
        isOpen={isSubmitting || !!submissionResult}
        isConfirming={isSubmitting && !submissionResult}
        result={submissionResult}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancel}
        onClose={handleModalClose}
      />
    </>
  );
}
