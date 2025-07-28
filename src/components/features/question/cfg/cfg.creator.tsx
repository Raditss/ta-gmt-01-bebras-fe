import { RuleModalCreate } from '@/components/features/question/cfg/create/rule-modal.create';
import { RulesSection } from '@/components/features/question/cfg/create/rule-section.create';
import { StateCreationPopupCreate } from '@/components/features/question/cfg/create/state-creation-popup.create';
import { StateDisplaySolve } from '@/components/features/question/cfg/solve/state-display.solve';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { CfgCreateModel, Rule, State } from '@/models/cfg/cfg.create.model';
import { CheckCircle2, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AVAILABLE_FISH } from '@/constants/shapes';
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';

import { BaseCreatorProps, CreatorWrapper } from '../../bases/base.creator';
import { CreationSubmissionModal } from '../submission-modal.creator';

interface ShapeObject {
  id: number;
  type: string;
  [key: string]: unknown;
}

export default function CfgCreator({ initialDataQuestion }: BaseCreatorProps) {
  const router = useRouter();

  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    markAsChanged
  } = useCreateQuestion<CfgCreateModel>(initialDataQuestion, CfgCreateModel);

  // Nav guard hook - MUST be at top level
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

  // ALL useState hooks at top level
  const [rules, setRules] = useState<Rule[]>([]);
  const [startState, setStartState] = useState<State[]>([]);
  const [endState, setEndState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showStartStateModal, setShowStartStateModal] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Track if this is initial load vs user edit
  const isInitialLoadRef = useRef(true);

  // ALL useEffect hooks at top level

  // Sync local state with question model
  useEffect(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (!cfgQuestion) {
      return;
    }

    setRules(cfgQuestion.rules || []);
    setStartState(cfgQuestion.startState || []);
    setEndState(cfgQuestion.endState || []);

    // Mark that initial load is complete
    isInitialLoadRef.current = false;
  }, [question]);

  // Auto-hide save confirmation
  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => setShowSaveConfirmation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  // Initialize end state with start state only when creating a NEW start state
  // (not when loading from database)
  useEffect(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (cfgQuestion && startState.length > 0 && endState.length === 0) {
      // Only initialize endState if it's empty (new creation, not loading from DB)
      const initialEndState = [...startState];
      setEndState(initialEndState);
      cfgQuestion.setEndState(initialEndState);
      cfgQuestion.setInitialEndState(initialEndState);
      setSelectedIndices([]);
      markAsChanged();
    }
  }, [startState, endState.length, question, markAsChanged]);

  // Update applicable rules when selection changes in end state
  useEffect(() => {
    if (!rules || selectedIndices.length === 0 || endState.length === 0) {
      setApplicableRules([]);
      return;
    }

    const selectedTypes = selectedIndices
      .map((index) => endState[index]?.type)
      .filter(Boolean);

    if (selectedTypes.length === 0) {
      setApplicableRules([]);
      return;
    }

    // Find rules where the "before" part matches selected objects
    const matchingRules = rules.filter((rule) => {
      if (rule.before.length !== selectedTypes.length) return false;
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });

    setApplicableRules(matchingRules);
  }, [selectedIndices, endState, rules]);

  // ALL useCallback hooks at top level to avoid React error #310
  // Add a new transformation rule
  const handleAddRule = useCallback(
    (beforeObjects: ShapeObject[], afterObjects: ShapeObject[]) => {
      const cfgQuestion = question as CfgCreateModel | null;
      if (!cfgQuestion) return;

      const newRuleId = nanoid();
      const newRule = {
        id: newRuleId,
        before: beforeObjects,
        after: afterObjects
      };
      const updatedRules = [...rules, newRule];

      cfgQuestion.setRules(updatedRules);
      setRules(updatedRules);
      setShowRuleModal(false);
      markAsChanged();
    },
    [question, rules, markAsChanged]
  );

  const handleDeleteRule = useCallback(
    (ruleId: string) => {
      const cfgQuestion = question as CfgCreateModel | null;
      if (!cfgQuestion) return;

      const updatedRules = rules.filter((rule) => rule.id !== ruleId);
      cfgQuestion.setRules(updatedRules);
      setRules(updatedRules);

      // Reset end state when rules change
      if (endState.length > 0) {
        const newEndState = [...startState];
        cfgQuestion.setEndState(newEndState);
        setEndState(newEndState);
      }

      markAsChanged();
    },
    [question, rules, startState, endState, markAsChanged]
  );

  const handleStartStateCreation = useCallback(
    (newStartState: State[]) => {
      const cfgQuestion = question as CfgCreateModel | null;
      if (!cfgQuestion) return;

      // Set the new start state
      cfgQuestion.setStartState(newStartState);
      setStartState(newStartState);

      // Reset end state to match the new start state
      cfgQuestion.setEndState([...newStartState]);
      cfgQuestion.setInitialEndState([...newStartState]);
      setEndState([...newStartState]);

      // Clear selected indices since end state changed
      setSelectedIndices([]);

      setShowStartStateModal(false);
      markAsChanged();
    },
    [question, markAsChanged]
  );

  // Handle clicking on objects in the end state for selection
  const handleEndStateObjectClick = useCallback(
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

  // Apply selected rule to end state
  const handleApplyRuleToEndState = useCallback(
    (rule: Rule) => {
      const cfgQuestion = question as CfgCreateModel | null;
      if (!cfgQuestion || selectedIndices.length === 0 || !rule) return;

      // Validate that the rule has proper 'after' objects
      if (!rule.after || !Array.isArray(rule.after)) {
        console.error('Rule has invalid after array:', rule);
        return;
      }

      // Validate that all 'after' objects have required properties
      const invalidObjects = rule.after.filter(
        (obj) => !obj || typeof obj.type !== 'string'
      );
      if (invalidObjects.length > 0) {
        console.error('Rule contains invalid after objects:', invalidObjects);
        return;
      }

      const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
      const startIdx = sortedIndices[0];
      const endIdx = sortedIndices[sortedIndices.length - 1];
      const currentEndState = [...endState];

      // Add unique IDs to new objects and ensure they have all required properties
      const afterWithIds = rule.after.map((obj) => {
        const newObj: ShapeObject = {
          id: Date.now() + Math.random(),
          type: obj.type
        };

        // Preserve any other properties like icon if they exist
        if ('icon' in obj && obj.icon) {
          newObj.icon = obj.icon;
        }

        return newObj;
      });

      // Replace selected objects with rule's output
      currentEndState.splice(startIdx, endIdx - startIdx + 1, ...afterWithIds);

      // Validate the new end state before setting it
      const validatedEndState = currentEndState.filter(
        (obj) => obj && typeof obj === 'object' && obj.type
      );

      if (validatedEndState.length !== currentEndState.length) {
        console.warn('Some invalid objects were filtered out from end state');
      }

      // Update the question model with the new end state
      cfgQuestion.setEndState(validatedEndState);

      // Record step for undo/redo
      cfgQuestion.pushStep({
        ruleId: rule.id,
        index: startIdx,
        replacedCount: selectedIndices.length,
        endState: validatedEndState
      });

      setEndState(validatedEndState);
      setSelectedIndices([]);
      markAsChanged();
    },
    [question, endState, selectedIndices, markAsChanged]
  );

  // Handles undoing the last step by replaying remaining steps from start state
  const handleUndo = useCallback(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (!cfgQuestion || startState.length === 0) return;

    const lastStep = cfgQuestion.popStep();
    if (lastStep) {
      // Start from the initial start state, not empty
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      cfgQuestion.setEndState(newEndState);

      setEndState(newEndState);
      setSelectedIndices([]);
      markAsChanged();
    }
  }, [question, startState, markAsChanged]);

  // Handles redoing the last undone step by replaying all steps including the redone one
  const handleRedo = useCallback(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (!cfgQuestion || startState.length === 0) return;

    const step = cfgQuestion.redoStep();
    if (step) {
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      cfgQuestion.setEndState(newEndState);

      setEndState(newEndState);
      setSelectedIndices([]);
      markAsChanged();
    }
  }, [question, startState, markAsChanged]);

  // Reset entire question state
  const handleReset = useCallback(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (!cfgQuestion) return;

    cfgQuestion.resetSteps();
    cfgQuestion.setRules([]);
    cfgQuestion.setStartState([]);
    cfgQuestion.setEndState([]);

    setRules([]);
    setStartState([]);
    setEndState([]);
    markAsChanged();
  }, [question, markAsChanged]);

  // Reset only the end state back to start state
  const handleResetEndState = useCallback(() => {
    const cfgQuestion = question as CfgCreateModel | null;
    if (!cfgQuestion || startState.length === 0) return;

    cfgQuestion.resetEndState();

    setEndState([...startState]);
    setSelectedIndices([]);
    markAsChanged();
  }, [question, startState, markAsChanged]);

  // Handle manual save
  const handleManualSave = useCallback(async () => {
    try {
      await saveDraft();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [saveDraft]);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (!question || !startState.length) return;
    setShowSubmissionModal(true);
  }, [question, startState.length]);

  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;

    try {
      await submitCreation();
      router.push('/add-problem'); // Redirect after successful submission
    } catch (error) {
      console.error('Failed to submit creation:', error);
      setShowSubmissionModal(false);
    }
  }, [question, submitCreation, router]);

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
      {question && (
        <div className="max-w-full mx-auto p-6">
          {/* Main Layout - Flexible Grid exactly like solver */}
          <div className="grid grid-cols-4 gap-8">
            {/* Rule Table - Left side (3 columns wide) */}
            <div className="col-span-3 bg-card rounded-lg p-6 shadow-sm border">
              <RulesSection
                rules={rules}
                onAddRule={() => setShowRuleModal(true)}
                onDeleteRule={handleDeleteRule}
              />
            </div>

            {/* Right side - Start and End states (sticky container) */}
            <div className="space-y-4">
              {/* Sticky container for both states */}
              <div className="sticky top-[15vh]">
                {/* Start State */}
                <div className="bg-card rounded-lg p-4 shadow-lg border mb-8">
                  <StateDisplaySolve
                    title="Keadaan Awal"
                    state={startState}
                    isInteractive={true}
                    onObjectClick={() => {
                      // Re-edit start state
                      setShowStartStateModal(true);
                    }}
                    containerClassName="bg-transparent border-none p-0"
                  />
                  {startState.length === 0 && (
                    <div className="text-center py-4">
                      <Button
                        onClick={() => setShowStartStateModal(true)}
                        variant="outline"
                        className="bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30"
                      >
                        Buat Keadaan Awal
                      </Button>
                    </div>
                  )}
                </div>

                {/* End State */}
                <div className="bg-card rounded-lg p-4 shadow-lg border">
                  <StateDisplaySolve
                    title="Keadaan Akhir"
                    state={endState}
                    isInteractive={startState.length > 0}
                    selectedIndices={selectedIndices}
                    onObjectClick={handleEndStateObjectClick}
                    containerClassName="bg-transparent border-none p-0"
                  />
                  {endState.length === 0 && (
                    <div className="text-center text-muted-foreground py-4 text-sm">
                      {startState.length === 0
                        ? 'Buat keadaan awal terlebih dahulu'
                        : 'Ubah keadaan ini menggunakan aturan di bawah'}
                    </div>
                  )}
                  {startState.length > 0 && endState.length > 0 && (
                    <div className="text-center text-muted-foreground mt-2 text-xs">
                      Klik objek untuk memilih, lalu terapkan aturan di bawah
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Rules Section - Matching solver's "Applicable Rules" section */}
          <div className="bg-muted/50 rounded-lg p-6 mt-6 mb-6 min-h-48 shadow-sm border">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
              Aturan yang Bisa Diterapkan
            </h2>

            <div className="flex items-center justify-center min-h-24">
              {applicableRules.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  {applicableRules.map((rule) => (
                    <Button
                      key={rule.id}
                      onClick={() => handleApplyRuleToEndState(rule)}
                      className="p-4 bg-brand-green/10 hover:bg-brand-green/20 text-foreground border border-brand-green/30 flex items-center gap-3 transition-colors"
                      variant="outline"
                    >
                      <div className="flex items-center gap-2">
                        {/* Before fish */}
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

                        {/* After fish */}
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
                  {startState.length === 0
                    ? 'Buat keadaan awal dan tambahkan beberapa aturan terlebih dahulu'
                    : selectedIndices.length === 0
                      ? 'Pilih objek di keadaan akhir untuk melihat aturan yang bisa diterapkan'
                      : 'Tidak ada aturan yang bisa diterapkan untuk objek yang dipilih'}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Matching solver layout */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleUndo}
              variant="outline"
              className="bg-muted/50 hover:bg-muted/70 text-foreground border-muted-foreground/20 px-4 py-2 h-10"
              disabled={startState.length === 0}
            >
              Urungkan
            </Button>
            <Button
              onClick={handleRedo}
              variant="outline"
              className="bg-muted/50 hover:bg-muted/70 text-foreground border-muted-foreground/20 px-4 py-2 h-10"
              disabled={startState.length === 0}
            >
              Ulangi
            </Button>
            <Button
              onClick={handleResetEndState}
              variant="outline"
              className="bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300 px-4 py-2 h-10"
              disabled={startState.length === 0 || endState.length === 0}
            >
              Reset Keadaan Akhir
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30 px-4 py-2 h-10"
            >
              Reset Semua
            </Button>
            <Button
              onClick={handleManualSave}
              disabled={!hasUnsavedChanges}
              variant="outline"
              className="bg-muted/50 hover:bg-muted/70 text-foreground border-muted-foreground/20 px-4 py-2 h-10"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan Draft
            </Button>
            {startState.length > 0 &&
              endState.length > 0 &&
              rules.length > 0 && (
                <Button
                  onClick={handleSubmit}
                  className="bg-brand-green hover:bg-brand-green-dark text-white border-0 px-4 py-2 h-10 font-medium"
                >
                  Kirim Soal
                </Button>
              )}
          </div>

          {/* Save Confirmation Alert - Below buttons */}
          {showSaveConfirmation && (
            <Alert className="mt-4 bg-green-50 text-green-800 border-green-200 max-w-md mx-auto">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Draft berhasil disimpan!</AlertDescription>
            </Alert>
          )}

          {/* Rule creation modal */}
          {showRuleModal && (
            <RuleModalCreate
              availableObjects={AVAILABLE_FISH}
              onClose={() => setShowRuleModal(false)}
              onAddRule={handleAddRule}
            />
          )}

          {/* Start state creation modal */}
          {showStartStateModal && (
            <StateCreationPopupCreate
              mode="start"
              availableObjects={AVAILABLE_FISH}
              rules={rules}
              startState={startState}
              endState={endState}
              setStartState={handleStartStateCreation}
              setEndState={() => {}} // Not used for start state creation
              applyRuleToEndState={() => {}} // Not used for start state creation
              onUndo={() => {}} // Not used for start state creation
              onRedo={() => {}} // Not used for start state creation
              onClose={() => setShowStartStateModal(false)}
            />
          )}

          {/* Submission Modal */}
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
        </div>
      )}
    </CreatorWrapper>
  );
}
