'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Save, AlertCircle } from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { useRingCipherCreator } from '@/components/features/question/ring-cipher/useRingCipherCreator';

// Models and Types
import { RingCipherCreateModel } from '@/models/ring-cipher/ring-cipher.create.model';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { RingVisualization } from '@/components/features/question/ring-cipher/RingVisualization';

export default function RingCipherCreator({
  initialDataQuestion
}: BaseCreatorProps) {
  const router = useRouter();

  // Core question management
  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged,
    clearError
  } = useCreateQuestion<RingCipherCreateModel>(
    initialDataQuestion,
    RingCipherCreateModel
  );

  // Navigation guard
  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft
  });

  // Ring Cipher specific logic
  const {
    ringLetters,
    plaintext,
    prompt,
    rings,
    validation,
    isContentValid,
    handleRingCountChange,
    handleRingLettersChange,
    handleQuestionChange,
    handleShuffle
  } = useRingCipherCreator({ question, markAsChanged });

  // Component state
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Action handlers
  const handleManualSave = useCallback(async () => {
    clearError();
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  }, [saveDraft, clearError]);

  const handleSubmit = useCallback(() => {
    if (!isContentValid) {
      alert('Please complete all required fields before submitting.');
      return;
    }
    setShowSubmissionModal(true);
  }, [isContentValid]);

  const handleConfirmSubmit = useCallback(async () => {
    await submitCreation();
  }, [submitCreation]);

  return (
    <CreatorWrapper
      loading={false}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-4xl mx-auto mb-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                {initialDataQuestion.questionType.description}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center gap-6">
              <Button
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              {isContentValid && (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Submit Question
                </Button>
              )}
            </div>

            {/* Save Confirmation */}
            {showSaveConfirmation && (
              <div className="max-w-md mx-auto bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Draft saved successfully!
                  </span>
                </div>
              </div>
            )}

            {/* Last Saved */}
            {lastSavedDraft && !showSaveConfirmation && (
              <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">
                    Last saved at {lastSavedDraft.toString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Ring Configuration */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Ring Configuration
              </h2>
              <div className="space-y-6">
                {/* Ring Count */}
                <div className="space-y-2">
                  <Label>Number of Rings</Label>
                  <div className="flex gap-2">
                    {[2, 3, 4].map((count) => (
                      <Button
                        key={count}
                        variant={rings.length === count ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleRingCountChange(count)}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Shuffle Button */}
                <Button
                  onClick={handleShuffle}
                  variant="outline"
                  className="w-full"
                >
                  🎲 Shuffle Letters
                </Button>

                {/* Ring Letter Configuration */}
                <div className="space-y-4">
                  {rings.map((ring, index) => (
                    <div key={ring.id} className="space-y-2">
                      <Label>Ring {index + 1} Letters</Label>
                      <Input
                        value={ringLetters[index] || ''}
                        onChange={(e) =>
                          handleRingLettersChange(index, e.target.value)
                        }
                        placeholder="Enter letters (e.g., AEIOU)"
                        className="font-mono"
                      />
                      <div className="text-sm text-gray-500">
                        Current: {ring.letters.join(' ')} ({ring.letters.length}{' '}
                        letters)
                      </div>
                    </div>
                  ))}
                </div>

                {/* Validation Display */}
                {validation && !validation.isValid && (
                  <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        {validation.missingLetters.length > 0 && (
                          <div>
                            Missing: {validation.missingLetters.join(', ')}
                          </div>
                        )}
                        {validation.duplicateLetters.length > 0 && (
                          <div>
                            Duplicates: {validation.duplicateLetters.join(', ')}
                          </div>
                        )}
                        {validation.extraLetters.length > 0 && (
                          <div>
                            Invalid: {validation.extraLetters.join(', ')}
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {validation?.isValid && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      All letters properly distributed!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Question Content
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Text to Encrypt</Label>
                  <Input
                    value={plaintext}
                    onChange={(e) =>
                      handleQuestionChange(e.target.value, prompt)
                    }
                    placeholder="Enter the text to be encrypted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Question Prompt</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) =>
                      handleQuestionChange(plaintext, e.target.value)
                    }
                    placeholder="Enter the question prompt for students"
                    rows={4}
                  />
                </div>
              </div>

              {/* Ring Visualization */}
              <div className="bg-white rounded-lg p-8 shadow-sm mt-8">
                <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                  Ring Visualization
                </h2>
                <RingVisualization
                  rings={rings}
                  ringPositions={rings.map(() => 0)}
                />
              </div>
            </div>
          </div>

          {/* Submission Modal */}
          {question && (
            <CreationSubmissionModal
              isOpen={showSubmissionModal}
              isConfirming={true}
              questionData={{
                title: question.draft.title,
                questionType: question.draft.questionType.name,
                points: question.draft.points,
                estimatedTime: question.draft.estimatedTime,
                author: question.draft.teacher.name
              }}
              onConfirm={handleConfirmSubmit}
              onCancel={() => setShowSubmissionModal(false)}
              onClose={() => {
                setShowSubmissionModal(false);
                router.push('/add-problem');
              }}
            />
          )}
        </div>
      </div>
    </CreatorWrapper>
  );
}
