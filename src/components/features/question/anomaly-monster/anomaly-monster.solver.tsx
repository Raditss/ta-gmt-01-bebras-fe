'use client';

import { useCallback, useEffect, useState } from 'react';
import { BaseSolverProps, SolverWrapper } from '../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { AnomalyMonsterSolveModel } from '@/models/anomaly-monster/anomaly-monster.solve.model';
import { TimeProgressBar } from '@/components/features/question/shared/time-progress-bar';
import Monster from '@/components/features/question/anomaly-monster/monster';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import { Button } from '@/components/ui/button';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { Check, X } from 'lucide-react';

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
  } = useSolveQuestion<AnomalyMonsterSolveModel>(
    questionId,
    AnomalyMonsterSolveModel
  );
  const [anomalies, setAnomalies] = useState<number[]>([]);
  const [normals, setNormals] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

  // Update local state when question is loaded
  useEffect(() => {
    if (question) {
      setAnomalies(question.anomaly);
      setNormals(question.normal);
      setCurrentIdx(question.currentIdx);
    }
  }, [question]);

  useEffect(() => {
    if (!question) return;
    question.setAnomaly(anomalies);
    question.setNormal(normals);
    question.setCurrentIdx(currentIdx);
  }, [anomalies, normals, currentIdx, question]);

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
    setAnomalies([]);
    setNormals([]);
    setCurrentIdx(0);
    if (question) {
      question.resetToInitialState();
    }
  }, [question]);

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
                  Bantu scientist untuk mengkarantina monster yang terdampak
                  virus! Pohon keputusan ini membantumu untuk menentukan apakah
                  monster tersebut terdampak virus atau tidak
                  <div className="flex justify-center overflow-x-auto min-h-[400px]">
                    <DecisionTreeAnomalyTree
                      rules={question.getMonsterTree()}
                      selections={{}}
                    />
                    {/*  TODO: perlu apa ntah selections ini*/}
                  </div>
                </div>

                {/* Answer and Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl">
                      <div className="flex flex-col gap-4">
                        Kamu telah memeriksa {normals.length + anomalies.length}{' '}
                        dari {question.content.choices.length} monster
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
                          answerArr={Object.entries(anomalies)}
                          isDisabled={
                            normals.length + anomalies.length !==
                            question.content.tree?.length
                          }
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
                  <p className="text-center">
                    Monster {currentIdx + 1} dari{' '}
                    {question.content.choices.length}
                  </p>
                  <p className="text-center">
                    {Object.values(
                      question.content.choices[currentIdx].conditions.map(
                        (value) => {
                          return `${value.attribute}: ${value.value} `;
                        }
                      )
                    )}
                  </p>
                  {question.content.choices && (
                    <Monster
                      selections={question.content.choices[
                        currentIdx
                      ].conditions.reduce(
                        (acc, condition) => {
                          acc[condition.attribute] = condition.value;
                          return acc;
                        },
                        {} as Record<string, string>
                      )}
                    />
                  )}
                </div>
                <div className="flex justify-center items-center">
                  Apakah monster ini terkena virus?
                </div>
                <div className="flex justify-center items-center gap-2">
                  <Button
                    onClick={() => setCurrentIdx((prevState) => prevState - 1)}
                    disabled={currentIdx === 0}
                  >
                    {'<'}
                  </Button>
                  {/* TODO: tambahin styling kalo sudah terpilih, kalau belum biarin */}
                  <Button
                    onClick={() => {
                      if (
                        anomalies.includes(
                          question?.content.choices[currentIdx].id
                        )
                      ) {
                        setAnomalies((prevState) =>
                          prevState.filter(
                            (idx) =>
                              idx !== question?.content.choices[currentIdx].id
                          )
                        );
                      }
                      if (
                        !normals.includes(
                          question?.content.choices[currentIdx].id
                        )
                      ) {
                        setNormals((prevState) => [
                          ...prevState,
                          question?.content.choices[currentIdx].id
                        ]);
                      }
                    }}
                  >
                    <Check />
                  </Button>
                  <Button
                    onClick={() => {
                      if (
                        normals.includes(
                          question?.content.choices[currentIdx].id
                        )
                      ) {
                        setNormals((prevState) =>
                          prevState.filter(
                            (idx) =>
                              idx !== question?.content.choices[currentIdx].id
                          )
                        );
                      }
                      if (
                        !anomalies.includes(
                          question?.content.choices[currentIdx].id
                        )
                      ) {
                        setAnomalies((prevState) => [
                          ...prevState,
                          question?.content.choices[currentIdx].id
                        ]);
                      }
                    }}
                  >
                    <X />
                  </Button>
                  <Button
                    onClick={() => setCurrentIdx((prevState) => prevState + 1)}
                    disabled={
                      currentIdx === question.content.choices.length - 1
                    }
                  >
                    {'>'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SolverWrapper>
  );
}
