'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Save, AlertCircle } from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { useCipherNCreator } from '@/components/features/question/cipher-n/useCipherNCreator';

// Models and Types
import { CipherCreateModel } from '@/models/cipher-n/cipher-n.create.model';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { CipherWheel } from '@/components/features/question/cipher-n/cipher-wheel';

export default function CipherNCreator({
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
  } = useCreateQuestion<CipherCreateModel>(
    initialDataQuestion,
    CipherCreateModel
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

  // Cipher-N specific logic
  const {
    vertexLetters,
    plaintext,
    prompt,
    vertices,
    config,
    alphabetValidation,
    polygonOptions,
    isContentValid,
    isVerticesValid,
    handleVertexCountChange,
    handleVertexLettersChange,
    handleQuestionChange,
    handleConfigChange,
    handleShuffle
  } = useCipherNCreator({ question, markAsChanged });

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
            {/* Polygon Configuration */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                Polygon Configuration
              </h2>
              <div className="space-y-6">
                {/* Polygon Type */}
                <div className="space-y-2">
                  <Label>Polygon Type</Label>
                  <Select
                    value={config?.vertexCount.toString()}
                    onValueChange={(value) =>
                      handleVertexCountChange(parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select polygon type" />
                    </SelectTrigger>
                    <SelectContent>
                      {polygonOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.name} ({option.value} vertices)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Starting Vertex */}
                <div className="space-y-2">
                  <Label>Starting Vertex</Label>
                  <Select
                    value={config?.startingVertex.toString()}
                    onValueChange={(value) =>
                      handleConfigChange('startingVertex', parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: config?.vertexCount || 0 },
                        (_, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            Vertex {index + 1}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Direction */}
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clockwise"
                      checked={config?.isClockwise}
                      onCheckedChange={(checked) =>
                        handleConfigChange('isClockwise', !!checked)
                      }
                    />
                    <Label htmlFor="clockwise">Clockwise</Label>
                  </div>
                  <div className="text-xs text-gray-500">
                    Currently:{' '}
                    {config?.isClockwise ? 'Clockwise' : 'Counter-clockwise'}
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

                {/* Vertex Letter Configuration */}
                <div className="space-y-4">
                  {vertices.map((vertex, index) => (
                    <div key={vertex.pos} className="space-y-2">
                      <Label>Vertex {index + 1} Letters</Label>
                      <Input
                        value={vertexLetters[index] || ''}
                        onChange={(e) =>
                          handleVertexLettersChange(index, e.target.value)
                        }
                        placeholder="Enter letters (e.g., ABC)"
                        className="font-mono"
                      />
                      <div className="text-sm text-gray-500">
                        Current: {vertex.letters} ({vertex.letters.length}{' '}
                        letters)
                      </div>
                    </div>
                  ))}
                </div>

                {/* Alphabet Validation Display */}
                {!alphabetValidation.isValid && vertices.length > 0 && (
                  <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        {alphabetValidation.missingLetters.length > 0 && (
                          <div>
                            Missing:{' '}
                            {alphabetValidation.missingLetters.join(', ')}
                          </div>
                        )}
                        {alphabetValidation.duplicateLetters.length > 0 && (
                          <div>
                            Duplicates:{' '}
                            {alphabetValidation.duplicateLetters.join(', ')}
                          </div>
                        )}
                        {alphabetValidation.extraLetters.length > 0 && (
                          <div>
                            Invalid:{' '}
                            {alphabetValidation.extraLetters.join(', ')}
                          </div>
                        )}
                        {!isVerticesValid && (
                          <div>
                            Please ensure all vertices have letters assigned.
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {alphabetValidation.isValid &&
                  isVerticesValid &&
                  vertices.length > 0 && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        All vertices and alphabet correctly configured!
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

              {/* Cipher Wheel Preview */}
              <div className="bg-white rounded-lg p-8 shadow-sm mt-8">
                <h2 className="text-2xl font-semibold mb-8 text-gray-800">
                  Cipher Wheel
                </h2>
                <div className="space-y-6">
                  <div className="flex justify-center">
                    {config && vertices.length > 0 && (
                      <CipherWheel vertices={vertices} config={config} />
                    )}
                    {(!config || vertices.length === 0) && (
                      <div className="text-center text-gray-500 py-12">
                        Configure your polygon to see the cipher wheel
                      </div>
                    )}
                  </div>

                  {/* Vertex Letter List */}
                  {vertices.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Letter Distribution:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {vertices.map((vertex, index) => (
                          <div
                            key={vertex.pos}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm font-medium">
                              Vertex {index + 1}:
                            </span>
                            <span className="text-sm font-mono">
                              {vertex.letters || '(empty)'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
