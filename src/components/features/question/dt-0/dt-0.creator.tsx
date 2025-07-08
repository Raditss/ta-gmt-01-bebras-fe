import MonsterCharacter from "@/components/features/question/dt-0/shared/monster-character";
import MonsterPartOption from "@/components/features/question/dt-0/shared/monster-part-option";
import { DecisionTree } from "@/components/features/question/dt-0/shared/tree";
import { extractSpriteOptions } from "@/components/features/question/dt-0/solver/helper";
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType,
} from "@/components/features/question/dt-0/solver/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {useCreateQuestion} from "@/hooks/useCreateQuestion";
import { usePageNavigationGuard } from "@/hooks/usePageNavigationGuard";
import { spritesheetParser } from "@/utils/helpers/spritesheet.helper";
import {
  Condition,
  DecisionTreeCreateQuestion,
  Rule,
} from "@/models/dt-0/dt-0.create.model";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { BaseCreatorProps, CreatorWrapper } from "../../bases/base.creator";
import { CreationSubmissionModal } from "../submission-modal.creator";

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
): DecisionTreeCreateQuestion => {
  try {
    const instance = new DecisionTreeCreateQuestion(
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
    console.error("Error creating Decision Tree question instance:", error);
    throw error;
  }
};

// Removed old RuleFormData interface - now using MonsterPartOptionType selections

export default function Dt0Creator({
  questionId,
  initialData,
}: BaseCreatorProps) {
  const router = useRouter();

  // Creation hook
  const {
    question,
    loading,
    saving,
    error: creationError,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged,
  } = useCreateQuestion({
    questionId,
    questionType: "decision-tree",
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
  const [currentRuleSelections, setCurrentRuleSelections] = useState<
    Record<string, MonsterPartOptionType>
  >({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
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

  // Load existing rules when question is loaded
  useEffect(() => {
    if (question) {
      const decisionTreeQuestion = question as DecisionTreeCreateQuestion;
      setRules(decisionTreeQuestion.rules || []);
    }
  }, [question]);

  // Handle monster part selection for rule creation
  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setCurrentRuleSelections((prev) => ({
        ...prev,
        [category]: value,
      }));
      // Clear duplicate error when selections change
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

  // Validate current rule selections
  const isCurrentRuleValid = () => {
    const requiredParts = [
      MonsterPartType.BODY,
      MonsterPartType.ARM,
      MonsterPartType.LEG,
      MonsterPartType.HORN,
      MonsterPartType.COLOR,
    ];
    return requiredParts.every((part) => currentRuleSelections[part]);
  };

  // Create conditions from current selections
  const createConditionsFromSelections = (): Condition[] => {
    const conditions = [
      {
        attribute: "body",
        operator: "=",
        value: currentRuleSelections[MonsterPartType.BODY]?.value || "",
      },
      {
        attribute: "arms",
        operator: "=",
        value: currentRuleSelections[MonsterPartType.ARM]?.value || "",
      },
      {
        attribute: "legs",
        operator: "=",
        value: currentRuleSelections[MonsterPartType.LEG]?.value || "",
      },
      {
        attribute: "horns",
        operator: "=",
        value: currentRuleSelections[MonsterPartType.HORN]?.value || "",
      },
      {
        attribute: "color",
        operator: "=",
        value: currentRuleSelections[MonsterPartType.COLOR]?.value || "",
      },
    ];

    console.log("Created conditions from selections:", conditions);
    console.log("Current rule selections:", currentRuleSelections);

    return conditions;
  };

  // Check if a rule with the same conditions already exists
  const checkForDuplicateRule = useCallback(
    (conditions: Condition[], excludeRuleId?: number): number | null => {
      const duplicateRule = rules.find((rule) => {
        if (excludeRuleId && rule.id === excludeRuleId) {
          return false; // Skip the rule being edited
        }

        // Check if all conditions match exactly
        if (rule.conditions.length !== conditions.length) {
          return false;
        }

        // Create a normalized comparison by sorting conditions by attribute
        const sortConditions = (conds: Condition[]) =>
          [...conds].sort((a, b) => a.attribute.localeCompare(b.attribute));

        const sortedExisting = sortConditions(rule.conditions);
        const sortedNew = sortConditions(conditions);

        // Compare each condition exactly
        return sortedExisting.every((existingCondition, index) => {
          const newCondition = sortedNew[index];
          const match =
            existingCondition.attribute === newCondition.attribute &&
            existingCondition.operator === newCondition.operator &&
            existingCondition.value === newCondition.value;
          console.log(`Comparing condition ${index}:`, {
            existing: existingCondition,
            new: newCondition,
            match,
          });
          return match;
        });
      });

      return duplicateRule?.id || null;
    },
    [rules]
  );

  // Add new rule
  const handleAddRule = useCallback(() => {
    if (!question || !isCurrentRuleValid()) return;

    const conditions = createConditionsFromSelections();

    // Debug logging
    console.log("Creating new rule with conditions:", conditions);
    console.log(
      "Existing rules:",
      rules.map((r) => ({ id: r.id, conditions: r.conditions }))
    );

    const duplicateRuleId = checkForDuplicateRule(conditions);

    console.log("Duplicate rule check result:", duplicateRuleId);

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const decisionTreeQuestion = question as DecisionTreeCreateQuestion;
    const newRule: Rule = {
      id: Date.now(), // Simple ID generation
      conditions,
    };

    const updatedRules = [...rules, newRule];
    decisionTreeQuestion.setRules(updatedRules);
    setRules(updatedRules);
    setCurrentRuleSelections({});
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
    markAsChanged();
  }, [
    question,
    rules,
    currentRuleSelections,
    markAsChanged,
    checkForDuplicateRule,
  ]);

  // Edit existing rule
  const handleEditRule = useCallback(
    (ruleId: number) => {
      const rule = rules.find((r) => r.id === ruleId);
      if (!rule || !monsterParts) return;

      // Populate selections with rule data
      const selections: Record<string, MonsterPartOptionType> = {};

      rule.conditions.forEach((condition) => {
        let partType: MonsterPartType;
        let parts: MonsterPartOptionType[];

        switch (condition.attribute) {
          case "body":
            partType = MonsterPartType.BODY;
            parts = monsterParts[MonsterPartType.BODY];
            break;
          case "arms":
            partType = MonsterPartType.ARM;
            parts = monsterParts[MonsterPartType.ARM];
            break;
          case "legs":
            partType = MonsterPartType.LEG;
            parts = monsterParts[MonsterPartType.LEG];
            break;
          case "horns":
            partType = MonsterPartType.HORN;
            parts = monsterParts[MonsterPartType.HORN];
            break;
          case "color":
            partType = MonsterPartType.COLOR;
            parts = monsterParts[MonsterPartType.COLOR];
            break;
          default:
            return;
        }

        const option = parts.find((p) => p.value === condition.value);
        if (option) {
          selections[partType] = option;
        }
      });

      setCurrentRuleSelections(selections);
      setEditingRuleId(ruleId);
      setIsCreatingRule(true);
    },
    [rules, monsterParts]
  );

  // Update existing rule
  const handleUpdateRule = useCallback(() => {
    if (!question || !isCurrentRuleValid() || editingRuleId === null) return;

    const conditions = createConditionsFromSelections();
    const duplicateRuleId = checkForDuplicateRule(conditions, editingRuleId);

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const decisionTreeQuestion = question as DecisionTreeCreateQuestion;
    const updatedRule: Rule = {
      id: editingRuleId,
      conditions,
    };

    const updatedRules = rules.map((rule) =>
      rule.id === editingRuleId ? updatedRule : rule
    );

    decisionTreeQuestion.setRules(updatedRules);
    setRules(updatedRules);
    setCurrentRuleSelections({});
    setEditingRuleId(null);
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
    markAsChanged();
  }, [
    question,
    rules,
    currentRuleSelections,
    editingRuleId,
    markAsChanged,
    checkForDuplicateRule,
  ]);

  // Delete rule
  const handleDeleteRule = useCallback(
    (ruleId: number) => {
      if (!question) return;

      const decisionTreeQuestion = question as DecisionTreeCreateQuestion;
      const updatedRules = rules.filter((rule) => rule.id !== ruleId);

      decisionTreeQuestion.setRules(updatedRules);
      setRules(updatedRules);
      markAsChanged();
    },
    [question, rules, markAsChanged]
  );

  // Cancel rule creation/editing
  const handleCancelRule = () => {
    setCurrentRuleSelections({});
    setEditingRuleId(null);
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
  };

  // Manual save
  const handleManualSave = async () => {
    await saveDraft();
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  // Submit creation
  const handleSubmit = () => {
    if (rules.length === 0) {
      alert("Please add at least one rule before submitting.");
      return;
    }
    setShowSubmissionModal(true);
  };

  const handleConfirmSubmit = async () => {
    await submitCreation();
  };

  const getQuestionData = () => {
    if (!question) return null;
    return {
      title: question.getTitle(),
      description: question.getDescription(),
      difficulty: question.getDifficulty(),
      category: question.getCategory(),
      points: question.getPoints(),
      estimatedTime: question.getEstimatedTime(),
      author: question.getAuthor(),
      type: "Decision Tree",
      rulesCount: rules.length,
    };
  };

  // Handle rule selection from tree visualization
  const handleRuleSelection = useCallback((ruleId: number) => {
    setSelectedRuleId(ruleId);
  }, []);

  // Convert current selections to format expected by DecisionTree
  const getTreeSelections = (): Record<string, string> => {
    return {
      body: currentRuleSelections[MonsterPartType.BODY]?.value || "",
      arms: currentRuleSelections[MonsterPartType.ARM]?.value || "",
      legs: currentRuleSelections[MonsterPartType.LEG]?.value || "",
      horns: currentRuleSelections[MonsterPartType.HORN]?.value || "",
      color: currentRuleSelections[MonsterPartType.COLOR]?.value || "",
    };
  };

  // Get display value for attribute
  const getDisplayValue = (attribute: string, value: string) => {
    if (!monsterParts) return value;

    let partType: MonsterPartType;
    switch (attribute) {
      case "body":
        partType = MonsterPartType.BODY;
        break;
      case "arms":
        partType = MonsterPartType.ARM;
        break;
      case "legs":
        partType = MonsterPartType.LEG;
        break;
      case "horns":
        partType = MonsterPartType.HORN;
        break;
      case "color":
        partType = MonsterPartType.COLOR;
        break;
      default:
        return value;
    }

    const options = monsterParts[partType];
    return (
      options?.find((opt: MonsterPartOptionType) => opt.value === value)
        ?.label || value
    );
  };

  // Handle loading states
  if (optionsLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <CreatorWrapper
      loading={loading}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      {question ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {questionId === "new"
                ? "Create New Decision Tree Question"
                : "Edit Decision Tree Question"}
            </h1>

            <Button
              onClick={handleManualSave}
              disabled={saving || !hasUnsavedChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
          </div>

          {/* Status Messages */}
          {saving && (
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Saving draft...</AlertDescription>
            </Alert>
          )}

          {showSaveConfirmation && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Draft saved successfully!</AlertDescription>
            </Alert>
          )}

          {lastSavedDraft && !showSaveConfirmation && (
            <Alert className="mb-4 bg-gray-50 text-gray-800 border-gray-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Last saved at {lastSavedDraft.toLocaleTimeString()}
              </AlertDescription>
            </Alert>
          )}

          {/* Description */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto text-center">
            <p className="text-gray-700">
              Create decision tree rules by dressing up monsters! Use the
              wardrobe below to select different monster parts, then add each
              complete combination as a rule. Students will use these rules to
              solve decision tree challenges.
            </p>
          </div>

          {/* Main Content - Wardrobe Style Similar to Solve Page */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
            {/* Monster Character and Wardrobe */}
            <div className="flex flex-col items-center">
              <div className="mb-8 p-6 w-fit h-fit rounded-lg shadow-lg flex items-center justify-center">
                <MonsterCharacter
                  selections={currentRuleSelections}
                  hovered={hovered}
                />
              </div>

              {monsterParts && (
                <Tabs
                  defaultValue={Object.keys(monsterParts)[0]}
                  className="mt-4"
                >
                  <TabsList className="flex justify-center">
                    {Object.keys(monsterParts).map((part) => (
                      <TabsTrigger
                        key={part}
                        value={part}
                        className="capitalize"
                      >
                        {part.replace(/_/g, " ")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.keys(monsterParts).map((part) => (
                    <TabsContent
                      key={part}
                      value={part}
                      className="w-full h-full"
                    >
                      {monsterParts[part as MonsterPartType] &&
                        (monsterParts[part as MonsterPartType].length < 4 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {monsterParts[part as MonsterPartType].map(
                              (option, index) => (
                                <MonsterPartOption
                                  key={index}
                                  option={option}
                                  selected={
                                    currentRuleSelections[part]?.label ===
                                    option.label
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
                              )
                            )}
                          </div>
                        ) : (
                          <Carousel className="z-50" opts={{}}>
                            <CarouselContent className="w-full">
                              {Array.from({
                                length: Math.ceil(
                                  monsterParts[part as MonsterPartType].length /
                                    4
                                ),
                              }).map((_, pageIndex) => (
                                <CarouselItem key={pageIndex}>
                                  <div className="grid grid-cols-2 gap-2">
                                    {monsterParts[part as MonsterPartType]
                                      .slice(pageIndex * 4, (pageIndex + 1) * 4)
                                      .map((option, index) => (
                                        <MonsterPartOption
                                          key={index}
                                          option={option}
                                          selected={
                                            currentRuleSelections[part]
                                              ?.label === option.label
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
                                      ))}
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        ))}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>

            {/* Rule Management Panel */}
            <div className="xl:col-span-2">
              <div className="p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {editingRuleId ? "Edit Rule" : "Rule Creation"}
                  </h2>
                  {isCreatingRule && (
                    <Button
                      variant="outline"
                      onClick={handleCancelRule}
                      className="flex items-center gap-2"
                    >
                      Cancel
                    </Button>
                  )}
                </div>

                {isCreatingRule ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {editingRuleId
                        ? "Modify the monster characteristics using the wardrobe on the left."
                        : "Select monster characteristics using the wardrobe on the left to create a new rule."}
                    </p>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">Current Selections:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {Object.entries(attributeLabels).map(([key, label]) => {
                          const partType =
                            key === "arms"
                              ? MonsterPartType.ARM
                              : key === "legs"
                              ? MonsterPartType.LEG
                              : key === "horns"
                              ? MonsterPartType.HORN
                              : key === "color"
                              ? MonsterPartType.COLOR
                              : MonsterPartType.BODY;
                          const selection = currentRuleSelections[partType];

                          return (
                            <div key={key} className="text-center">
                              <p className="text-xs text-gray-500 mb-1">
                                {label}
                              </p>
                              <Badge
                                variant={selection ? "default" : "secondary"}
                              >
                                {selection ? selection.label : "Not selected"}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {duplicateRuleError && (
                      <Alert className="bg-red-50 text-red-800 border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {duplicateRuleError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={
                          editingRuleId ? handleUpdateRule : handleAddRule
                        }
                        disabled={!isCurrentRuleValid()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      >
                        {editingRuleId ? "Update Rule" : "Add Rule"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      {rules.length === 0
                        ? "Start creating your first monster rule using the wardrobe."
                        : `You have created ${rules.length} rule${
                            rules.length === 1 ? "" : "s"
                          }. Create more rules or finish your question.`}
                    </p>
                    <Button
                      onClick={() => setIsCreatingRule(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {rules.length === 0
                        ? "Create First Rule"
                        : "Add Another Rule"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Decision Tree Visualization */}
              {rules.length > 0 && (
                <div className="mt-6">
                  <DecisionTree
                    rules={rules}
                    selections={getTreeSelections()}
                    onRuleSelect={handleRuleSelection}
                    selectedRule={selectedRuleId}
                  />

                  {/* Selected Rule Actions */}
                  {selectedRuleId && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-blue-900">
                            Selected Rule #
                            {rules.findIndex((r) => r.id === selectedRuleId) +
                              1}
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Click Edit to modify this rule or Delete to remove
                            it
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRule(selectedRuleId)}
                            disabled={isCreatingRule}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              handleDeleteRule(selectedRuleId);
                              setSelectedRuleId(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rules List for Detailed Management */}
              {rules.length > 0 && (
                <div className="mt-6 p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Rule Details ({rules.length})
                  </h3>
                  <div className="space-y-3">
                    {rules.map((rule, index) => (
                      <Card
                        key={rule.id}
                        className={`border-l-4 transition-all ${
                          selectedRuleId === rule.id
                            ? "border-l-blue-500 bg-blue-50"
                            : "border-l-gray-300"
                        }`}
                      >
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">
                                Rule #{index + 1}
                                {selectedRuleId === rule.id && (
                                  <Badge variant="default" className="ml-2">
                                    Selected
                                  </Badge>
                                )}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {rule.conditions.map((condition) => (
                                  <Badge
                                    key={condition.attribute}
                                    variant="secondary"
                                  >
                                    {
                                      attributeLabels[
                                        condition.attribute as keyof typeof attributeLabels
                                      ]
                                    }
                                    :{" "}
                                    {getDisplayValue(
                                      condition.attribute,
                                      condition.value
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRuleId(rule.id);
                                  handleEditRule(rule.id);
                                }}
                                disabled={isCreatingRule}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  handleDeleteRule(rule.id);
                                  if (selectedRuleId === rule.id) {
                                    setSelectedRuleId(null);
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State - No Rules Created Yet */}
              {rules.length === 0 && !isCreatingRule && (
                <div className="mt-6 p-8 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-blue-100 rounded-full p-4">
                        <svg
                          className="w-12 h-12 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Rules Created Yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                        Your decision tree is empty! Use the monster wardrobe on
                        the left to create your first rule. Each rule defines a
                        unique combination of monster characteristics that
                        students will use to navigate the decision tree.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200 max-w-lg mx-auto">
                      <h4 className="font-medium text-gray-900 mb-2">
                        How to create a rule:
                      </h4>
                      <ol className="text-sm text-gray-600 text-left space-y-1">
                        <li className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                            1
                          </span>
                          <span>
                            Select monster parts from each tab (Body, Arms,
                            Legs, Horns, Color)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                            2
                          </span>
                          <span>
                            Click &quot;Create First Rule&quot; when all parts
                            are selected
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                            3
                          </span>
                          <span>
                            Repeat to add more rules with different combinations
                          </span>
                        </li>
                      </ol>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => setIsCreatingRule(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                        size="lg"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Start Creating Rules
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Finish Button */}
          {rules.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Ready to Finish?
                    </h3>
                    <p className="text-gray-600">
                      You have created {rules.length} rule
                      {rules.length === 1 ? "" : "s"}. Click &quot;Finish
                      Question&quot; to save and submit your decision tree
                      question.
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    size="lg"
                  >
                    Finish Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions for new users */}
          {rules.length === 0 && !isCreatingRule && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get Started</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Create decision tree rules by defining monster
                      characteristics. Each rule should specify all monster
                      attributes (body, arms, legs, horns, and color). Students
                      will use these rules to identify monsters in the decision
                      tree challenge.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsCreatingRule(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                    size="lg"
                  >
                    Create Your First Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submission Modal */}
          <CreationSubmissionModal
            isOpen={showSubmissionModal}
            isConfirming={!saving}
            questionData={getQuestionData()}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setShowSubmissionModal(false)}
            onClose={() => {
              setShowSubmissionModal(false);
              router.push("/add-problem");
            }}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No question data available</p>
        </div>
      )}
    </CreatorWrapper>
  );
}
