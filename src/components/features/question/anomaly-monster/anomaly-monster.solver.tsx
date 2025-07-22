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
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import { AnomalyMonsterForm } from '@/models/anomaly-monster/anomaly-monster.model.type';
import MonsterClassificationForm from '@/components/features/question/anomaly-monster/monster-classification-form';

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
  const [forms, setForms] = useState<AnomalyMonsterForm[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

  // Update local state when question is loaded
  useEffect(() => {
    if (question) {
      setAnomalies(question.anomaly);
      setNormals(question.normal);
      setCurrentIdx(question.currentIdx);
      setForms(question.forms);
    }
  }, [question]);

  useEffect(() => {
    if (!question) return;

    question.setAnomaly(anomalies);
    question.setNormal(normals);
    question.setCurrentIdx(currentIdx);
    question.setForms(forms);
  }, [anomalies, normals, currentIdx, forms, question]);

  const handleReset = useCallback(() => {
    setAnomalies([]);
    setNormals([]);
    setCurrentIdx(0);
    setForms([]);
    setIsFormOpen(false);
    if (question) {
      question.resetToInitialState();
    }
  }, [question]);

  const handleMarkAsNormal = useCallback(() => {
    if (!question) return;
    if (normals.includes(question.content.choices[currentIdx].id)) return;
    setNormals((prev) => [...prev, question.content.choices[currentIdx].id]);
    setAnomalies((prev) =>
      prev.filter((idx) => idx !== question.content.choices[currentIdx].id)
    );
    setCurrentIdx((prev) =>
      Math.min(question.content.choices.length - 1, prev + 1)
    );
  }, [currentIdx, normals, question]);

  const handleMarkAsAnomaly = useCallback(() => {
    if (!question) return;
    if (anomalies.includes(question.content.choices[currentIdx].id)) return;
    setAnomalies((prev) => [...prev, question.content.choices[currentIdx].id]);
    setNormals((prev) =>
      prev.filter((idx) => idx !== question.content.choices[currentIdx].id)
    );
    setCurrentIdx((prev) =>
      Math.min(question.content.choices.length - 1, prev + 1)
    );
  }, [question, anomalies, currentIdx]);

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
      <SolverWrapper loading={loading} error={error}>
        <></>
      </SolverWrapper>
    );
  }

  const totalMonsters = question.content.choices.length;
  const classifiedCount = normals.length + anomalies.length;
  const currentMonster = question.content.choices[currentIdx];
  const currentForm = forms.find((form) => form.id === currentMonster.id);

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
                Monster yang Aneh
              </h1>
              <h3 className="mt-3 text-xl font-semibold text-gray-500">
                Kamu ditugaskan membantu para saintis! Teliti setiap monster dan
                tentukan: normal atau terinfeksi?
              </h3>
            </div>

            <div
              className={`grid grid-cols-1 ${isFormOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}
            >
              {/* Left side - Tree and Progress */}
              <div className="flex flex-col gap-6">
                {/* Tree */}
                <div className="bg-white rounded-xl shadow-lg p-4">
                  <DecisionTreeAnomalyTree
                    rules={question.getMonsterTree()}
                    selections={{
                      Color: currentForm?.Color || '',
                      Body: currentForm?.Body || '',
                      Mouth: currentForm?.Mouth || ''
                    }}
                  />
                </div>

                {/* Progress and Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col gap-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Progres</h3>
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
                          <div className="text-sm text-gray-500">
                            Terinfeksi
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="w-full"
                      >
                        🔄 Klasifikasi Ulang Semua Monster
                      </Button>
                      <SubmitSection
                        question={question}
                        getCurrentDuration={getCurrentDuration}
                        answerArr={anomalies.concat(normals)}
                        isDisabled={classifiedCount !== totalMonsters}
                        onSubmissionSuccess={markAsSubmitted}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              {isFormOpen && (
                <div className="h-fit bg-white rounded-xl shadow-lg p-0">
                  <MonsterClassificationForm
                    currentMonster={currentMonster}
                    currentForm={currentForm}
                    setForms={setForms}
                    onClose={() => setIsFormOpen(false)}
                    onClassifyAsNormal={handleMarkAsNormal}
                    onClassifyAsAnomaly={handleMarkAsAnomaly}
                    isAlreadyClassified={{
                      isNormal: normals.includes(
                        question.content.choices[currentIdx].id
                      ),
                      isAnomaly: anomalies.includes(
                        question.content.choices[currentIdx].id
                      )
                    }}
                  />
                </div>
              )}

              {/* Right side - Monster Preview and Classification */}
              <div className="flex flex-col gap-6">
                {/* Monster Preview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold">
                      Monster {currentIdx + 1} dari {totalMonsters}
                    </h3>
                    <div className="mt-2">
                      {normals.includes(
                        question.content.choices[currentIdx].id
                      ) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✓ Diklasifikasikan sebagai Normal
                        </span>
                      )}
                      {anomalies.includes(
                        question.content.choices[currentIdx].id
                      ) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          ⚠ Diklasifikasikan sebagai Terinfeksi
                        </span>
                      )}
                      {!normals.includes(
                        question.content.choices[currentIdx].id
                      ) &&
                        !anomalies.includes(
                          question.content.choices[currentIdx].id
                        ) && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            ? Belum diklasifikasikan
                          </span>
                        )}
                    </div>
                  </div>
                  {currentMonster && (
                    <>
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
                      <p className="text-center font-semibold">
                        {currentMonster.name}
                      </p>
                    </>
                  )}
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Apakah monster ini terinfeksi?
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
                      <ArrowLeft />
                    </Button>

                    <Button
                      className="flex items-center justify-center w-36 h-14 rounded-xl font-semibold transition-all duration-200 transform
                      border-2 border-gray-400 text-green-600 bg-white hover:bg-green-50 hover:scale-105"
                      onClick={() => setIsFormOpen(true)}
                    >
                      <Search size={20} />
                      Klasifikasikan
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={currentIdx === totalMonsters - 1}
                      variant="outline"
                      size="lg"
                    >
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DynamicHelp questionType={QuestionTypeEnum.ANOMALY_MONSTER} />
    </SolverWrapper>
  );
}
