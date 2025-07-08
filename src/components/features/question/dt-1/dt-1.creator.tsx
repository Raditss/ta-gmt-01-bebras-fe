"use client";

import { DecisionTree2 } from "@/components/features/question/dt-1/shared/tree";
import MonsterCharacter from "@/components/features/question/dt-0/shared/monster-character";
import MonsterPartOption from "@/components/features/question/dt-0/shared/monster-part-option";
import { extractSpriteOptions } from "@/components/features/question/dt-0/solver/helper";
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType,
} from "@/components/features/question/dt-0/solver/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useCreateQuestion} from "@/hooks/useCreateQuestion";
import { usePageNavigationGuard } from "@/hooks/usePageNavigationGuard";
import { spritesheetParser } from "@/utils/helpers/spritesheet.helper";
import {
  Condition,
  DecisionTree2CreateQuestion,
  Finish,
  Rule,
} from "@/models/dt-1/dt-1.create.model";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  MapPin,
  Plus,
  Save,
  Target,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { BaseCreatorProps, CreatorWrapper } from "../../bases/base.creator";
import { CreationSubmissionModal } from "../submission-modal.creator";

import {useAuthStore} from "@/store/auth.store";
import {QuestionCreation} from "@/types/question.type";

const attributeLabels = {
  body: "Body",
  arms: "Arms",
  legs: "Legs",
  horns: "Horns",
  color: "Color",
};

// Helper function to create question instance
const createQuestionInstance = (
  data: QuestionCreation
): DecisionTree2CreateQuestion => {
  try {
    const instance = new DecisionTree2CreateQuestion(
      data.title,
      data.description,
      data.difficulty,
      data.category,
      data.points,
      data.estimatedTime,
      data.author,
      data.questionId,
      data.creatorId
    );
    return instance;
  } catch (error) {
    console.error("Error creating Decision Tree 2 question instance:", error);
    throw error;
  }
};

