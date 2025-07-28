'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SubmissionModalSolver } from '@/components/features/question/submission-modal.solver';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { QuestionTypeEnum } from '@/types/question-type.type';

interface QuestionModel {
  toJSON: () => unknown;
}

interface GeneratedSubmitSectionProps {
  question: QuestionModel; // The question model instance
  answerArr: unknown[]; // Current answer array
  type: string; // Question type for generation
  questionContent: string; // Question content for checking
  onRegenerate: () => void; // Function to regenerate question
  isDisabled?: boolean; // Whether submit should be disabled
  regenerateButtonClassName?: string; // Custom styling for regenerate button
  submitButtonClassName?: string; // Custom styling for submit button
  renderButtonOnly?: boolean; // Whether to render only the submit button without container
}

export function GeneratedSubmitSection({
  question,
  answerArr,
  type,
  questionContent,
  onRegenerate,
  isDisabled = false,
  regenerateButtonClassName,
  submitButtonClassName,
  renderButtonOnly = false
}: GeneratedSubmitSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    isCorrect: boolean;
  } | null>(null);

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
      {renderButtonOnly ? (
        <Button
          onClick={handleSubmit}
          disabled={isDisabled || answerArr.length === 0 || isSubmitting}
          className={
            submitButtonClassName ||
            'bg-green-500 hover:bg-green-600 text-white'
          }
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
      ) : (
        <div className="flex gap-4 mt-3">
          <Button
            onClick={onRegenerate}
            variant="outline"
            className={`flex-1 py-3 text-base ${regenerateButtonClassName || ''}`}
          >
            ⟳ Soal Baru
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled || answerArr.length === 0 || isSubmitting}
            className={`flex-1 py-3 text-base ${submitButtonClassName || 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Jawaban'}
          </Button>
        </div>
      )}

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
