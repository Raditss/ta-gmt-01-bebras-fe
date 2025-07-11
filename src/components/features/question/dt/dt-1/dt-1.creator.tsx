'use client';

import { DecisionTree2 } from '@/components/features/question/dt/dt-1/tree';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import MonsterPartWardrobe from '@/components/features/question/dt/monster-part-wardrobe';
import {
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/dt/monster-part.type';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCreateQuestion } from '@/hooks/useCreateQuestion';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { DecisionTree2CreateModel } from '@/models/dt-1/dt-1.create.model';
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  MapPin,
  Plus,
  Save,
  Target,
  Trash2
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { BaseCreatorProps, CreatorWrapper } from '../../../bases/base.creator';
import { CreationSubmissionModal } from '../../submission-modal.creator';
import { Condition, Finish, Rule } from '@/models/dt-1/dt-1.model.type';

const attributeLabels = {
  body: 'Body',
  arms: 'Arms',
  legs: 'Legs',
  horns: 'Horns',
  color: 'Color'
};

export default function Dt1Creator({ initialDataQuestion }: BaseCreatorProps) {
  // Creation hook
  const {
    question,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    isLoading,
    markAsChanged
  } = useCreateQuestion<DecisionTree2CreateModel>(
    initialDataQuestion,
    DecisionTree2CreateModel
  );

  // Nav guard
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
  const [rules, setRules] = useState<Rule[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [goals, setGoals] = useState<number[]>([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [currentRuleFinish, setCurrentRuleFinish] = useState<number | null>(
    null
  );
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [isRuleDrawerOpen, setIsRuleDrawerOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [isCreatingFinish, setIsCreatingFinish] = useState(false);
  const [editingFinishId, setEditingFinishId] = useState<number | null>(null);
  const [newFinishName, setNewFinishName] = useState('');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [duplicateRuleError, setDuplicateRuleError] = useState<string | null>(
    null
  );

  // Load existing data when question is loaded
  useEffect(() => {
    if (question) {
      setRules(question.content.rules);
      setFinishes(question.content.finishes);
      setGoals(question.content.goals);
    }
  }, [question]);

  // Handle monster part selection for rule creation
  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setSelections((prev) => ({
        ...prev,
        [category]: value.value
      }));
      setDuplicateRuleError(null);
    },
    []
  );

  const handleHover = useCallback(
    (category: MonsterPartType, value: string) => {
      setHovered({ category, value });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setHovered(null);
  }, []);

  // Check if current rule is valid
  const isCurrentRuleValid = () => {
    const hasAllSelections =
      Object.keys(selections).length === Object.values(MonsterPartType).length;
    const hasFinishSelected = currentRuleFinish !== null;
    return hasAllSelections && hasFinishSelected;
  };

  // Create conditions from current selections
  const createConditionsFromSelections = (): Condition[] => {
    return Object.entries(selections).map(([attribute, option]) => ({
      attribute,
      operator: '=',
      value: option
    }));
  };

  // Handle adding/updating rule
  const handleSaveRule = () => {
    if (!question || !isCurrentRuleValid()) return;

    const conditions = createConditionsFromSelections();

    // Check for duplicate rules
    const isDuplicate = rules.some((rule) => {
      if (editingRuleId && rule.id === editingRuleId) return false;
      return (
        rule.conditions.length === conditions.length &&
        rule.conditions.every((cond) =>
          conditions.some(
            (newCond) =>
              newCond.attribute === cond.attribute &&
              newCond.value === cond.value
          )
        )
      );
    });

    if (isDuplicate) {
      setDuplicateRuleError('A rule with these conditions already exists');
      return;
    }

    if (editingRuleId) {
      // Update existing rule
      const updatedRule: Rule = {
        id: editingRuleId,
        conditions,
        finish: currentRuleFinish!
      };
      setRules((prev) =>
        prev.map((rule) => (rule.id === editingRuleId ? updatedRule : rule))
      );
    } else {
      // Add new rule
      const newRule: Rule = {
        id: rules.length < 1 ? 1 : rules[rules.length - 1].id + 1,
        conditions,
        finish: currentRuleFinish!
      };
      setRules((prev) => [...prev, newRule]);
    }

    markAsChanged();
    setIsRuleDrawerOpen(false);
    setEditingRuleId(null);
    setSelections({});
    setCurrentRuleFinish(null);
    setDuplicateRuleError(null);
  };

  // Handle canceling rule creation/editing
  const handleCancelRule = () => {
    setIsRuleDrawerOpen(false);
    setEditingRuleId(null);
    setSelections({});
    setCurrentRuleFinish(null);
    setDuplicateRuleError(null);
  };

  // Handle editing rule
  const handleEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setIsRuleDrawerOpen(true);

    // Convert conditions back to selections
    const selections: Record<string, string> = {};
    rule.conditions.forEach((condition) => {
      selections[condition.attribute] = condition.value;
    });
    setSelections(selections);
    setCurrentRuleFinish(rule.finish);
  };

  // Handle removing rule
  const handleRemoveRule = (ruleId: number) => {
    if (!question) return;
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    markAsChanged();
  };

  // Handle adding/updating finish
  const handleSaveFinish = useCallback(() => {
    if (!question || !newFinishName.trim()) return;

    if (editingFinishId) {
      // Update existing finish
      const updatedFinish: Finish = {
        id: editingFinishId,
        name: newFinishName.trim()
      };
      setFinishes((prev) =>
        prev.map((finish) =>
          finish.id === editingFinishId ? updatedFinish : finish
        )
      );
    } else {
      // Add new finish
      const newFinish: Finish = {
        id: finishes.length < 1 ? 1 : finishes[finishes.length - 1].id + 1,
        name: newFinishName.trim()
      };
      setFinishes((prev) => [...prev, newFinish]);
    }

    markAsChanged();
    handleCancelFinish();
  }, [editingFinishId, markAsChanged, newFinishName, question]);

  // Handle canceling finish creation/editing
  const handleCancelFinish = () => {
    setIsCreatingFinish(false);
    setEditingFinishId(null);
    setNewFinishName('');
  };

  // Handle editing finish
  const handleEditFinish = (finish: Finish) => {
    setEditingFinishId(finish.id);
    setIsCreatingFinish(true);
    setNewFinishName(finish.name);
  };

  // Handle removing finish
  const handleRemoveFinish = (finishId: number) => {
    if (!question) return;
    setFinishes((prev) => prev.filter((finish) => finish.id !== finishId));
    setGoals((prev) => prev.filter((goalId) => goalId !== finishId));
    markAsChanged();
  };

  // Handle toggling goal
  const handleToggleGoal = (finishId: number) => {
    if (!question) return;

    if (goals.includes(finishId)) {
      setGoals((prev) => prev.filter((goalId) => goalId !== finishId));
    } else {
      setGoals((prev) => [...prev, finishId]);
    }
    markAsChanged();
  };

  // Handle manual save
  const handleManualSave = async () => {
    if (question) {
      question.content = {
        finishes: finishes,
        goals: goals,
        rules: rules
      };
    }
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!question) return;
    question.content = {
      finishes: finishes,
      goals: goals,
      rules: rules
    };
    if (question.validateContent()) {
      setShowSubmissionModal(true);
    } else {
      // Show validation errors
      const errors = [];
      if (rules.length === 0) errors.push('At least one rule is required');
      if (finishes.length === 0) errors.push('At least one finish is required');
      if (goals.length === 0)
        errors.push('At least one goal finish is required');

      alert(`Please fix the following issues:\n- ${errors.join('\n- ')}`);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowSubmissionModal(false);
    await submitCreation();
  };

  const getDisplayValue = (attribute: string, value: string) => {
    const label = attributeLabels[attribute as keyof typeof attributeLabels];
    return `${label}: ${value}`;
  };

  return (
    <CreatorWrapper
      loading={isLoading}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Decision Tree 2 Question
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleManualSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button onClick={handleSubmit} disabled={!question}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Question
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {creationError && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{creationError}</AlertDescription>
            </Alert>
          )}

          {/* Save Confirmation */}
          {showSaveConfirmation && (
            <Alert className="mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Draft saved successfully!</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Finishes Management and Rules List */}
            <div className="space-y-6">
              {/* Finishes Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Finishes ({finishes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Create the possible destinations that rules can lead to.
                      You can then select which finishes are goals in the Goal
                      Management section.
                    </p>

                    {finishes.map((finish) => (
                      <div
                        key={finish.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{finish.name}</span>
                          {goals.includes(finish.id) && (
                            <Badge className="bg-green-100 text-green-800">
                              <Target className="w-3 h-3 mr-1" />
                              Goal
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditFinish(finish)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFinish(finish.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add/Edit Finish Form */}
                    {isCreatingFinish && (
                      <div className="p-4 border border-dashed rounded-lg space-y-3">
                        <Label htmlFor="finish-name">Finish Name</Label>
                        <Input
                          id="finish-name"
                          placeholder="Enter finish name (e.g., A, B, Exit, Success)..."
                          value={newFinishName}
                          onChange={(e) => {
                            e.preventDefault();
                            setNewFinishName(e.target.value);
                          }}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveFinish}
                            disabled={!newFinishName.trim()}
                          >
                            {editingFinishId ? 'Update' : 'Add'} Finish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelFinish}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isCreatingFinish && (
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingFinish(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Finish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Goal Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Goal Management ({goals.length} goals)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {finishes.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">
                        Select which finishes are goals. Students must find
                        combinations that can reach ALL selected goals.
                      </p>

                      {/* Goal Statistics */}
                      {goals.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">
                              Goal Summary
                            </span>
                          </div>
                          <div className="text-sm text-green-700">
                            <p>
                              Goals: {goals.length} of {finishes.length}{' '}
                              finishes
                            </p>
                            <p>
                              Goal Rules:{' '}
                              {
                                rules.filter((rule) =>
                                  goals.includes(rule.finish)
                                ).length
                              }{' '}
                              of {rules.length} rules
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Quick Goal Selection */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const allFinishIds = finishes.map((f) => f.id);
                            setGoals(allFinishIds);
                            markAsChanged();
                          }}
                          disabled={goals.length === finishes.length}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGoals([]);
                            markAsChanged();
                          }}
                          disabled={goals.length === 0}
                        >
                          Clear All
                        </Button>
                      </div>

                      {/* Goal Finishes List */}
                      <div className="space-y-2">
                        {finishes.map((finish) => (
                          <div
                            key={finish.id}
                            className={`p-3 border rounded-lg ${
                              goals.includes(finish.id)
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  checked={goals.includes(finish.id)}
                                  onCheckedChange={() =>
                                    handleToggleGoal(finish.id)
                                  }
                                />
                                <span className="font-medium">
                                  {finish.name}
                                </span>
                                {goals.includes(finish.id) && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <Target className="w-3 h-3 mr-1" />
                                    Goal
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {
                                  rules.filter(
                                    (rule) => rule.finish === finish.id
                                  ).length
                                }{' '}
                                rules
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Create finishes first to set goals</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Created Rules */}
            <div className="space-y-6">
              {/* Rules List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Created Rules ({rules.length})</CardTitle>
                    <Drawer
                      open={isRuleDrawerOpen}
                      onOpenChange={setIsRuleDrawerOpen}
                    >
                      <DrawerTrigger asChild>
                        <Button size="sm" disabled={finishes.length === 0}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Rule
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[90vh]">
                        <DrawerHeader>
                          <DrawerTitle>
                            {editingRuleId ? 'Edit Rule' : 'Create New Rule'}
                          </DrawerTitle>
                        </DrawerHeader>

                        <div className="px-4 pb-4 overflow-y-auto">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Side - Monster Character */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="text-lg font-semibold">
                                Monster Preview
                              </div>
                              <div className="p-4 border rounded-lg bg-gray-50">
                                <MonsterCharacter
                                  selections={selections}
                                  hovered={hovered}
                                />
                              </div>

                              {/* Current Selections Display */}
                              {Object.keys(selections).length > 0 && (
                                <div className="w-full p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="text-sm font-medium text-blue-800 mb-2">
                                    Current Selections:
                                  </div>
                                  <div className="space-y-1">
                                    {Object.entries(selections).map(
                                      ([attribute, value]) => (
                                        <div
                                          key={attribute}
                                          className="text-sm text-blue-700"
                                        >
                                          {getDisplayValue(attribute, value)}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Side - Monster Part Wardrobe */}
                            <div className="space-y-4">
                              <div className="text-lg font-semibold">
                                Monster Parts
                              </div>

                              {/* Finish Selection */}
                              <div className="space-y-2">
                                <Label>Select Finish</Label>
                                <Select
                                  value={currentRuleFinish?.toString() || ''}
                                  onValueChange={(value) =>
                                    setCurrentRuleFinish(parseInt(value))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose a finish..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {finishes.map((finish) => (
                                      <SelectItem
                                        key={finish.id}
                                        value={finish.id.toString()}
                                      >
                                        {finish.name}
                                        {goals.includes(finish.id) && ' (Goal)'}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <MonsterPartWardrobe
                                selections={selections}
                                onSelection={handleSelection}
                                onHover={handleHover}
                                onMouseLeave={handleMouseLeave}
                              />

                              {/* Error display */}
                              {duplicateRuleError && (
                                <Alert>
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    {duplicateRuleError}
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        </div>

                        <DrawerFooter>
                          <div className="flex gap-2 w-full">
                            <Button
                              onClick={handleSaveRule}
                              disabled={!isCurrentRuleValid()}
                              className="flex-1"
                            >
                              {editingRuleId ? 'Update' : 'Add'} Rule
                            </Button>
                            <DrawerClose asChild>
                              <Button
                                variant="outline"
                                onClick={handleCancelRule}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </DrawerClose>
                          </div>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      Rules define monster combinations that lead to specific
                      finishes. Goal rules (highlighted) are what students must
                      reach.
                    </p>

                    {finishes.length === 0 && (
                      <div className="text-center text-gray-500 py-4 mb-4 bg-gray-50 rounded-lg border border-dashed">
                        <p className="text-sm">
                          Create some finishes first before adding rules
                        </p>
                      </div>
                    )}

                    {rules.length > 0 ? (
                      <>
                        {/* Rule Statistics */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-sm font-medium text-blue-800">
                              Total Rules
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {rules.length}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-sm font-medium text-green-800">
                              Goal Rules
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {
                                rules.filter((rule) =>
                                  goals.includes(rule.finish)
                                ).length
                              }
                            </div>
                          </div>
                        </div>

                        {/* Scrollable Rules List */}
                        <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                          {rules.map((rule) => {
                            const finish = finishes.find(
                              (f) => f.id === rule.finish
                            );
                            const isGoal = goals.includes(rule.finish);
                            return (
                              <div
                                key={rule.id}
                                className={`p-3 border rounded-lg ${
                                  isGoal
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-medium">
                                        Rule {rule.id}
                                      </span>
                                      <Badge
                                        variant={
                                          isGoal ? 'default' : 'secondary'
                                        }
                                        className={
                                          isGoal
                                            ? 'bg-green-100 text-green-800'
                                            : ''
                                        }
                                      >
                                        → {finish?.name || 'Unknown'}{' '}
                                        {isGoal && '(Goal)'}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {rule.conditions
                                        .map((cond) =>
                                          getDisplayValue(
                                            cond.attribute,
                                            cond.value
                                          )
                                        )
                                        .join(' AND ')}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditRule(rule)}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveRule(rule.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium mb-1">No Rules Created</p>
                        <p className="text-sm">
                          Create finishes first, then add rules that lead to
                          them
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full Width Decision Tree at the Bottom */}
          <div className="mt-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Decision Tree Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rules.length > 0 && finishes.length > 0 ? (
                  <div className="w-full h-96 overflow-auto">
                    <DecisionTree2
                      rules={rules}
                      finishes={finishes}
                      goals={goals}
                    />
                  </div>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No Decision Tree Yet
                      </p>
                      <p className="text-sm">
                        Create some finishes and rules to see the decision tree
                        visualization
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Nav Protection Dialog */}
          {showNavigationDialog && (
            <Dialog open={showNavigationDialog} onOpenChange={setShowDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Unsaved Changes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p>You have unsaved changes. What would you like to do?</p>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveAndLeave}>Save and Leave</Button>
                    <Button
                      variant="outline"
                      onClick={handleLeaveWithoutSaving}
                    >
                      Leave Without Saving
                    </Button>
                    <Button variant="outline" onClick={handleStayOnPage}>
                      Stay on Page
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          <CreationSubmissionModal
            isOpen={showSubmissionModal}
            isConfirming={true}
            onClose={() => setShowSubmissionModal(false)}
            onCancel={() => setShowSubmissionModal(false)}
            onConfirm={handleConfirmSubmit}
            questionData={{
              title: question.draft.title,
              questionType: question.draft.questionType.name,
              points: question.draft.points,
              estimatedTime: question.draft.estimatedTime,
              author: question.draft.teacher.name
            }}
          />
        </div>
      </div>
    </CreatorWrapper>
  );
}