export default function Dt1Creator({
  questionId,
  initialData,
}: BaseCreatorProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Creation hook
  const {
    question,
    loading,
    saving,
    error: creationError,
    hasUnsavedChanges,
    saveDraft,
    submitCreation,
    markAsChanged,
  } = useCreateQuestion({
    questionId,
    questionType: "decision-tree-2",
    initialData,
    createQuestionInstance,
  });

  // Nav guard
  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog,
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft,
  });

  // Component state
  const [rules, setRules] = useState<Rule[]>([]);
  const [finishes, setFinishes] = useState<Finish[]>([]);
  const [goals, setGoals] = useState<number[]>([]);
  const [currentRuleSelections, setCurrentRuleSelections] = useState<
    Record<string, MonsterPartOptionType>
  >({});
  const [currentRuleFinish, setCurrentRuleFinish] = useState<number | null>(
    null
  );
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [isCreatingFinish, setIsCreatingFinish] = useState(false);
  const [editingFinishId, setEditingFinishId] = useState<number | null>(null);
  const [newFinishName, setNewFinishName] = useState("");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [duplicateRuleError, setDuplicateRuleError] = useState<string | null>(
    null
  );
  const [monsterParts, setMonsterParts] = useState<Record<
    MonsterPartType,
    MonsterPartOptionType[]
  > | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  // Load monster options from sprites
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setOptionsLoading(true);
        await spritesheetParser.loadXML(`${monsterAssetUrl}/spritesheet.xml`);

        const options = extractSpriteOptions();

        const parts: Record<MonsterPartType, MonsterPartOptionType[]> = {
          [MonsterPartType.COLOR]: options.colors,
          [MonsterPartType.HORN]: options.horns,
          [MonsterPartType.BODY]: options.body,
          [MonsterPartType.ARM]: options.arms,
          [MonsterPartType.LEG]: options.legs,
        };

        setMonsterParts(parts);
      } catch (error) {
        console.error("Failed to load monster options:", error);
      } finally {
        setOptionsLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Load existing data when question is loaded
  useEffect(() => {
    if (question) {
      const decisionTree2Question = question as DecisionTree2CreateQuestion;
      setRules(decisionTree2Question.rules || []);
      setFinishes(decisionTree2Question.finishes || []);
      setGoals(decisionTree2Question.goals || []);
    }
  }, [question]);

  // Handle monster part selection for rule creation
  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setCurrentRuleSelections((prev) => ({
        ...prev,
        [category]: value,
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
    const hasAllSelections = Object.keys(currentRuleSelections).length === 5;
    const hasFinishSelected = currentRuleFinish !== null;
    return hasAllSelections && hasFinishSelected;
  };

  // Create conditions from current selections
  const createConditionsFromSelections = (): Condition[] => {
    return Object.entries(currentRuleSelections).map(([attribute, option]) => ({
      attribute,
      operator: "=",
      value: option.value,
    }));
  };

  // Handle adding/updating rule
  const handleSaveRule = () => {
    if (!question || !isCurrentRuleValid()) return;

    const decisionTree2Question = question as DecisionTree2CreateQuestion;
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
      setDuplicateRuleError("A rule with these conditions already exists");
      return;
    }

    if (editingRuleId) {
      // Update existing rule
      const updatedRule: Rule = {
        id: editingRuleId,
        conditions,
        finish: currentRuleFinish!,
      };
      decisionTree2Question.updateRule(editingRuleId, updatedRule);
      setRules((prev) =>
        prev.map((rule) => (rule.id === editingRuleId ? updatedRule : rule))
      );
    } else {
      // Add new rule
      const newRule: Rule = {
        id: decisionTree2Question.getNextRuleId(),
        conditions,
        finish: currentRuleFinish!,
      };
      decisionTree2Question.addRule(newRule);
      setRules((prev) => [...prev, newRule]);
    }

    markAsChanged();
    handleCancelRule();
  };

  // Handle canceling rule creation/editing
  const handleCancelRule = () => {
    setIsCreatingRule(false);
    setEditingRuleId(null);
    setCurrentRuleSelections({});
    setCurrentRuleFinish(null);
    setDuplicateRuleError(null);
  };

  // Handle editing rule
  const handleEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setIsCreatingRule(true);

    // Convert conditions back to selections
    const selections: Record<string, MonsterPartOptionType> = {};
    rule.conditions.forEach((condition) => {
      selections[condition.attribute] = {
        value: condition.value,
        label: condition.value,
      };
    });
    setCurrentRuleSelections(selections);
    setCurrentRuleFinish(rule.finish);
  };

  // Handle removing rule
  const handleRemoveRule = (ruleId: number) => {
    if (!question) return;
    const decisionTree2Question = question as DecisionTree2CreateQuestion;
    decisionTree2Question.removeRule(ruleId);
    setRules((prev) => prev.filter((rule) => rule.id !== ruleId));
    markAsChanged();
  };

  // Handle adding/updating finish
  const handleSaveFinish = () => {
    if (!question || !newFinishName.trim()) return;

    const decisionTree2Question = question as DecisionTree2CreateQuestion;

    if (editingFinishId) {
      // Update existing finish
      const updatedFinish: Finish = {
        id: editingFinishId,
        name: newFinishName.trim(),
      };
      decisionTree2Question.updateFinish(editingFinishId, updatedFinish);
      setFinishes((prev) =>
        prev.map((finish) =>
          finish.id === editingFinishId ? updatedFinish : finish
        )
      );
    } else {
      // Add new finish
      const newFinish: Finish = {
        id: decisionTree2Question.getNextFinishId(),
        name: newFinishName.trim(),
      };
      decisionTree2Question.addFinish(newFinish);
      setFinishes((prev) => [...prev, newFinish]);
    }

    markAsChanged();
    handleCancelFinish();
  };

  // Handle canceling finish creation/editing
  const handleCancelFinish = () => {
    setIsCreatingFinish(false);
    setEditingFinishId(null);
    setNewFinishName("");
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
    const decisionTree2Question = question as DecisionTree2CreateQuestion;
    decisionTree2Question.removeFinish(finishId);
    setFinishes((prev) => prev.filter((finish) => finish.id !== finishId));
    setGoals((prev) => prev.filter((goalId) => goalId !== finishId));
    markAsChanged();
  };

  // Handle toggling goal
  const handleToggleGoal = (finishId: number) => {
    if (!question) return;
    const decisionTree2Question = question as DecisionTree2CreateQuestion;
    decisionTree2Question.toggleGoal(finishId);

    if (goals.includes(finishId)) {
      setGoals((prev) => prev.filter((goalId) => goalId !== finishId));
    } else {
      setGoals((prev) => [...prev, finishId]);
    }
    markAsChanged();
  };

  // Handle manual save
  const handleManualSave = async () => {
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!question) return;
    const decisionTree2Question = question as DecisionTree2CreateQuestion;
    if (decisionTree2Question.validateQuestion()) {
      setShowSubmissionModal(true);
    } else {
      // Show validation errors
      const errors = [];
      if (rules.length === 0) errors.push("At least one rule is required");
      if (finishes.length === 0) errors.push("At least one finish is required");
      if (goals.length === 0)
        errors.push("At least one goal finish is required");

      alert(`Please fix the following issues:\n- ${errors.join("\n- ")}`);
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
      loading={loading || authLoading || optionsLoading}
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
              <Button
                variant="outline"
                onClick={handleManualSave}
                disabled={saving}
              >
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

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Finishes Management */}
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
                          onChange={(e) => setNewFinishName(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveFinish}
                            disabled={!newFinishName.trim()}
                          >
                            {editingFinishId ? "Update" : "Add"} Finish
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

              {/* Rules List */}
              <Card>
                <CardHeader>
                  <CardTitle>Created Rules ({rules.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {rules.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-4">
                        Rules define monster combinations that lead to specific
                        finishes. Goal rules (highlighted) are what students
                        must reach.
                      </p>

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
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">
                                    Rule {rule.id}
                                  </span>
                                  <Badge
                                    variant={isGoal ? "default" : "secondary"}
                                    className={
                                      isGoal
                                        ? "bg-green-100 text-green-800"
                                        : ""
                                    }
                                  >
                                    → {finish?.name || "Unknown"}{" "}
                                    {isGoal && "(Goal)"}
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
                                    .join(" AND ")}
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
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium mb-1">No Rules Created</p>
                      <p className="text-sm">
                        Create finishes first, then add rules that lead to them
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - Decision Tree Visualization */}
            <div className="space-y-6">
              {/* Decision Tree Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Decision Tree Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rules.length > 0 && finishes.length > 0 ? (
                    <div className="h-96 overflow-auto">
                      <DecisionTree2
                        rules={rules}
                        finishes={finishes}
                        goals={goals}
                        selections={{}}
                        onRuleSelect={(ruleId) => {
                          console.log("Rule clicked:", ruleId);
                        }}
                        selectedRules={[]}
                      />
                    </div>
                  ) : (
                    <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center text-gray-500">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No Decision Tree Yet
                        </p>
                        <p className="text-sm">
                          Create some finishes and rules to see the decision
                          tree visualization
                        </p>
                      </div>
                    </div>
                  )}
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
                              Goals: {goals.length} of {finishes.length}{" "}
                              finishes
                            </p>
                            <p>
                              Goal Rules:{" "}
                              {
                                rules.filter((rule) =>
                                  goals.includes(rule.finish)
                                ).length
                              }{" "}
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
                            if (question) {
                              const decisionTree2Question =
                                question as DecisionTree2CreateQuestion;
                              decisionTree2Question.setGoals(allFinishIds);
                              markAsChanged();
                            }
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
                            if (question) {
                              const decisionTree2Question =
                                question as DecisionTree2CreateQuestion;
                              decisionTree2Question.setGoals([]);
                              markAsChanged();
                            }
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
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200"
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
                                }{" "}
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

            {/* Right Column - Rule Creation */}
            <div className="space-y-6">
              {/* Monster Character Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Rule Creation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 border rounded-lg bg-gray-50">
                      <MonsterCharacter
                        selections={currentRuleSelections}
                        hovered={hovered}
                      />
                    </div>

                    {/* Rule Form */}
                    {(isCreatingRule || editingRuleId) && (
                      <div className="w-full space-y-4">
                        {/* Finish Selection */}
                        <div className="space-y-2">
                          <Label>Select Finish</Label>
                          <Select
                            value={currentRuleFinish?.toString() || ""}
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
                                  {goals.includes(finish.id) && " (Goal)"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Monster part selection */}
                        {monsterParts && (
                          <Tabs
                            defaultValue={Object.keys(monsterParts)[0]}
                            className="w-full"
                          >
                            <TabsList className="grid w-full grid-cols-5">
                              {Object.keys(monsterParts).map((part) => (
                                <TabsTrigger
                                  key={part}
                                  value={part}
                                  className="text-xs"
                                >
                                  {part.replace(/_/g, " ")}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            {Object.keys(monsterParts).map((part) => (
                              <TabsContent
                                key={part}
                                value={part}
                                className="w-full"
                              >
                                <Carousel className="w-full max-w-xs mx-auto">
                                  <CarouselContent>
                                    {monsterParts[part as MonsterPartType].map(
                                      (option) => (
                                        <CarouselItem
                                          key={option.value}
                                          className="basis-1/3"
                                        >
                                          <MonsterPartOption
                                            option={option}
                                            selected={
                                              currentRuleSelections[part]
                                                ?.value === option.value
                                            }
                                            onMouseEnter={() =>
                                              handleHover(
                                                part as MonsterPartType,
                                                option.value
                                              )
                                            }
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() =>
                                              handleSelection(
                                                part as MonsterPartType,
                                                option
                                              )
                                            }
                                          />
                                        </CarouselItem>
                                      )
                                    )}
                                  </CarouselContent>
                                  <CarouselPrevious />
                                  <CarouselNext />
                                </Carousel>
                              </TabsContent>
                            ))}
                          </Tabs>
                        )}

                        {/* Error display */}
                        {duplicateRuleError && (
                          <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              {duplicateRuleError}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveRule}
                            disabled={!isCurrentRuleValid()}
                          >
                            {editingRuleId ? "Update" : "Add"} Rule
                          </Button>
                          <Button variant="outline" onClick={handleCancelRule}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isCreatingRule && !editingRuleId && (
                      <Button
                        onClick={() => setIsCreatingRule(true)}
                        className="w-full"
                        disabled={finishes.length === 0}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Rule
                      </Button>
                    )}

                    {finishes.length === 0 && (
                      <p className="text-sm text-gray-500 text-center">
                        Create some finishes first before adding rules
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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

          {/* Submission Modal */}
          <CreationSubmissionModal
            isOpen={showSubmissionModal}
            isConfirming={true}
            onClose={() => setShowSubmissionModal(false)}
            onCancel={() => setShowSubmissionModal(false)}
            onConfirm={handleConfirmSubmit}
            questionData={
              question
                ? {
                    title: question.getTitle(),
                    description: question.getDescription(),
                    difficulty: question.getDifficulty(),
                    category: question.getCategory(),
                    points: question.getPoints(),
                    estimatedTime: question.getEstimatedTime(),
                    author: question.getAuthor(),
                  }
                : null
            }
          />
        </div>
      </div>
    </CreatorWrapper>
  );
}
