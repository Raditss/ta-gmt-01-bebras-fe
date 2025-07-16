'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';
import { AnomalyMonsterSolveModel } from '@/models/anomaly-monster/anomaly-monster.solve.model';
import Monster from '@/components/features/question/anomaly-monster/monster';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import { Button } from '@/components/ui/button';
import { GeneratedSubmitSection } from '@/components/features/question/shared/submit-section-generated';

export default function GeneratedAnomalyMonsterSolver({
  type
}: GeneratedSolverProps) {
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<AnomalyMonsterSolveModel>(
      type,
      AnomalyMonsterSolveModel
    );

  const [anomalies, setAnomalies] = useState<number[]>([]);
  const [normals, setNormals] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);

  // Sync local state with model when question loads
  useEffect(() => {
    if (question) {
      setAnomalies(question.anomaly);
      setNormals(question.normal);
      setCurrentIdx(question.currentIdx);
    }
  }, [question]);

  const handleReset = useCallback(() => {
    setAnomalies([]);
    setNormals([]);
    setCurrentIdx(0);
    if (question) {
      question.resetToInitialState();
    }
  }, [question]);

  const handleMarkAsNormal = useCallback(() => {
    if (normals.includes(currentIdx)) return;
    setNormals((prev) => [...prev, currentIdx]);
    setAnomalies((prev) => prev.filter((idx) => idx !== currentIdx));
  }, [currentIdx, normals]);

  const handleMarkAsAnomaly = useCallback(() => {
    if (anomalies.includes(currentIdx)) return;
    setAnomalies((prev) => [...prev, currentIdx]);
    setNormals((prev) => prev.filter((idx) => idx !== currentIdx));
  }, [currentIdx, anomalies]);

  const handlePrevious = useCallback(() => {
    setCurrentIdx((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    if (!question) return;
    setCurrentIdx((prev) =>
      Math.min(question.content.choices.length - 1, prev + 1)
    );
  }, [question]);

  if (!question) {
    return (
      <GeneratedSolverWrapper loading={loading} error={error} type={type}>
        <></>
      </GeneratedSolverWrapper>
    );
  }

  const totalMonsters = question.content.choices.length;
  const classifiedCount = normals.length + anomalies.length;
  const currentMonster = question.content.choices[currentIdx];

  // For submit section, answerArr is [ ["anomaly", ...], ["normal", ...] ]
  const answerArr = [
    ['anomaly', JSON.stringify(anomalies)],
    ['normal', JSON.stringify(normals)],
    ['currentIdx', currentIdx.toString()]
  ];

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[95%] mx-auto p-4">
          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Choose a Monster Not Banned
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Tree and Progress */}
            <div className="flex flex-col gap-6">
              {/* Tree */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <DecisionTreeAnomalyTree
                  rules={question.getMonsterTree()}
                  selections={{}}
                />
              </div>

              {/* Progress and Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Progress</h3>
                    <p className="text-gray-600">
                      Kamu telah memeriksa {classifiedCount} dari{' '}
                      {totalMonsters} monster
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${(classifiedCount / totalMonsters) * 100}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="text-center">
                        <div className="text-green-600 font-bold text-xl">
                          {normals.length}
                        </div>
                        <div className="text-sm text-gray-500">Normal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-bold text-xl">
                          {anomalies.length}
                        </div>
                        <div className="text-sm text-gray-500">Anomaly</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full"
                    >
                      Reset All Classifications
                    </Button>
                    <GeneratedSubmitSection
                      question={question}
                      answerArr={answerArr}
                      type={type}
                      questionContent={questionContent}
                      onRegenerate={regenerate}
                      isDisabled={classifiedCount !== totalMonsters}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Monster Preview and Classification */}
            <div className="flex flex-col gap-6">
              {/* Monster Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Monster {currentIdx + 1} dari {totalMonsters}
                  </h3>
                  <div className="mt-2">
                    {normals.includes(currentIdx) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Classified as Normal
                      </span>
                    )}
                    {anomalies.includes(currentIdx) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        ⚠ Classified as Anomaly
                      </span>
                    )}
                    {!normals.includes(currentIdx) &&
                      !anomalies.includes(currentIdx) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                          ? Not yet classified
                        </span>
                      )}
                  </div>
                </div>
                {currentMonster && (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        Monster characteristics:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {currentMonster.conditions.map((condition, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {condition.attribute}: {condition.value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-center mb-6">
                      <Monster
                        selections={currentMonster.conditions.reduce(
                          (acc, condition) => {
                            acc[condition.attribute] = condition.value;
                            return acc;
                          },
                          {} as Record<string, string>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Apakah monster ini terkena virus?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Gunakan pohon keputusan untuk membantu menentukan
                    klasifikasi
                  </p>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentIdx === 0}
                    variant="outline"
                    size="lg"
                  >
                    ← Previous
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleMarkAsNormal}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg font-semibold transition-all duration-200 ${normals.includes(currentIdx) ? 'bg-green-500 text-white shadow-lg hover:bg-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      size="lg"
                    >
                      Normal
                    </Button>
                    <Button
                      onClick={handleMarkAsAnomaly}
                      className={`flex items-center justify-center w-12 h-12 rounded-lg font-semibold transition-all duration-200 ${anomalies.includes(currentIdx) ? 'bg-red-500 text-white shadow-lg hover:bg-red-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      size="lg"
                    >
                      Anomaly
                    </Button>
                  </div>
                  <Button
                    onClick={handleNext}
                    disabled={currentIdx === totalMonsters - 1}
                    variant="outline"
                    size="lg"
                  >
                    Next →
                  </Button>
                </div>
                <div className="flex justify-center gap-8 mt-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-700">
                      Normal
                    </div>
                    <div className="text-xs text-gray-500">Not infected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-700">
                      Anomaly
                    </div>
                    <div className="text-xs text-gray-500">
                      Infected/Suspicious
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneratedSolverWrapper>
  );
}
