'use client';

import { useCallback, useState } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';
import {
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/dt/monster-part.type';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DecisionTree2 } from '@/components/features/question/dt/dt-1/tree';
import { DecisionTree2SolveModel } from '@/models/dt-1/dt-1.solve.model';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import MonsterPartWardrobe from '@/components/features/question/dt/monster-part-wardrobe';
import { capitalizeFirst } from '@/utils/helpers/common.helper';
import { GeneratedSubmitSection } from '@/components/features/question/shared/submit-section-generated';

export default function GeneratedDt1Solver({ type }: GeneratedSolverProps) {
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<DecisionTree2SolveModel>(
      type,
      DecisionTree2SolveModel
    );

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);

  const handleAddCombination = useCallback(() => {
    if (!question) return;

    // Check if all monster parts are selected
    if (Object.keys(selections).length !== Object.keys(MonsterPartType).length)
      return;

    // Check if the selections satisfy all of the monster parts
    const isSatisfied = Object.values(MonsterPartType).every(
      (part) => !!selections[part]
    );

    if (!isSatisfied) return;

    question.addCombination({
      parts: Object.fromEntries(
        Object.entries(selections).map(([part, value]) => [part, value])
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
        const newSelections = { ...prev, [category]: value.value };
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

  const handleReset = useCallback(() => {
    if (question) {
      question.resetToInitialState();
    }
    setSelections({});
    setHovered(null);
  }, [question]);

  // Convert combinations to answerArr format for submit section
  const answerArr = question?.getCombinations() || [];

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && (
        <div className="min-h-screen bg-gray-100 p-8">
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
              {/* Left side - Decision Tree and Saved Combinations */}
              <div className="xl:col-span-2 flex flex-col gap-8">
                {/* Decision Tree Visualization */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Decision Tree
                  </h2>
                  <DecisionTree2
                    rules={question.getRules()}
                    finishes={question.getFinishes()}
                    goals={question.getGoals()}
                    selections={selections}
                  />
                </div>

                {/* Saved Combinations Section */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Combinations</h2>

                  <div className="space-y-6">
                    {/* Current Monster Status */}
                    <div className="text-center">
                      <h3 className="text-base font-medium mb-3">
                        Current Monster ({Object.keys(selections).length}/
                        {Object.keys(MonsterPartType).length} parts)
                      </h3>
                      <div className="text-sm text-gray-500">
                        Selected Parts:
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {Object.values(MonsterPartType).map((part) => (
                            <div
                              key={part}
                              className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg"
                            >
                              <span className="font-medium capitalize min-w-[80px]">
                                {part.replace(/_/g, ' ')}:
                              </span>
                              <span
                                className={`min-w-[100px] ${selections[part] ? 'text-green-600' : 'text-amber-600 italic'}`}
                              >
                                {selections[part] || 'Not selected'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                                    .map(
                                      ([attr, value]) =>
                                        `${capitalizeFirst(attr)}: ${value}`
                                    )
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
                  </div>
                </div>
              </div>

              {/* Right side - Monster Character and Wardrobe */}
              <div className="justify-center items-center">
                <div className="bg-white rounded-lg p-8 shadow-sm space-y-8">
                  {/* Monster Character - Centered */}
                  <div className="flex justify-center">
                    <MonsterCharacter
                      selections={selections}
                      hovered={hovered}
                    />
                  </div>

                  {/* Monster Wardrobe */}
                  <MonsterPartWardrobe
                    selections={selections}
                    onSelection={handleSelection}
                    onHover={handleHover}
                    onMouseLeave={handleMouseLeave}
                  />

                  {/* Action Buttons */}
                  <div className="space-y-4">
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

                    {/* Reset Button */}
                    <Button
                      onClick={handleReset}
                      className="w-full py-3 text-base bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      Reset Current
                    </Button>

                    {/* Submit Section */}
                    <GeneratedSubmitSection
                      question={question}
                      answerArr={answerArr}
                      type={type}
                      questionContent={questionContent}
                      onRegenerate={regenerate}
                      isDisabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </GeneratedSolverWrapper>
  );
}
