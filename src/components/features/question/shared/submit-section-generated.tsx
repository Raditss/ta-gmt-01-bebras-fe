'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SubmissionModalSolver } from '@/components/features/question/submission-modal.solver';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { QuestionTypeEnum } from '@/types/question-type.type';


interface GeneratedSubmitSectionProps {
  question: any; // The question model instance
  answerArr: any[]; // Current answer array
  type: string; // Question type for generation
  questionContent: any; // Question content for checking
  onRegenerate: () => void; // Function to regenerate question
  isDisabled?: boolean; // Whether submit should be disabled
}

export function GeneratedSubmitSection({
  question,
  answerArr,
  type,
  questionContent,
  onRegenerate,
  isDisabled = false
}: GeneratedSubmitSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Handle submit button click
  const handleSubmit = useCallback(async () => {
    if (!question) return;

    try {
      setIsSubmitting(true);

      const response = await questionAttemptApi.checkGeneratedAnswer({
        type: type as QuestionTypeEnum,
        questionContent,
        answer: JSON.stringify(question.toJSON())
      });

      setSubmissionResult({
        isCorrect: response.isCorrect
      });
    } catch (error) {
      console.error('❌ Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [question, type, questionContent]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setSubmissionResult(null);
    router.push('/problems');
  }, [router]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setIsSubmitting(false);
  }, []);

  return (
    <>
      {/* Action Buttons - Side by side for generated mode */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={onRegenerate}
          variant="outline"
          className="flex-1 py-3 text-base"
        >
          New Question
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isDisabled || answerArr.length === 0 || isSubmitting}
          className="flex-1 py-3 text-base bg-green-500 hover:bg-green-600 text-white"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
      </div>

      {/* Submission Modal */}
      <SubmissionModalSolver
        isOpen={isSubmitting || !!submissionResult}
        isConfirming={isSubmitting && !submissionResult}
        result={submissionResult}
        onConfirm={handleSubmit}
        onCancel={handleCancel}
        onClose={handleModalClose}
      />
    </>
  );
} 