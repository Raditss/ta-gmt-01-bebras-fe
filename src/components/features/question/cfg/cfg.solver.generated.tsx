'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { GeneratedSubmitSection } from '@/components/features/question/shared/submit-section-generated';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';

export default function GeneratedCfgSolver({ type }: GeneratedSolverProps) {
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);

  // Use the new hook for generated questions
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<CfgSolveModel>(type, CfgSolveModel);

  // Initialize current state when question loads and keep it synced
  useEffect(() => {
    if (question) {
      const questionState = question.getCurrentState();
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

    if (selectedTypes.length === 0) {
      setApplicableRules([]);
      return;
    }

    const rules = question.getAvailableRules();

    const applicable = rules.filter((rule) => {
      // Check if the selected objects match the rule's "before" pattern exactly
      if (rule.before.length !== selectedTypes.length) return false;

      // Check if the types match the rule pattern exactly (in position order)
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });

    setApplicableRules(applicable);
  }, [selectedIndices, currentState, question]);

  const handleObjectClick = (index: number) => {
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

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && (
        <div className="max-w-full mx-auto p-6">
          {/* Main Layout - Flexible Grid (No time progress bar for generated questions) */}
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
            <Button
              onClick={regenerate}
              variant="outline"
              className="bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border-brand-blue/30 px-4 py-2 h-10"
            >
              New Question
            </Button>
            <GeneratedSubmitSection
              question={question}
              answerArr={currentState}
              type={type}
              questionContent={questionContent}
              onRegenerate={regenerate}
              submitButtonClassName="bg-brand-green hover:bg-brand-green-dark text-white border-0 px-4 py-2 h-10 font-medium"
              renderButtonOnly={true}
            />
          </div>
        </div>
      )}
    </GeneratedSolverWrapper>
  );
}
