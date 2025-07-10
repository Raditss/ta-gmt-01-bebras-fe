'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questionService } from '@/lib/services/question.service';
import { Clock } from 'lucide-react';
import { DecisionTree } from '@/components/features/question/dt/dt-0/tree';
import MonsterCharacter from '@/components/features/question/dt/monster-character';
import { BaseSolverProps, SolverWrapper } from '../../../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
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
  const router = useRouter();
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

  const handleSubmit = useCallback(async () => {
    if (!question) return;

    question.setAttemptData(getCurrentDuration(), false);
    const { ...attemptData } = question.getAttemptData();
    await questionService.submitAttempt({
      ...attemptData,
      answer: JSON.parse(attemptData.answer)
    });

    router.push(`/problems/${questionId}`);
  }, [question, getCurrentDuration]);

  const handleSave = useCallback(async () => {
    if (!question || !user?.id) return;

    question.setAttemptData(getCurrentDuration(), true);
    const { ...attemptData } = question.getAttemptData();
    await questionService.saveDraft({
      ...attemptData,
      answer: JSON.parse(attemptData.answer)
    });
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
              {/*TODO: */}
              {/*{question.getTitle()}*/}
            </h1>

            <div className="mb-6 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto text-center">
              <p className="text-gray-700">
                Help the monster choose the correct outfit! Select different
                clothing items to dress up the monster, then follow the decision
                tree to find the matching rule.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-7xl mx-auto w-full">
              <div className="flex flex-col items-center ">
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

              <div className="xl:col-span-2">
                <div className="p-6rounded-lg shadow-lg">
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
                        value.label
                      ])
                    )}
                  />
                </div>

                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    onClick={handleReset}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Reset All
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Save Progress
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className={`px-6 py-2 rounded-lg transition-colors bg-blue-500 
                      text-white hover:bg-blue-600'`}
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SolverWrapper>
  );
}
