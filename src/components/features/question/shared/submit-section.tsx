'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SubmissionModalSolver } from '@/components/features/question/submission-modal.solver';
import { questionService } from '@/lib/services/question.service';

interface SubmitSectionProps {
  question: any; // The question model instance
  getCurrentDuration: () => number;
  content?: any; // Question content (kept for potential future use)
  answerArr: any[]; // Current answer array
  isDisabled?: boolean; // Whether submit should be disabled
  className?: string; // Additional styling
  buttonText?: string; // Custom button text
  redirectPath?: string; // Where to redirect after submission
}

export function SubmitSection({
  question,
  getCurrentDuration,
  content,
  answerArr,
  isDisabled = false,
  className = "w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 text-lg mt-6",
  buttonText = "Submit Answer",
  redirectPath = "/problems"
}: SubmitSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

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
        ...attemptData,
        answer: JSON.parse(attemptData.answer),
      });

      console.log(response);

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
    } catch (err) {
      console.error('Failed to submit answer:', err);
      // You could add error handling here
    }
  }, [question, getCurrentDuration]);

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