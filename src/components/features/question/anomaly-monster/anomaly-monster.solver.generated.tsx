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
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import MonsterClassificationForm from '@/components/features/question/anomaly-monster/monster-classification-form';
import { AnomalyMonsterForm } from '@/models/anomaly-monster/anomaly-monster.model.type';
import { useInView } from 'react-intersection-observer';

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
  const [forms, setForms] = useState<AnomalyMonsterForm[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const { ref: progressRef, inView: isProgressVisible } = useInView({
    threshold: 0.1
  });

  // Sync local state with model when question loads
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
  }, [anomalies, normals, currentIdx, question, forms]);

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
      <GeneratedSolverWrapper loading={loading} error={error} type={type}>
        <></>
      </GeneratedSolverWrapper>
    );
  }

  const totalMonsters = question.content.choices.length;
  const classifiedCount = normals.length + anomalies.length;
  const currentMonster = question.content.choices[currentIdx];
  const currentForm = forms.find((form) => form.id === currentMonster.id);

  // For submit section, answerArr is [ ["anomaly", ...], ["normal", ...] ]
  const answerArr = [
    ['anomaly', JSON.stringify(anomalies)],
    ['normal', JSON.stringify(normals)],
    ['currentIdx', currentIdx.toString()]
  ];

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-[95%] mx-auto p-1">
          <div className="text-center mt-2 mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Monster yang Aneh
            </h1>
            <h3 className="mt-1 text-base font-semibold text-gray-500">
              Kamu ditugaskan membantu para saintis apakah monster terkena virus
              atau tidak! Teliti setiap monster menggunakan pohon keputusan dan
              tentukan: normal atau terinfeksi?
            </h3>
          </div>

          <div
            className={`grid grid-cols-1 ${isFormOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}
          >
            {/* Left side - Tree and Progress */}
            {/* Tree */}
            <div className="bg-white flex-1 rounded-xl shadow-lg p-4 content-center">
              <DecisionTreeAnomalyTree
                rules={question.getMonsterTree()}
                selections={{
                  Color: currentForm?.Color || '',
                  Body: currentForm?.Body || '',
                  Mouth: currentForm?.Mouth || ''
                }}
              />
            </div>

            {/* Form */}
            {isFormOpen && (
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
            )}

            {/* Right side - Monster Preview and Classification */}
            <div className="flex flex-col flex-1 gap-3">
              {/* Monster Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Monster {currentIdx + 1} dari {totalMonsters}
                  </h3>
                </div>
                {currentMonster && (
                  <>
                    <div className="flex justify-center mb-3">
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
                    <div className="text-center">
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
                      <p className="text-gray-600 mt-4">
                        Kamu telah memeriksa {classifiedCount} dari{' '}
                        {totalMonsters} monster
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(classifiedCount / totalMonsters) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-white rounded-xl flex-1 shadow-lg p-3 content-center">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-semibold">
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
                    className="relative z-50 flex items-center justify-center w-40 h-14 rounded-xl font-semibold
    text-green-700 border-2 border-green-500 bg-white
    animate-pulseGlow hover:scale-105 transition-transform duration-200"
                    onClick={() => setIsFormOpen(!isFormOpen)}
                  >
                    <Search size={20} className="mr-2" />
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

            {classifiedCount === totalMonsters && !isProgressVisible && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-bounce">
                  <span className="text-sm">⬇ Sudah selesai? Submit</span>
                  <button
                    className="underline"
                    onClick={() =>
                      document
                        .getElementById('progress-section')
                        ?.scrollIntoView({
                          behavior: 'smooth'
                        })
                    }
                  >
                    Klik di sini
                  </button>
                </div>
              </div>
            )}

            {/* Progress and Actions */}
            <div
              className="lg:col-span-full bg-white rounded-xl shadow-lg p-6"
              id="progress-section"
              ref={progressRef}
            >
              <div className="flex flex-col gap-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Sudah Siap Submit?
                  </h3>
                  <div className="flex justify-center gap-6 mt-2">
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
                      <div className="text-sm text-gray-500">Terinfeksi</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    🔄 Klasifikasi Ulang Semua Monster
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
        </div>
      </div>
      <DynamicHelp questionType={QuestionTypeEnum.ANOMALY_MONSTER} />
    </GeneratedSolverWrapper>
  );
}
