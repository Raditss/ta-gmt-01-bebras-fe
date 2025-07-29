'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import { BaseSolverProps, SolverWrapper } from '../../bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { AnomalyMonsterSolveModel } from '@/models/anomaly-monster/anomaly-monster.solve.model';
import { TimeProgressBar } from '@/components/features/question/shared/time-progress-bar';
import Monster from '@/components/features/question/anomaly-monster/monster';
import { DecisionTreeAnomalyTree } from '@/components/features/question/anomaly-monster/tree';
import { Button } from '@/components/ui/button';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import { AnomalyMonsterForm } from '@/models/anomaly-monster/anomaly-monster.model.type';
import MonsterClassificationForm from '@/components/features/question/anomaly-monster/monster-classification-form';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

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
  const [isFormOpen, setIsFormOpen] = useState<boolean>(true);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

  const { ref: progressRef, inView: isProgressVisible } = useInView({
    threshold: 0.5
  });

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
          <div className="max-w-[95%] mx-auto p-2">
            {questionMetadata && (
              <TimeProgressBar
                currentDuration={currentDuration()}
                estimatedTime={questionMetadata.estimatedTime}
                formattedDuration={formattedDuration}
              />
            )}

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm mb-3">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🏝️</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-blue-800 mb-3">
                    👾 Monster yang Aneh: Pulau Monster
                  </h2>
                  <p className="text-blue-700 leading-relaxed">
                    Di <strong>Pulau Monster</strong>, muncul{' '}
                    <strong>virus misterius</strong> yang membuat beberapa
                    monster berubah bentuk. Untungnya, para ilmuwan punya{' '}
                    <strong>pohon keputusan</strong> berdasarkan monster yang{' '}
                    {'  '}
                    <strong>normal</strong>. Pohon ini menunjukkan aturan
                    berdasarkan <strong>warna</strong>,{' '}
                    <strong>bentuk tubuh</strong>, dan {'  '}
                    <strong>mulut</strong> monster.
                  </p>
                  <p className="text-blue-700 leading-relaxed mt-3">
                    Gunakan pohon tersebut untuk meneliti setiap monster. Isi{' '}
                    <strong>form analisis</strong> untuk mencatat ciri-ciri
                    mereka, lalu tentukan apakah monster tersebut {'  '}
                    <strong className="italic font-semibold text-blue-600">
                      normal
                    </strong>{' '}
                    atau {'  '}
                    <strong className="italic underline text-blue-500">
                      terinfeksi
                    </strong>
                    !
                  </p>
                  <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                    <p className="text-blue-800 font-semibold">
                      🔬 Misi Anda: Sebagai peneliti monster, kamu ditugaskan
                      untuk menganalisis setiap monster yang ditemukan dan
                      menentukan status kesehatan mereka menggunakan{' '}
                      <strong>pohon keputusan monster yang normal</strong> yang
                      telah disediakan.
                    </p>
                  </div>
                </div>
              </div>
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
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-xl flex-1 shadow-lg p-4">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-semibold">
                      Periksa Status Setiap Monster!!
                    </h3>
                    <p className="text-sm text-gray-600">
                      🕵️ Klik setiap lingkaran untuk menganalisis monster!
                    </p>
                  </div>

                  {/* Trailing list */}
                  <div className="flex justify-center items-center gap-1 mb-4">
                    {Array.from({ length: totalMonsters }).map((_, idx) => {
                      const monsterId = question.content.choices[idx].id;
                      const isCurrent = currentIdx === idx;

                      const isNormal = normals.includes(monsterId);
                      const isAnomaly = anomalies.includes(monsterId);

                      return (
                        <Fragment
                          key={`${monsterId}-${normals.join()}-${anomalies.join()}-${currentIdx}`}
                        >
                          <motion.div
                            className={`relative w-10 h-10 flex items-center justify-center rounded-full text-xl font-bold cursor-pointer transition-all
                            ${
                              isCurrent
                                ? 'bg-yellow-400 scale-110'
                                : isNormal
                                  ? 'bg-green-400 hover:scale-110'
                                  : isAnomaly
                                    ? 'bg-red-400 hover:scale-110'
                                    : 'bg-gray-300 hover:scale-110'
                            }
                          `}
                            title={`Klik untuk monster ${question.content.choices[idx].name}`}
                            onClick={() => {
                              setCurrentIdx(idx);
                              setIsFormOpen(
                                currentIdx === idx ? !isFormOpen : true
                              );
                            }}
                            animate={
                              !isCurrent && !isNormal && !isAnomaly
                                ? {
                                    background: [
                                      'linear-gradient(90deg, #d0d0d0 0%, #ffffff 50%, #d0d0d0 100%)',
                                      'linear-gradient(90deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%)',
                                      'linear-gradient(90deg, #f0f0f0 0%, #ffffff 50%, #f0f0f0 100%)'
                                    ],
                                    backgroundSize: '200% 100%',
                                    boxShadow: [
                                      '0 0 0 rgba(255,255,255,0)',
                                      '0 0 8px rgba(255,255,255,0.7)',
                                      '0 0 0 rgba(255,255,255,0)'
                                    ],
                                    opacity: [0.9, 1, 0.9]
                                  }
                                : {}
                            }
                            transition={
                              !isCurrent && !isNormal && !isAnomaly
                                ? {
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    repeatType: 'loop'
                                  }
                                : {}
                            }
                            whileHover={{
                              scale: 1.15,
                              transition: { duration: 0.15 }
                            }}
                            aria-label={`Pilihan ${idx + 1}: ${question.content.choices[idx].name}`}
                          >
                            {isCurrent && (
                              <motion.span
                                className="absolute -top-1 -right-1 text-yellow-400 text-xl pointer-events-none select-none"
                                animate={{
                                  opacity: [0, 1, 0],
                                  scale: [1, 1.6, 1],
                                  rotate: [0, 20, 0],
                                  textShadow: [
                                    '0 0 0 rgba(255,215,0,0)',
                                    '0 0 8px rgba(255,215,0,0.8)',
                                    '0 0 0 rgba(255,215,0,0)'
                                  ]
                                }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  times: [0, 0.5, 1]
                                }}
                              >
                                ✨
                              </motion.span>
                            )}

                            <div className="scale-125">
                              {isCurrent
                                ? '🔍'
                                : isNormal
                                  ? '😊'
                                  : isAnomaly
                                    ? '👾'
                                    : '❓'}
                            </div>
                          </motion.div>

                          {idx < totalMonsters - 1 && (
                            <div className="w-4 h-px bg-gray-400" />
                          )}
                        </Fragment>
                      );
                    })}
                  </div>

                  <p className="text-gray-600 mt-4 text-center">
                    Kamu telah memeriksa {classifiedCount} dari {totalMonsters}{' '}
                    monster
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
              </div>

              {classifiedCount === totalMonsters && !isProgressVisible && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
                  <motion.div
                    className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                    animate={{
                      y: ['-20%', '0%', '-20%'] // Kurangi jarak bounce
                    }}
                    transition={{
                      duration: 0.8, // Lebih cepat
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    whileHover={{ y: 0 }}
                  >
                    <span className="text-sm">⬇ Sudah selesai?</span>
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
                      Lanjut ke bawah
                    </button>
                  </motion.div>
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
                  <div className="flex flex-row">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full mr-2"
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
          </div>
        </div>
      )}
      <DynamicHelp questionType={QuestionTypeEnum.ANOMALY_MONSTER} />
    </SolverWrapper>
  );
}
