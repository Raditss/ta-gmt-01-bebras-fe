'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Save, TreePine, Users } from 'lucide-react';

// Hooks
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { useAnomalyMonsterTreeCreator } from '@/components/features/question/anomaly-monster/creator/useAnomalyMonsterTreeCreator';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';

// Models and Types
import { AnomalyMonsterCreateModel } from '@/models/anomaly-monster/anomaly-monster-create.model';
import { MonsterPartType } from '@/components/features/question/anomaly-monster/monster-part.type';

// Components
import {
  BaseCreatorProps,
  CreatorWrapper
} from '@/components/features/bases/base.creator';
import { CreationSubmissionModal } from '@/components/features/question/submission-modal.creator';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';
import MonsterPartWardrobe from '@/components/features/question/anomaly-monster/monster-part-wardrobe';
import RuleManagement from './rule-management';
import RulesList from './rules-list';
import ChoiceManagement from './choice-management';
import ChoicesList from './choices-list';

export default function AnomalyMonsterCreator({
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
  } = useCreateQuestion<AnomalyMonsterCreateModel>(
    initialDataQuestion,
    AnomalyMonsterCreateModel
  );

  // DecisionTree-specific logic
  const {
    // Tree Rules
    rules,
    currentRuleSelections,
    isCreatingRule,
    editingRuleId,
    selectedRuleId,
    duplicateRuleError,
    isCurrentRuleValid,
    handleRuleSelection,
    addRule,
    editRule,
    updateRule,
    deleteRule,
    cancelRule,
    startCreatingRule,
    setSelectedRuleId,

    // Choices
    choices,
    currentChoiceSelections,
    isCreatingChoice,
    editingChoiceId,
    selectedChoiceId,
    duplicateChoiceError,
    isCurrentChoiceValid,
    handleChoiceSelection,
    addChoice,
    editChoice,
    updateChoice,
    deleteChoice,
    cancelChoice,
    startCreatingChoice,
    setSelectedChoiceId
  } = useAnomalyMonsterTreeCreator({ question, markAsChanged });

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
  const [activeTab, setActiveTab] = useState('rules');
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
      alert(
        'Please add at least one rule to the decision tree before submitting.'
      );
      return;
    }
    if (choices.length === 0) {
      alert('Please add at least one monster choice before submitting.');
      return;
    }
    setShowSubmissionModal(true);
  }, [rules.length, choices.length]);

  const handleConfirmSubmit = useCallback(async () => {
    await submitCreation();
  }, [submitCreation]);

  const handleEditRule = useCallback(
    (ruleId: number) => {
      setActiveTab('rules');
      editRule(ruleId);
    },
    [editRule]
  );

  const handleEditChoice = useCallback(
    (choiceId: number) => {
      setActiveTab('choices');
      editChoice(choiceId);
    },
    [editChoice]
  );

  // Get current selections based on active tab
  const getCurrentSelections = useCallback(() => {
    return activeTab === 'rules'
      ? currentRuleSelections
      : currentChoiceSelections;
  }, [activeTab, currentRuleSelections, currentChoiceSelections]);

  // Get appropriate selection handler based on active tab
  const getSelectionHandler = useCallback(() => {
    return activeTab === 'rules' ? handleRuleSelection : handleChoiceSelection;
  }, [activeTab, handleRuleSelection, handleChoiceSelection]);

  // Convert current selections to format expected by DecisionTree
  const getTreeSelections = useCallback((): Record<string, string> => {
    const selections = getCurrentSelections();
    return {
      body: selections[MonsterPartType.BODY] || '',
      arms: selections[MonsterPartType.ARM] || '',
      legs: selections[MonsterPartType.LEG] || '',
      color: selections[MonsterPartType.COLOR] || ''
    };
  }, [getCurrentSelections]);

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
                disabled={
                  !rules ||
                  rules.length === 0 ||
                  !choices ||
                  choices.length === 0
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Submit Question
              </Button>
            </div>

            {/* Validation Messages */}
            {rules.length === 0 && choices.length === 0 && (
              <Alert className="max-w-md mx-auto bg-orange-50 text-orange-800 border-orange-200">
                <AlertDescription>
                  Please create both decision tree rules and monster choices to
                  submit the question.
                </AlertDescription>
              </Alert>
            )}
            {rules.length === 0 && choices.length > 0 && (
              <Alert className="max-w-md mx-auto bg-orange-50 text-orange-800 border-orange-200">
                <AlertDescription>
                  Please create at least one decision tree rule.
                </AlertDescription>
              </Alert>
            )}
            {rules.length > 0 && choices.length === 0 && (
              <Alert className="max-w-md mx-auto bg-orange-50 text-orange-800 border-orange-200">
                <AlertDescription>
                  Please create at least one monster choice.
                </AlertDescription>
              </Alert>
            )}

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
                      selections={getCurrentSelections()}
                      hovered={hovered}
                    />
                  </CardContent>
                </Card>

                <MonsterPartWardrobe
                  selections={getCurrentSelections()}
                  onSelection={getSelectionHandler()}
                  onHover={handleHover}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>

            {/* Management Tabs */}
            <div className="xl:col-span-2 space-y-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="rules"
                    className="flex items-center gap-2"
                  >
                    <TreePine className="h-4 w-4" />
                    Tree Rules ({rules.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="choices"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Monster Choices for Student ({choices.length})
                  </TabsTrigger>
                </TabsList>

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

                <TabsContent value="rules" className="space-y-6">
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
                </TabsContent>

                <TabsContent value="choices" className="space-y-6">
                  {/* Choice Management */}
                  <ChoiceManagement
                    currentChoiceSelections={currentChoiceSelections}
                    duplicateChoiceError={duplicateChoiceError}
                    editingChoiceId={editingChoiceId}
                    isCreatingChoice={isCreatingChoice}
                    isCurrentChoiceValid={isCurrentChoiceValid}
                    choicesCount={choices.length}
                    onAddChoice={addChoice}
                    onUpdateChoice={updateChoice}
                    onStartCreating={startCreatingChoice}
                    onCancel={cancelChoice}
                  />

                  {/* Choices List */}
                  <ChoicesList
                    choices={choices}
                    selectedChoiceId={selectedChoiceId}
                    editingChoiceId={editingChoiceId}
                    isCreatingChoice={isCreatingChoice}
                    onEditChoice={handleEditChoice}
                    onDeleteChoice={deleteChoice}
                    onSelectChoice={setSelectedChoiceId}
                  />
                </TabsContent>
              </Tabs>
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
