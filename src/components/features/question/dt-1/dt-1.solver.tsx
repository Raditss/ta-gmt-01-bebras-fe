"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questionService } from "@/lib/services/question.service";
import { Clock, Target, Plus, Trash2 } from "lucide-react";
import MonsterCharacter from "@/components/features/question/dt-0/shared/monster-character";
import { BaseSolverProps, SolverWrapper } from "../../bases/base.solver";
import { useDuration } from "@/hooks/useDuration";
import { spritesheetParser } from "@/utils/helpers/spritesheet.helper";
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType,
} from "../dt-0/solver/types";
import { extractSpriteOptions } from "../dt-0/solver/helper";
import MonsterPartOption from "@/components/features/question/dt-0/shared/monster-part-option";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DecisionTree2 } from "@/components/features/question/dt-1/shared/tree";
import {CombinationAnswer, DecisionTree2SolveModel} from "@/models/dt-1/dt-1.solve.model";
import {useSolveQuestion} from "@/hooks/useSolveQuestion";
import {useAuthStore} from "@/store/auth.store";

// Local interface for UI state management
interface UICombination extends CombinationAnswer {
  id: string; // UI identifier
}

export default function DecisionTree2Solver({ questionId }: BaseSolverProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { question, loading, error, currentDuration } =
    useSolveQuestion<DecisionTree2SolveModel>(questionId, DecisionTree2SolveModel);
  const [selections, setSelections] = useState<
    Record<string, MonsterPartOptionType>
  >({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [savedCombinations, setSavedCombinations] = useState<UICombination[]>(
    []
  );
  const [monsterParts, setMonsterParts] = useState<Record<
    MonsterPartType,
    MonsterPartOptionType[]
  > | null>(null);
  const { formattedDuration, getCurrentDuration } = useDuration(
    currentDuration()
  );

  useEffect(() => {
    const initializeMonsterParts = async () => {
      try {
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
        console.error("Failed to load monster parts:", error);
      }
    };

    initializeMonsterParts();
  }, []);

  // Load existing state when question is loaded
  useEffect(() => {
    if (question) {
      const userSelections = question.getUserSelections();
      const newSelections: Record<string, MonsterPartOptionType> = {};

      // Convert user selections back to MonsterPartOptionType
      Object.entries(userSelections).forEach(([attribute, value]) => {
        newSelections[attribute] = { value, label: value };
      });

      setSelections(newSelections);

      // Load saved combinations from the model using new format
      const modelCombinations = question.getUserCombinations();
      const componentCombinations: UICombination[] = modelCombinations.map(
        (combo, index) => ({
          id: `combo-${index}`,
          parts: combo.parts,
          ruleId: combo.ruleId,
        })
      );
      setSavedCombinations(componentCombinations);

      // Check if current combinations are correct
      const correct = checkAllCombinations();
      console.log("correct 1: ", correct);
      setIsCorrect(correct);
    }
  }, [question]);

  // Helper function to check combinations (can take custom combinations)
  const checkCombinations = useCallback(
    (combinations: UICombination[]) => {
      if (!question || combinations.length === 0) return false;

      const allGoalRules = question.getGoalRules();

      // Get all rule IDs that can be triggered by the combinations
      const reachableRules = new Set(combinations.map((combo) => combo.ruleId));

      console.log("reachableRules", reachableRules);
      console.log("allGoalRules", allGoalRules);

      // Return true only if ALL goal rules can be triggered by the combinations
      return allGoalRules.every((rule) => reachableRules.has(rule.id));
    },
    [question]
  );

  // Check if all goal rules can be triggered by the current saved combinations
  const checkAllCombinations = useCallback(() => {
    return checkCombinations(savedCombinations);
  }, [checkCombinations, savedCombinations]);

  // Get which goal rules the current selection can trigger
  const getCurrentReachableGoals = useCallback(() => {
    if (!question) return [];

    const userSelections = question.getUserSelections();
    const requiredAttributes = ["body", "arms", "legs", "horns", "color"];
    const hasAllSelections = requiredAttributes.every(
      (attr) => userSelections[attr] !== undefined
    );

    if (!hasAllSelections) return [];

    const reachableRules: number[] = [];
    const goalRules = question.getGoalRules();

    goalRules.forEach((rule) => {
      const canTriggerRule = rule.conditions.every((condition) => {
        const userValue = userSelections[condition.attribute];
        return userValue === condition.value;
      });

      if (canTriggerRule) {
        reachableRules.push(rule.id);
      }
    });

    return reachableRules;
  }, [question]);

  // Add current monster combination to saved combinations
  const handleAddCombination = useCallback(() => {
    if (!question) return;

    const userSelections = question.getUserSelections();
    const requiredAttributes = ["body", "arms", "legs", "horns", "color"];
    const hasAllSelections = requiredAttributes.every(
      (attr) => userSelections[attr] !== undefined
    );

    if (!hasAllSelections) return;

    const reachableGoals = getCurrentReachableGoals();
    if (reachableGoals.length === 0) return; // Don't add combinations that trigger no goal rules

    // Use the first reachable goal rule as the rule ID for this combination
    const primaryRuleId = reachableGoals[0];

    const newCombination: UICombination = {
      id: Date.now().toString(),
      parts: { ...userSelections },
      ruleId: primaryRuleId,
    };

    // Check if this exact combination already exists
    const alreadyExists = savedCombinations.some(
      (combo) =>
        JSON.stringify(combo.parts) === JSON.stringify(newCombination.parts)
    );

    if (!alreadyExists) {
      const newCombinations = [...savedCombinations, newCombination];
      setSavedCombinations(newCombinations);

      // Update the model using new format
      const modelCombinations: CombinationAnswer[] = newCombinations.map(
        (combo) => ({
          parts: combo.parts,
          ruleId: combo.ruleId,
        })
      );
      question.setUserCombinations(modelCombinations);

      // Check if we now have a complete solution using the fresh combinations
      const correct = checkCombinations(newCombinations);
      console.log("correct 2: ", correct);
      setIsCorrect(correct);
    }
  }, [
    question,
    savedCombinations,
    getCurrentReachableGoals,
    checkCombinations,
  ]);

  // Remove a saved combination
  const handleRemoveCombination = useCallback(
    (combinationId: string) => {
      const newCombinations = savedCombinations.filter(
        (combo) => combo.id !== combinationId
      );
      setSavedCombinations(newCombinations);

      if (question) {
        // Update the model using new format
        const modelCombinations: CombinationAnswer[] = newCombinations.map(
          (combo) => ({
            parts: combo.parts,
            ruleId: combo.ruleId,
          })
        );
        question.setUserCombinations(modelCombinations);

        // Update correctness using fresh combinations
        const correct = checkCombinations(newCombinations);
        console.log("correct 3: ", correct);
        setIsCorrect(correct);
      }
    },
    [savedCombinations, question, checkCombinations]
  );

  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      if (!question) return;

      setSelections((prev) => {
        const newSelections = { ...prev, [category]: value };
        question.setSelection(category, value.value);

        // Check if current selections are correct
        // const correct = question.checkAnswer();
        // setIsCorrect(correct);

        return newSelections;
      });
    },
    [question]
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

  const handleTreeNodeClick = useCallback((ruleId: number) => {
    // Tree node clicks now just show information, no rule selection needed
    console.log("Clicked rule:", ruleId);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!question || !isCorrect) return;

    question.setAttemptData(getCurrentDuration(), false);
    const { isDraft: _isDraft, ...attemptData } = question.getAttemptData();
    console.log("Saving draft attempt data:", JSON.parse(attemptData.answer));

    await questionService.submitAttempt({
      ...attemptData,
      answer: JSON.parse(attemptData.answer),
    });

    router.push(`/problems/${questionId}`);
  }, [question, user?.id, isCorrect, getCurrentDuration, router, questionId]);

  const handleSave = useCallback(async () => {
    if (!question) return;

    question.setAttemptData(getCurrentDuration(), true);
    const { isDraft: _isDraft, ...attemptData } = question.getAttemptData();
    await questionService.saveDraft({
      ...attemptData,
      answer: JSON.parse(attemptData.answer)
    });
  }, [question, user?.id, getCurrentDuration]);

  const handleReset = useCallback(() => {
    setSelections({});
    setHovered(null);
    setIsCorrect(null);
    setSavedCombinations([]);
    if (question) {
      question.resetToInitialState();
    }
  }, [question]);

  return (
    <SolverWrapper loading={loading} error={error}>
      <div className="container mx-auto px-4">
        {question && (
          <>
            <div className="flex items-center justify-between mb-2 float-right">
              <div className="flex items-center space-x-4 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{formattedDuration}</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {/* TODO */}
              {/*{question.getTitle()}*/}
            </h1>

            <div className="mb-6 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
              <p className="text-gray-700 mb-4">
                Help the monster reach the goal destinations! Select different
                clothing items to dress up the monster. Find a combination that
                leads to one of the goal finishes shown in the decision tree.
              </p>

              {/* Goal indicators */}
              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm font-medium text-gray-600">
                  Goals:
                </span>
                {question.getGoals().map((goalId) => {
                  const finish = question
                    .getFinishes()
                    .find((f) => f.id === goalId);
                  return (
                    <Badge
                      key={goalId}
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {finish?.name || `Goal ${goalId}`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
              {/* Decision Tree Visualization */}
              <div className="xl:col-span-2">
                <DecisionTree2
                  rules={question.getRules()}
                  finishes={question.getFinishes()}
                  goals={question.getGoals()}
                  selections={question.getUserSelections()}
                  onRuleSelect={handleTreeNodeClick}
                  selectedRules={[]}
                />
              </div>

              {/* Monster Character */}
              <div className="flex flex-col items-center">
                <div className="mb-8 p-6 w-fit h-fit rounded-lg shadow-lg flex items-center justify-center">
                  <MonsterCharacter selections={selections} hovered={hovered} />
                </div>

                {/* Monster part selection */}
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
                        <Carousel className="w-full max-w-xs mx-auto">
                          <CarouselContent>
                            {monsterParts[part as MonsterPartType].map(
                              (option) => (
                                <CarouselItem
                                  key={option.value}
                                  className="basis-1/4"
                                >
                                  <MonsterPartOption
                                    option={option}
                                    selected={
                                      selections[part]?.value === option.value
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
              </div>

              {/* Action Buttons and Status */}
              <Card className="mt-6">
                <CardContent className="p-4 space-y-3">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-2">
                      Current Monster (
                      {Object.keys(question.getUserSelections()).length}/5
                      parts)
                    </h3>
                    {Object.keys(question.getUserSelections()).length > 0 && (
                      <div className="text-xs text-gray-600 mb-3">
                        {Object.entries(question.getUserSelections())
                          .map(([attr, value]) => `${attr}: ${value}`)
                          .join(", ")}
                      </div>
                    )}

                    {/* Show which goals current selection can reach */}
                    {Object.keys(question.getUserSelections()).length === 5 && (
                      <div className="mb-2">
                        {getCurrentReachableGoals().length > 0 ? (
                          <div className="text-xs text-green-600">
                            Can trigger rules:{" "}
                            {getCurrentReachableGoals()
                              .map((ruleId) => `Rule ${ruleId}`)
                              .join(", ")}
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">
                            Cannot trigger any goal rules
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Add Combination Button */}
                  <Button
                    onClick={handleAddCombination}
                    disabled={
                      Object.keys(question.getUserSelections()).length !== 5 ||
                      getCurrentReachableGoals().length === 0
                    }
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add This Combination
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full"
                    >
                      Reset Current
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="w-full"
                    >
                      Save Progress
                    </Button>
                  </div>

                  {/* Saved Combinations */}
                  {savedCombinations.length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">
                        Saved Combinations ({savedCombinations.length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {savedCombinations.map((combo) => (
                          <div
                            key={combo.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                          >
                            <div className="flex-1">
                              <div className="text-gray-600">
                                {Object.entries(combo.parts)
                                  .map(([attr, value]) => `${attr}: ${value}`)
                                  .join(", ")}
                              </div>
                              <div className="text-green-600 mt-1">
                                Triggers: Rule {combo.ruleId}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCombination(combo.id)}
                              className="ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overall Status */}
                  {savedCombinations.length > 0 && (
                    <div className="border-t pt-3">
                      <div className="text-sm text-center">
                        <div className="mb-2">
                          Rules covered:{" "}
                          {
                            Array.from(
                              new Set(savedCombinations.map((c) => c.ruleId))
                            ).length
                          }{" "}
                          / {question.getGoalRules().length}
                        </div>
                        {isCorrect !== null && (
                          <div
                            className={`text-sm ${
                              isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {isCorrect
                              ? "✓ All goal rules can be triggered!"
                              : "✗ Need combinations to trigger all goal rules"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={!isCorrect}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </SolverWrapper>
  );
}
