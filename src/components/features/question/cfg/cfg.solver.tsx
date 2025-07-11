'use client';

import { RulesTableShared } from '@/components/features/question/cfg/shared/rules-table.shared';
import { StateDisplaySolve } from '@/components/features/question/cfg/solve/state-display.solve';
import { TimeProgressBar } from '@/components/features/question/cfg/solve/time-progress-bar';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { useDuration } from '@/hooks/useDuration';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { Rule, State } from '@/types/cfg.type';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';

import { BaseSolverProps, SolverWrapper } from '../../bases/base.solver';
import { CfgSolveModel } from '@/models/cfg/cfg.solve.model';

export default function CfgSolver({ questionId }: BaseSolverProps) {
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);

  // Setup hooks for question functionality
  const {
    question,
    questionMetadata,
    loading,
    error,
    currentDuration,
    markAsSubmitted
  } = useSolveQuestion<CfgSolveModel>(questionId, CfgSolveModel);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

  // Update local state when question is loaded
  useEffect(() => {
    if (question) {
      setCurrentState(question.getCurrentState());
    }
  }, [question]);

  // Update applicable rules when selection changes
  useEffect(() => {
    if (!question || selectedIndices.length === 0) {
      setApplicableRules([]);
      return;
    }

    const selectedTypes = selectedIndices.map(
      (index) => currentState[index].type
    );
    const rules = question.getAvailableRules();

    // Find rules where the "before" part matches selected objects
    const matchingRules = rules.filter((rule) => {
      if (rule.before.length !== selectedTypes.length) return false;
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });

    setApplicableRules(matchingRules);
  }, [selectedIndices, currentState, question]);

  // Handle clicking on objects in the current state
  const handleObjectClick = useCallback(
    (index: number) => {
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
    },
    [selectedIndices]
  );

  // Apply selected rule to current state
  const handleApplyRule = useCallback(
    (rule: Rule) => {
      if (!question || selectedIndices.length === 0) return;

      const success = question.applyRule(
        rule.id,
        selectedIndices[0],
        selectedIndices.length
      );
      if (success) {
        setCurrentState(question.getCurrentState());
        setSelectedIndices([]);
      }
    },
    [question, selectedIndices]
  );

  // Handle undo operation
  const handleUndo = useCallback(() => {
    if (!question) return;
    if (question.undo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  }, [question]);

  // Handle redo operation
  const handleRedo = useCallback(() => {
    if (!question) return;
    if (question.redo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  }, [question]);

  // Handle reset operation
  const handleReset = useCallback(() => {
    if (!question) return;
    question.resetToInitialState();
    setCurrentState(question.getCurrentState());
    setSelectedIndices([]);
  }, [question]);

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && questionMetadata && (
        <div className="max-w-full mx-auto p-6">
          {/* Time Progress Bar */}
          <TimeProgressBar
            currentDuration={currentDuration()}
            estimatedTime={questionMetadata.estimatedTime}
            formattedDuration={formattedDuration}
          />

          {/* Main Layout - Flexible Grid */}
          <div className="grid grid-cols-4 gap-8">
            {/* Rule Table - Left side (3 columns wide) */}
            <div className="col-span-3 bg-card rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
                Rule Table
              </h2>
              {/* Remove height constraints to let table flow naturally */}
              <div className="overflow-visible">
                <RulesTableShared rules={question.getAvailableRules()} />
              </div>
            </div>

            {/* Right side - Target and Current states (sticky container) */}
            <div className="space-y-4">
              {/* Sticky container for both target and current */}
              <div className="sticky top-[15vh]">
                {/* Target State */}
                <div className="bg-card rounded-lg p-4 shadow-lg border mb-8">
                  <StateDisplaySolve
                    title="Target"
                    state={question.getQuestionSetup().endState}
                    containerClassName="bg-transparent border-none p-0"
                  />
                </div>

                {/* Current State */}
                <div className="bg-card rounded-lg p-4 shadow-lg border">
                  <StateDisplaySolve
                    title="Current"
                    state={currentState}
                    isInteractive={true}
                    selectedIndices={selectedIndices}
                    onObjectClick={handleObjectClick}
                    containerClassName="bg-transparent border-none p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Rules Section - Fixed height */}
          <div className="bg-muted/50 rounded-lg p-6 mt-6 mb-6 min-h-48 shadow-sm border">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
              Applicable Rules
            </h2>

            <div className="flex items-center justify-center min-h-24">
              {applicableRules.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {applicableRules.map((rule) => (
                    <Button
                      key={rule.id}
                      onClick={() => handleApplyRule(rule)}
                      className="p-4 bg-brand-green/10 hover:bg-brand-green/20 text-foreground border border-brand-green/30 flex items-center gap-3 transition-colors"
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
                        <span className="text-lg font-semibold text-muted-foreground">
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
              ) : (
                <div className="text-center text-muted-foreground">
                  Select objects to see applicable rules
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleUndo}
              variant="outline"
              className="bg-muted/50 hover:bg-muted/70 text-foreground border-muted-foreground/20 px-4 py-2 h-10"
            >
              Undo
            </Button>
            <Button
              onClick={handleRedo}
              variant="outline"
              className="bg-muted/50 hover:bg-muted/70 text-foreground border-muted-foreground/20 px-4 py-2 h-10"
            >
              Redo
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30 px-4 py-2 h-10"
            >
              Reset
            </Button>
            <SubmitSection
              question={question}
              getCurrentDuration={getCurrentDuration}
              answerArr={currentState}
              className="bg-brand-green hover:bg-brand-green-dark text-white border-0 px-4 py-2 h-10 font-medium"
              buttonText="Submit Answer"
              onSubmissionSuccess={markAsSubmitted}
            />
          </div>
        </div>
      )}
    </SolverWrapper>
  );
}
