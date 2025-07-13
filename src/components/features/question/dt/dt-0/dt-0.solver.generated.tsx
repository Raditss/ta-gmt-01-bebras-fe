'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';
import { DecisionTreeSolveModel } from '@/models/dt-0/dt-0.solve.model';
import { MonsterPartOptionType, MonsterPartType } from '../monster-part.type';
import Monster from '@/components/features/question/dt/monster';
import { DecisionTree } from '@/components/features/question/dt/dt-0/tree';
import { Button } from '@/components/ui/button';
import MonsterPartWardrobe from '@/components/features/question/dt/monster-part-wardrobe';
import { GeneratedSubmitSection } from '@/components/features/question/shared/submit-section-generated';

export default function GeneratedDt0Solver({ type }: GeneratedSolverProps) {
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<DecisionTreeSolveModel>(type, DecisionTreeSolveModel);

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);

  // Update local state when question is loaded
  useEffect(() => {
    if (question) {
      setSelections(question.getSelection());
    }
  }, [question]);

  const handleSelection = useCallback(
    (monsterPart: MonsterPartType, value: MonsterPartOptionType) => {
      if (!question) return;

      setSelections((prev) => {
        const newSelections = { ...prev, [monsterPart]: value.value };
        question.setAnswerSelections(monsterPart, value.value);
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
    setSelections({});
    if (question) {
      question.resetToInitialState();
    }
  }, [question]);

  const isAllPartsSelected = useCallback(() => {
    const requiredParts = Object.values(MonsterPartType);
    return requiredParts.every((part) => selections[part]);
  }, [selections]);

  // Convert selections to answerArr format for submit section
  const answerArr = Object.entries(selections);

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[95%] mx-auto p-4">
            <div className="text-center mt-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Choose a Monster Not Banned
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Tree and Wardrobe */}
              <div className="flex flex-col gap-6">
                {/* Tree */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex justify-center overflow-x-auto min-h-[400px]">
                    <DecisionTree
                      rules={question.getRules()}
                      selections={Object.fromEntries(
                        Object.entries(selections).map(([key, value]) => [
                          key,
                          value
                        ])
                      )}
                    />
                  </div>
                </div>

                {/* Answer and Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl">
                      <div className="flex flex-col gap-4">
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

                        {/* Action Buttons */}
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          className="w-full"
                        >
                          Reset
                        </Button>

                        <GeneratedSubmitSection
                          question={question}
                          answerArr={answerArr}
                          type={type}
                          questionContent={questionContent}
                          onRegenerate={regenerate}
                          isDisabled={!isAllPartsSelected()}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Monster Preview and Wardrobe */}
              <div className="flex flex-col gap-6">
                {/* Monster Preview */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <Monster selections={selections} hovered={hovered} />
                </div>

                {/* Wardrobe */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <MonsterPartWardrobe
                    selections={selections}
                    onSelection={handleSelection}
                    onHover={handleHover}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </GeneratedSolverWrapper>
  );
}
