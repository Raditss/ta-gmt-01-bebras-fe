'use client';

import { useCallback, useEffect, useState } from 'react';
import { BaseSolverProps, SolverWrapper } from '../../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { MonsterPartOptionType, MonsterPartType } from '../monster-part.type';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { DecisionTreeAnomalySolveModel } from '@/models/decision-tree-anomaly/decision-tree-anomaly.solve.model';
import { TimeProgressBar } from '@/components/features/question/shared/time-progress-bar';
import Monster from '@/components/features/question/decision-tree/monster';
import { DecisionTreeAnomalyTree } from '@/components/features/question/decision-tree/decision-tree-anomaly/tree';
import { Button } from '@/components/ui/button';
import MonsterPartWardrobe from '@/components/features/question/decision-tree/monster-part-wardrobe';
import { SubmitSection } from '@/components/features/question/shared/submit-section';

export default function DecisionTreeAnomalySolver({
  questionId
}: BaseSolverProps) {
  const {
    question,
    questionMetadata,
    loading,
    error,
    currentDuration,
    markAsSubmitted
  } = useSolveQuestion<DecisionTreeAnomalySolveModel>(
    questionId,
    DecisionTreeAnomalySolveModel
  );
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<{
    category: MonsterPartType;
    value: string;
  } | null>(null);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

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

  /*
    const handleSubmit = useCallback(async () => {
      if (!question) return;

      question.setAttemptData(getCurrentDuration(), false);
      const { ...attemptData } = question.getAttemptData();
      await questionService.submitAttempt({
        ...attemptData,
        answer: JSON.parse(attemptData.answer)
      });

      router.push(`/problems/${questionId}`);
    }, [question, getCurrentDuration, questionId, router]);
  */

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

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-[95%] mx-auto p-4">
            {questionMetadata && (
              <TimeProgressBar
                currentDuration={currentDuration()}
                estimatedTime={questionMetadata.estimatedTime}
                formattedDuration={formattedDuration}
              />
            )}

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
                    <DecisionTreeAnomalyTree
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
                        <SubmitSection
                          question={question}
                          getCurrentDuration={getCurrentDuration}
                          answerArr={Object.entries(selections)}
                          isDisabled={!isAllPartsSelected()}
                          onSubmissionSuccess={markAsSubmitted}
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
    </SolverWrapper>
  );
}
