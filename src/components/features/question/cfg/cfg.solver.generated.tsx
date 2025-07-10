'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { CfgSolveModel } from '@/models/cfg/cfg.solve.model';
import { Rule, State } from '@/types/cfg.type';
import { RulesTableShared } from '@/components/features/question/cfg/shared/rules-table.shared';
import { StateDisplaySolve } from '@/components/features/question/cfg/solve/state-display.solve';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import {
  SubmissionModalSolver,
  SubmissionResult
} from '@/components/features/question/submission-modal.solver';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';

export default function GeneratedCfgSolver({ type }: GeneratedSolverProps) {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  // Use the new hook for generated questions
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<CfgSolveModel>(type, CfgSolveModel);

  // Initialize current state when question loads and keep it synced
  useEffect(() => {
    if (question) {
      const questionState = question.getCurrentState();
      console.log(
        '🔄 Syncing state from question model:',
        questionState.map((obj, i) => `${i}: ${obj.type}`)
      );
      setCurrentState(questionState);
    }
  }, [question]);

  // Sync local state with question model state periodically (in case they get out of sync)
  useEffect(() => {
    if (question) {
      const questionState = question.getCurrentState();
      const localStateStr = JSON.stringify(currentState);
      const questionStateStr = JSON.stringify(questionState);

      if (localStateStr !== questionStateStr) {
        console.log('⚠️ State mismatch detected! Syncing...');
        console.log(
          'Local:',
          currentState.map((obj, i) => `${i}: ${obj.type}`)
        );
        console.log(
          'Question:',
          questionState.map((obj, i) => `${i}: ${obj.type}`)
        );
        setCurrentState(questionState);
      }
    }
  }, [selectedIndices, question, currentState]);

  // Update applicable rules when selection changes
  useEffect(() => {
    if (!question || selectedIndices.length === 0) {
      setApplicableRules([]);
      return;
    }

    // Debug: Check if our local state matches the question model state
    const questionState = question.getCurrentState();
    console.log(
      '🔄 Local currentState:',
      currentState.map((obj, i) => `${i}: ${obj.type}`)
    );
    console.log(
      '🎯 Question model state:',
      questionState.map((obj, i) => `${i}: ${obj.type}`)
    );

    // Use the question model state as the source of truth
    const actualCurrentState = question.getCurrentState();

    // Sort selected indices to get them in positional order (not selection order)
    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);

    // Check if selected objects are consecutive (if more than one selected)
    if (sortedIndices.length > 1) {
      for (let i = 1; i < sortedIndices.length; i++) {
        if (sortedIndices[i] !== sortedIndices[i - 1] + 1) {
          setApplicableRules([]); // Not consecutive, no rules applicable
          return;
        }
      }
    }

    // Get selected types from the question model state (source of truth)
    const selectedTypes = sortedIndices
      .map((index) => actualCurrentState[index]?.type)
      .filter(Boolean);

    console.log('🎯 Selected indices:', sortedIndices);
    console.log('🎯 Selected types:', selectedTypes);

    if (selectedTypes.length === 0) {
      setApplicableRules([]);
      return;
    }

    const rules = question.getAvailableRules();
    console.log(
      '📏 Available rules:',
      rules.map(
        (rule) =>
          `${rule.id}: ${rule.before.map((obj) => obj.type).join('+')} → ${rule.after.map((obj) => obj.type).join('+')}`
      )
    );

    const applicable = rules.filter((rule) => {
      // Check if the selected objects match the rule's "before" pattern exactly
      if (rule.before.length !== selectedTypes.length) return false;

      // Check if the types match the rule pattern exactly (in position order)
      const matches = rule.before.every(
        (obj, i) => obj.type === selectedTypes[i]
      );
      console.log(
        `🔍 Rule ${rule.id} (${rule.before.map((obj) => obj.type).join('+')}) matches selected (${selectedTypes.join('+')})? ${matches}`
      );
      return matches;
    });

    console.log(
      '✅ Applicable rules:',
      applicable.map((rule) => rule.id)
    );
    setApplicableRules(applicable);
  }, [selectedIndices, currentState, question]);

  const handleObjectClick = (index: number) => {
    console.log('🖱️ Clicked object at index:', index);
    console.log('🔍 Object type at index:', currentState[index]?.type);
    console.log(
      '📋 Current state:',
      currentState.map((obj, i) => `${i}: ${obj.type}`)
    );

    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      // Ensure selections are consecutive
      if (
        selectedIndices.length === 0 ||
        Math.abs(index - selectedIndices[selectedIndices.length - 1]) === 1 ||
        Math.abs(index - selectedIndices[0]) === 1
      ) {
        const allIndices = [...selectedIndices, index].sort((a, b) => a - b);
        if (
          allIndices[allIndices.length - 1] - allIndices[0] ===
          allIndices.length - 1
        ) {
          setSelectedIndices(allIndices);
        }
      }
    }
  };

  const handleApplyRule = (rule: Rule) => {
    if (!question || selectedIndices.length === 0) return;

    // Use the lowest index as the starting position for rule application
    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const startIndex = sortedIndices[0];

    const success = question.applyRule(
      rule.id,
      startIndex,
      selectedIndices.length
    );
    if (success) {
      const newState = question.getCurrentState();
      setCurrentState(newState);
      setSelectedIndices([]);
    }
  };

  const handleUndo = () => {
    if (!question) return;

    const success = question.undo();
    if (success) {
      const newState = question.getCurrentState();
      setCurrentState(newState);
      setSelectedIndices([]);
    }
  };

  const handleRedo = () => {
    if (!question) return;

    const success = question.redo();
    if (success) {
      const newState = question.getCurrentState();
      setCurrentState(newState);
      setSelectedIndices([]);
    }
  };

  const handleReset = () => {
    if (!question) return;

    question.resetToInitialState();
    const newState = question.getCurrentState();
    setCurrentState(newState);
    setSelectedIndices([]);
  };

  const handleConfirmSubmit = async () => {
    if (!question) return;

    try {
      setIsSubmitting(true);

      const response = await questionAttemptApi.checkGeneratedAnswer({
        type,
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
  };

  const handleCloseSubmissionModal = () => {
    setSubmissionResult(null);
    router.push('/problems');
  };

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && (
        <>
          {/* Display all available transformation rules */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Available Rules</h3>
            <RulesTableShared rules={question.getAvailableRules()} />
          </div>

          {/* State displays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <StateDisplaySolve
              title="Target State"
              state={question.getQuestionSetup().endState}
              containerClassName="bg-yellow-50"
            />
            <StateDisplaySolve
              title="Current State"
              state={currentState}
              isInteractive={true}
              selectedIndices={selectedIndices}
              onObjectClick={handleObjectClick}
              containerClassName="bg-blue-50 border-2 border-blue-200"
            />
          </div>

          {/* Applicable Rules */}
          {applicableRules.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Available Transformations
              </h3>
              <div className="flex flex-wrap gap-4">
                {applicableRules.map((rule) => (
                  <Button
                    key={rule.id}
                    onClick={() => handleApplyRule(rule)}
                    className="p-4 bg-green-50 hover:bg-green-100 text-black border border-green-200 flex items-center gap-3"
                    variant="outline"
                  >
                    <div className="flex items-center gap-2">
                      {/* Before shapes */}
                      <div className="flex gap-1">
                        {rule.before.map((obj, idx) => (
                          <ShapeContainer key={idx}>
                            <Shape type={obj.type} size="sm" />
                          </ShapeContainer>
                        ))}
                      </div>

                      {/* Arrow */}
                      <span className="text-lg font-semibold text-gray-600">
                        →
                      </span>

                      {/* After shapes */}
                      <div className="flex gap-1">
                        {rule.after.map((obj, idx) => (
                          <ShapeContainer key={idx}>
                            <Shape type={obj.type} size="sm" />
                          </ShapeContainer>
                        ))}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={handleUndo} variant="outline">
              Undo
            </Button>
            <Button onClick={handleRedo} variant="outline">
              Redo
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
            <Button onClick={regenerate} variant="outline">
              New Question
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </>
      )}

      {/* Submission result modal */}
      <SubmissionModalSolver
        isOpen={isSubmitting || !!submissionResult}
        isConfirming={isSubmitting && !submissionResult}
        result={submissionResult}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setIsSubmitting(false)}
        onClose={handleCloseSubmissionModal}
      />
    </GeneratedSolverWrapper>
  );
}
