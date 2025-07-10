'use client';

import { useCallback, useEffect, useState } from 'react';
import { DecisionTree } from '@/components/features/question/dt/dt-0/tree';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import { BaseSolverProps, SolverWrapper } from '../../../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { TimeProgressBar } from '@/components/ui/time-progress-bar';
import { spritesheetParser } from '@/utils/helpers/spritesheet.helper';
import {
  monsterAssetUrl,
  MonsterPartOptionType,
  MonsterPartType
} from '../../types';
import { extractSpriteOptions } from './helper';
import { Button } from '@/components/ui/button';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { DecisionTreeSolveModel } from '@/models/dt-0/dt-0.solve.model';
import { useAuthStore } from '@/store/auth.store';
import MonsterPartWardrobe from '@/components/features/question/dt/monster-part-wardrobe';

export default function DecisionTreeSolver({ questionId }: BaseSolverProps) {
  const { user } = useAuthStore();
  const { question, loading, error, currentDuration } =
    useSolveQuestion<DecisionTreeSolveModel>(
      questionId,
      DecisionTreeSolveModel
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
          // [MonsterPartType.EYE_NUMBER]: options.eye_numbers,
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

  const handleSelection = useCallback(
    (monsterPart: MonsterPartType, value: MonsterPartOptionType) => {
      if (!question) return;

      setSelections((prev) => {
        const newSelections = { ...prev, [monsterPart]: value };
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

  const handleSave = useCallback(async () => {
    if (!question || !user?.id) return;

    question.setAttemptData(getCurrentDuration(), true);
    const { ...attemptData } = question.getAttemptData();
    // TODO: Implement save draft functionality
    console.log('Saving draft:', attemptData);
  }, [question, user?.id, getCurrentDuration]);

  const handleReset = useCallback(() => {
    setSelections({});
    setHovered(null);
    if (question) {
      question.resetToInitialState();
    }
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
                Help the monster choose the correct outfit! Select different
                clothing items to dress up the monster, then follow the decision
                tree to find the matching rule.
              </p>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Monster Character */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 text-center">Monster Character</h2>
                <div className="flex justify-center mb-6">
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

              {/* Decision Tree */}
              <div className="xl:col-span-2 space-y-8">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6 text-center">
                    Decision Tree
                  </h2>
                  <p className="text-base text-gray-600 text-center mb-6">
                    Follow the tree based on your selections. Yellow highlights
                    show your current path.
                  </p>

                  <DecisionTree
                    rules={question.getRules()}
                    selections={Object.fromEntries(
                      Object.entries(selections).map(([key, value]) => [
                        key,
                        value.label
                      ])
                    )}
                  />
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-8">Actions</h2>
                  
                  <div className="space-y-6">
                    {/* Current Selection Status */}
                    <div className="text-center">
                      <h3 className="text-base font-medium mb-3">
                        Current Selections ({Object.keys(selections).length} parts)
                      </h3>
                      {Object.keys(selections).length > 0 && (
                        <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                          {Object.entries(selections)
                            .map(([attr, value]) => `${attr}: ${value.label}`)
                            .join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button
                        onClick={handleReset}
                        className="flex-1 py-3 text-base bg-yellow-400 hover:bg-yellow-500 text-black"
                      >
                        Reset All
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="flex-1 py-3 text-base bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Save Progress
                      </Button>
                    </div>

                    {/* Submit Section */}
                    <SubmitSection
                      question={question}
                      getCurrentDuration={getCurrentDuration}
                      content={null}
                      answerArr={Object.keys(selections).length > 0 ? [selections] : []}
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
