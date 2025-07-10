'use client';

import { useCallback, useEffect, useState } from 'react';
import { questionService } from '@/lib/services/question.service';
import { Clock, Plus, Target, Trash2 } from 'lucide-react';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import { BaseSolverProps, SolverWrapper } from '../../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { spritesheetParser } from '@/utils/helpers/spritesheet.helper';
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/dt/types';
import { extractSpriteOptions } from '@/components/features/question/dt/dt-0/solver/helper';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecisionTree2 } from '@/components/features/question/dt/dt-1/tree';
import { DecisionTree2SolveModel } from '@/models/dt-1/dt-1.solve.model';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import MonsterPartWardrobe from '../monster-part-wardrobe';

export default function DecisionTree2Solver({ questionId }: BaseSolverProps) {
  const { question, loading, error, currentDuration } =
    useSolveQuestion<DecisionTree2SolveModel>(
      questionId,
      DecisionTree2SolveModel
    );

  const [selections, setSelections] = useState<
    Record<string, MonsterPartOptionType>
  >({});

  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);

  const [monsterParts, setMonsterParts] = useState<Record<
    MonsterPartType,
    MonsterPartOptionType[]
  > | null>(null);

  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

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
          [MonsterPartType.LEG]: options.legs
        };

        setMonsterParts(parts);
      } catch (error) {
        console.error('Failed to load monster parts:', error);
      }
    };

    initializeMonsterParts();
  }, []);

  const handleAddCombination = useCallback(() => {
    if (!question) return;

    // TODO: show error message
    if (Object.keys(selections).length !== Object.keys(MonsterPartType).length)
      return;

    // check if the selections is already satisfied all of the monster parts
    const isSatisfied = Object.values(MonsterPartType).every(
      (part) => !!selections[part]
    );

    if (!isSatisfied) return;

    question.addCombination({
      parts: Object.fromEntries(
        Object.entries(selections).map(([part, value]) => [part, value.value])
      ),
      id:
        question.getCombinations().length > 0
          ? question.getCombinations()[question.getCombinations().length - 1]
              .id + 1
          : 1
    });

    setSelections({});
    setHovered(null);
  }, [question, selections]);

  // Remove a saved combination
  const handleRemoveCombination = useCallback(
    (combinationId: number) => {
      if (!question) return;
      question.removeCombination(combinationId);
    },
    [question]
  );

  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      if (!question) return;

      setSelections((prev) => {
        const newSelections = { ...prev, [category]: value };
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

  const handleSubmit = useCallback(async () => {
    if (!question) return;

    question.setAttemptData(getCurrentDuration(), false);
    const { isDraft: _isDraft, ...attemptData } = question.getAttemptData();
    console.log('Saving draft attempt data:', JSON.parse(attemptData.answer));

    await questionService.submitAttempt({
      ...attemptData,
      answer: JSON.parse(attemptData.answer)
    });
  }, [question, getCurrentDuration]);

  const handleSave = useCallback(async () => {
    if (!question) return;

    question.setAttemptData(getCurrentDuration(), true);
    const { isDraft: _isDraft, ...attemptData } = question.getAttemptData();
    await questionService.saveDraft({
      ...attemptData,
      answer: JSON.parse(attemptData.answer)
    });
  }, [question, getCurrentDuration]);

  const handleReset = useCallback(() => {
    if (question) {
      question.resetToInitialState();
    }
    setSelections({});
    setHovered(null);
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
                />
              </div>

              {/* Monster Character */}
              <div className="flex flex-col items-center">
                <div className="mb-8 p-6 w-fit h-fit rounded-lg shadow-lg flex items-center justify-center">
                  <MonsterCharacter selections={selections} hovered={hovered} />
                </div>

                {monsterParts && (
                  <MonsterPartWardrobe
                    monsterParts={monsterParts}
                    selections={selections}
                    onSelection={handleSelection}
                    onHover={handleHover}
                    onMouseLeave={handleMouseLeave}
                  />
                )}
              </div>

              {/* Action Buttons and Status */}
              <Card className="">
                <CardContent className="p-4 space-y-3">
                  <div className="text-center">
                    <h3 className="text-sm font-medium mb-2">
                      Current Monster ({Object.keys(selections).length}/
                      {Object.keys(MonsterPartType).length} parts)
                    </h3>
                    {Object.keys(selections).length > 0 && (
                      <div className="text-xs text-gray-600 mb-3">
                        {Object.entries(selections)
                          .map(([attr, value]) => `${attr}: ${value.label}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Add Combination Button */}
                  <Button
                    onClick={handleAddCombination}
                    disabled={
                      Object.keys(selections).length !==
                      Object.keys(MonsterPartType).length
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
                  {question.getCombinations().length > 0 && (
                    <div className="border-t pt-3">
                      <h4 className="text-sm font-medium mb-2">
                        Saved Combinations ({question.getCombinations().length})
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {question.getCombinations().map((combo) => (
                          <div
                            key={combo.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                          >
                            <div className="flex-1">
                              <div className="text-gray-600">
                                {Object.entries(combo.parts)
                                  .map(([attr, value]) => `${attr}: ${value}`)
                                  .join(', ')}
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

                  <Button
                    onClick={handleSubmit}
                    disabled={question.getCombinations().length === 0}
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
