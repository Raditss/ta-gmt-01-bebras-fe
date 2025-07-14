'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Save } from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { useDecisionTreeCreator } from '@/components/features/question/decision-tree/decision-tree-anomaly/creator/useDecisionTreeCreator';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';

// Models and Types
import { DecisionTreeAnomalyCreateModel } from '@/models/decision-tree-anomaly/decision-tree-anomaly.create.model';
import { MonsterPartType } from '@/components/features/question/decision-tree/monster-part.type';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { DecisionTreeAnomalyTree } from '@/components/features/question/decision-tree/decision-tree-anomaly/tree';
import MonsterCharacter from '@/components/features/question/decision-tree/monster-character';
import MonsterPartWardrobe from '@/components/features/question/decision-tree/monster-part-wardrobe';
import RuleManagement from './rule-management';
import RulesList from './rules-list';

export default function DecisionTreeAnomalyCreator({
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
  } = useCreateQuestion<DecisionTreeAnomalyCreateModel>(
    initialDataQuestion,
    DecisionTreeAnomalyCreateModel
  );

  // DecisionTree-specific logic
  const {
    rules,
    currentRuleSelections,
    isCreatingRule,
    editingRuleId,
    selectedRuleId,
    duplicateRuleError,
    isCurrentRuleValid,
    handleSelection,
    addRule,
    editRule,
    updateRule,
    deleteRule,
    cancelRule,
    startCreatingRule,
    setSelectedRuleId
  } = useDecisionTreeCreator({ question, markAsChanged });

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

  // Component state
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Monster interaction handlers
  const handleHover = useCallback(
    (category: MonsterPartType, value: string) => {
      setHovered({ category, value });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  // Action handlers
  const handleManualSave = useCallback(async () => {
    clearError();
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  }, [saveDraft, clearError]);

  const handleSubmit = useCallback(() => {
    if (rules.length === 0) {
      alert('Please add at least one rule before submitting.');
      return;
    }
    setShowSubmissionModal(true);
  }, [rules.length]);

  const handleConfirmSubmit = useCallback(async () => {
    await submitCreation();
  }, [submitCreation]);

  const handleEditRule = useCallback(
    (ruleId: number) => {
      editRule(ruleId);
    },
    [editRule]
  );

  // Convert current selections to format expected by DecisionTree
  const getTreeSelections = useCallback((): Record<string, string> => {
    return {
      body: currentRuleSelections[MonsterPartType.BODY] || '',
      arms: currentRuleSelections[MonsterPartType.ARM] || '',
      legs: currentRuleSelections[MonsterPartType.LEG] || '',
      // horns: currentRuleSelections[MonsterPartType.HORN]?.value || '',
      color: currentRuleSelections[MonsterPartType.COLOR] || ''
    };
  }, [currentRuleSelections]);

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
      <div className="min-h-screen bg-gradient-to-br">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-4">
                <p className="text-gray-700 leading-relaxed">
                  {initialDataQuestion.questionType.description}
                </p>
              </CardContent>
            </Card>

            {/* Action Bar */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!rules || rules.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Submit Question
              </Button>
            </div>

            {/* Save Confirmation */}
            {showSaveConfirmation && (
              <Alert className="max-w-md mx-auto bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Draft saved successfully!</AlertDescription>
              </Alert>
            )}

            {/* Last Saved */}
            {lastSavedDraft && !showSaveConfirmation && (
              <Alert className="max-w-md mx-auto bg-gray-50 text-gray-800 border-gray-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Last saved at {lastSavedDraft.toString()}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Monster Wardrobe */}
            <div className="xl:col-span-1">
              <div className="flex flex-col items-center space-y-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6 flex items-center justify-center">
                    <MonsterCharacter
                      selections={currentRuleSelections}
                      hovered={hovered}
                    />
                  </CardContent>
                </Card>

                <MonsterPartWardrobe
                  selections={currentRuleSelections}
                  onSelection={handleSelection}
                  onHover={handleHover}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>

            {/* Rule Management and Tree */}
            <div className="xl:col-span-2 space-y-6">
              {/* Rule Management */}
              <RuleManagement
                currentRuleSelections={currentRuleSelections}
                duplicateRuleError={duplicateRuleError}
                editingRuleId={editingRuleId}
                isCreatingRule={isCreatingRule}
                isCurrentRuleValid={isCurrentRuleValid}
                rulesCount={rules.length}
                onAddRule={addRule}
                onUpdateRule={updateRule}
                onStartCreating={startCreatingRule}
                onCancel={cancelRule}
              />

              {/* Decision Tree Visualization */}
              {rules.length > 0 && (
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                      Decision Tree Preview
                    </h3>
                    <DecisionTreeAnomalyTree
                      rules={rules}
                      selections={getTreeSelections()}
                    />
                    {isCreatingRule && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 text-center">
                          The tree will update as you create new rules
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Rules List */}
              <RulesList
                rules={rules}
                selectedRuleId={selectedRuleId}
                editingRuleId={editingRuleId}
                isCreatingRule={isCreatingRule}
                onEditRule={handleEditRule}
                onDeleteRule={deleteRule}
                onSelectRule={setSelectedRuleId}
              />
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
