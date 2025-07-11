'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import { BaseSolverProps, SolverWrapper } from '../../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { TimeProgressBar } from '@/components/ui/time-progress-bar';
import { spritesheetParser } from '@/utils/helpers/spritesheet.helper';
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/dt/types';
import { extractSpriteOptions } from '@/components/features/question/dt/dt-0/helper';

import { Button } from '@/components/ui/button';
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

  const handleSave = useCallback(async () => {
    if (!question) return;

    question.setAttemptData(getCurrentDuration(), true);
    const { isDraft: _isDraft, ...attemptData } = question.getAttemptData();
    // TODO: Implement save draft functionality
    console.log('Saving draft:', attemptData);
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
      {question && (
        <div className="min-h-screen bg-gray-100 p-8">
          {/* Time Progress Bar */}
          <div className="max-w-7xl mx-auto mb-8">
            <TimeProgressBar
              duration={currentDuration()}
              formattedTime={formattedDuration}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            {/* Question Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-800">
                Decision Tree Challenge
              </h1>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Help the monster reach the goal destinations! Select different
                clothing items to dress up the monster. Find a combination that
                leads to one of the goal finishes shown in the decision tree.
              </p>

              {/* Goal indicators */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <span className="text-base font-medium text-gray-600">
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
                      className="bg-green-100 text-green-800 text-sm px-3 py-1"
                    >
                      <Target className="w-3 h-3 mr-1" />
                      {finish?.name || `Goal ${goalId}`}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Decision Tree Visualization */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Decision Tree
                  </h2>
                  <DecisionTree2
                    rules={question.getRules()}
                    finishes={question.getFinishes()}
                    goals={question.getGoals()}
                  />
                </div>
              </div>

              {/* Right Side - Monster and Controls */}
              <div className="space-y-8">
                {/* Monster Character */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Monster Character
                  </h2>
                  <div className="flex justify-center mb-6">
                    <MonsterCharacter
                      selections={selections}
                      hovered={hovered}
                    />
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

                {/* Controls */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Combinations</h2>

                  <div className="space-y-6">
                    {/* Current Monster Status */}
                    <div className="text-center">
                      <h3 className="text-base font-medium mb-3">
                        Current Monster ({Object.keys(selections).length}/
                        {Object.keys(MonsterPartType).length} parts)
                      </h3>
                      {Object.keys(selections).length > 0 && (
                        <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
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
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-regular py-3 text-lg"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add This Combination
                    </Button>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={handleReset}
                        className="flex-1 py-3 text-base bg-yellow-400 hover:bg-yellow-500 text-black"
                      >
                        Reset Current
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1 py-3 text-base bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Save Progress
                      </Button>
                    </div>

                    {/* Saved Combinations */}
                    {question.getCombinations().length > 0 && (
                      <div className="mt-8">
                        <label className="block text-base font-medium mb-3">
                          Saved Combinations (
                          {question.getCombinations().length}):
                        </label>
                        <div className="p-6 bg-gray-50 rounded-lg border min-h-[100px] space-y-3 max-h-60 overflow-y-auto">
                          {question.getCombinations().map((combo) => (
                            <div
                              key={combo.id}
                              className="flex items-center justify-between p-3 bg-white rounded border text-sm"
                            >
                              <div className="flex-1">
                                <div className="text-gray-700">
                                  {Object.entries(combo.parts)
                                    .map(([attr, value]) => `${attr}: ${value}`)
                                    .join(', ')}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleRemoveCombination(combo.id)
                                }
                                className="ml-3 bg-red-500 hover:bg-red-600 text-white"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Section */}
                    <SubmitSection
                      question={question}
                      getCurrentDuration={getCurrentDuration}
                      content={null}
                      answerArr={question.getCombinations()}
                      isDisabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SolverWrapper>
  );
}
