"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useDecisionTreeAttempt } from "@/hooks/useDecisionTreeAttempt";
import { questionService } from "@/services/questionService";
import { Clock } from "lucide-react";
import { DecisionTree } from "@/components/decision-tree/shared/tree";
import MonsterCharacter from "@/components/decision-tree/shared/monster-character";
import { BaseSolverProps, SolverWrapper } from "../base-solver";
import { useDuration } from "@/hooks/useDuration";
import { spritesheetParser } from "@/lib/spritesheet-parser";
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType,
} from "./types";
import { extractSpriteOptions } from "./helper";
import MonsterPartOption from "@/components/decision-tree/shared/monster-part-option";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function DecisionTreeSolver({ questionId }: BaseSolverProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { question, loading, error, currentDuration } =
    useDecisionTreeAttempt(questionId);
  const [selections, setSelections] = useState<
    Record<string, MonsterPartOptionType>
  >({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
          // [MonsterPartType.EYE_NUMBER]: options.eye_numbers,
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

  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      if (!question) return;

      setSelections((prev) => {
        const newSelections = { ...prev, [category]: value };
        // TODO
        question.setSelection(category, value.value || "");
        return newSelections;
      });
      setSelectedRule(null);
      setIsCorrect(null);
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

  const handleRuleSelection = useCallback(
    (ruleId: number) => {
      if (!question) return;

      question.selectRule(ruleId);
      setSelectedRule(ruleId);
      const correct = question.checkAnswer();
      setIsCorrect(correct);
    },
    [question]
  );

  const handleSubmit = useCallback(async () => {
    if (!question || !user?.id || selectedRule === null || !isCorrect) return;

    question.setAttemptData(String(user.id), getCurrentDuration(), "completed");
    await questionService.submitAttempt(question.getAttemptData());

    router.push(`/problems/${questionId}`);
  }, [
    question,
    user?.id,
    selectedRule,
    isCorrect,
    getCurrentDuration,
    router,
    questionId,
  ]);

  const handleSave = useCallback(async () => {
    if (!question || !user?.id) return;

    question.setAttemptData(String(user.id), getCurrentDuration(), "paused");
    await questionService.saveDraft(question.getAttemptData());
  }, [question, user?.id, getCurrentDuration]);

  const handleReset = useCallback(() => {
    setSelections({});
    setHovered(null);
    setSelectedRule(null);
    setIsCorrect(null);
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
              {question.getTitle()}
            </h1>

            <div className="mb-6 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
              <p className="text-gray-700">
                Help the monster choose the correct outfit! Select different
                clothing items to dress up the monster, then follow the decision
                tree to find the matching rule.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
              <div className="flex flex-col items-center">
                <div className="mb-8 p-6 w-fit h-fit rounded-lg shadow-lg flex items-center justify-center">
                  <MonsterCharacter selections={selections} hovered={hovered} />
                </div>
                {monsterParts && (
                  <Tabs
                    defaultValue={Object.keys(monsterParts)[0]}
                    className="mt-4"
                  >
                    <TabsList className="flex flex-wrap justify-center">
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
                      <TabsContent key={part} value={part}>
                        {monsterParts[part as MonsterPartType] &&
                          (monsterParts[part as MonsterPartType].length < 4 ? (
                            <div className="grid grid-cols-2 gap-2">
                              {monsterParts[part as MonsterPartType].map(
                                (option, index) => (
                                  <MonsterPartOption
                                    key={index}
                                    option={option}
                                    selected={
                                      selections[part]?.label === option.label
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
                            <Carousel className="w-full" opts={{}}>
                              <CarouselContent className="w-full">
                                {Array.from({
                                  length: Math.ceil(
                                    monsterParts[part as MonsterPartType]
                                      .length / 4
                                  ),
                                }).map((_, pageIndex) => (
                                  <CarouselItem key={pageIndex}>
                                    <div className="grid grid-cols-2 gap-2">
                                      {monsterParts[part as MonsterPartType]
                                        .slice(
                                          pageIndex * 4,
                                          (pageIndex + 1) * 4
                                        )
                                        .map((option, index) => (
                                          <MonsterPartOption
                                            key={index}
                                            option={option}
                                            selected={
                                              selections[part]?.label ===
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

              <div className="xl:col-span-2">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Decision Tree
                  </h2>
                  <p className="text-gray-600 text-center mb-6">
                    Follow the tree based on your selections. Yellow highlights
                    show your current path.
                  </p>

                  <DecisionTree
                    rules={question.getRules()}
                    selections={Object.fromEntries(
                      Object.entries(selections).map(([key, value]) => [
                        key,
                        value.label,
                      ])
                    )}
                    onRuleSelect={handleRuleSelection}
                    selectedRule={selectedRule}
                  />

                  {selectedRule !== null && (
                    <div className="mt-6 text-center">
                      {isCorrect ? (
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg">
                          🎉 Correct! You&apos;ve found the right path through
                          the decision tree.
                        </div>
                      ) : (
                        <div className="p-3 bg-red-100 text-red-800 rounded-lg">
                          ❌ Not quite right. Follow the highlighted path in the
                          tree!
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Save Progress
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedRule === null || !isCorrect}
                    className={`px-6 py-2 rounded-lg transition-colors ${
                      selectedRule !== null && isCorrect
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SolverWrapper>
  );
}
