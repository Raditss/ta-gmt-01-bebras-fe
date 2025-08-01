'use client';

import { RulesTableShared } from '@/components/features/question/cfg/shared/rules-table.shared';
import { StateDisplaySolve } from '@/components/features/question/cfg/solve/state-display.solve';
import { TimeProgressBar } from '@/components/features/question/shared/time-progress-bar';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { useDuration } from '@/hooks/useDuration';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { useSoundQueue } from '@/hooks/useSoundQueue';
import { Rule, State } from '@/types/cfg.type';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { BaseSolverProps, SolverWrapper } from '../../bases/base.solver';
import { CfgSolveModel } from '@/models/cfg/cfg.solve.model';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import { QuestionTypeEnum } from '@/types/question-type.type';
import {
  FishermanStory,
  Fisherman,
  FishermanMood
} from '@/components/features/question/cfg/shared/fisherman';

export default function CfgSolver({ questionId }: BaseSolverProps) {
  const {
    question,
    questionMetadata,
    loading,
    error,
    currentDuration,
    markAsSubmitted
  } = useSolveQuestion(questionId, CfgSolveModel);

  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());
  const { playFishSelect, playFishDeselect, playTradeApply } = useSoundQueue();

  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);
  const [fishermanMood, setFishermanMood] = useState<FishermanMood>('wave');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHints, setShowHints] = useState(true);

  // Helper function to get current hint
  const getCurrentHint = () => {
    if (!question || currentState.length === 0) return null;

    const targetState = question.getQuestionSetup().endState;
    const isGameComplete =
      JSON.stringify(currentState.map((s) => s.type).sort()) ===
      JSON.stringify(targetState.map((s) => s.type).sort());

    if (isGameComplete) {
      return {
        type: 'success',
        message: '🎉 Selamat! Anda telah mencapai target koleksi ikan!'
      };
    }

    if (selectedIndices.length === 0) {
      return {
        type: 'info',
        message:
          '👆 Mulai dengan mengklik ikan di "Koleksi Ikan Sekarang" yang ingin Anda tukar. Lihat aturan perdagangan di sebelah kiri untuk mengetahui kombinasi ikan yang bisa ditukar.'
      };
    }

    if (applicableRules.length === 0) {
      return {
        type: 'warning',
        message:
          '⚠️ Tidak ada aturan yang bisa diterapkan untuk ikan yang dipilih. Coba pilih kombinasi ikan lain yang sesuai dengan aturan perdagangan.'
      };
    }

    return {
      type: 'success',
      message: `✅ Bagus! Ada ${applicableRules.length} aturan perdagangan yang bisa diterapkan. Klik pada baris biru di tabel aturan perdagangan untuk menerapkannya.`
    };
  };

  useEffect(() => {
    if (question) {
      const questionSetup = question.getQuestionSetup();
      setCurrentState([...questionSetup.startState]);
    }
  }, [question]);

  useEffect(() => {
    if (question && currentState.length > 0) {
      // Filter available rules based on selected indices and current state
      const availableRules = question.getAvailableRules();

      if (selectedIndices.length > 0) {
        // Sort selected indices to get the natural order in the state
        const sortedSelectedIndices = [...selectedIndices].sort(
          (a, b) => a - b
        );

        // Get the types in their natural state order
        const selectedTypesInOrder = sortedSelectedIndices
          .map((index) => currentState[index]?.type)
          .filter(Boolean);

        const applicable = availableRules.filter((rule) => {
          // Check if the selected types match this rule's before pattern
          if (rule.before.length !== selectedTypesInOrder.length) {
            return false;
          }

          // Check if the selected types (in state order) match the rule's before types exactly
          const exactMatch = rule.before.every(
            (obj, i) => obj.type === selectedTypesInOrder[i]
          );

          return exactMatch;
        });

        setApplicableRules(applicable);
      } else {
        setApplicableRules([]);
      }
    }
  }, [question, currentState, selectedIndices]);

  // Update fisherman mood based on game state
  useEffect(() => {
    if (selectedIndices.length > 0) {
      setFishermanMood('thinking');
    } else if (question && currentState.length > 0) {
      const targetState = question.getQuestionSetup().endState;
      const isGameComplete =
        JSON.stringify(currentState.map((s) => s.type).sort()) ===
        JSON.stringify(targetState.map((s) => s.type).sort());
      if (isGameComplete) {
        setFishermanMood('happy');
      } else {
        setFishermanMood('wave');
      }
    }
  }, [selectedIndices, currentState, question]);

  const handleObjectClick = useCallback(
    (index: number) => {
      setSelectedIndices((prev) => {
        const newSelected = prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index];

        // Sort the selected indices by their position in the state array
        // This ensures the order is always left-to-right regardless of click order
        const sortedSelected = newSelected.sort((a, b) => a - b);

        // Play sound feedback
        if (prev.includes(index)) {
          playFishDeselect();
        } else {
          playFishSelect();
        }

        return sortedSelected;
      });
    },
    [playFishSelect, playFishDeselect]
  );

  const handleApplyRule = useCallback(
    (rule: Rule) => {
      if (!question || selectedIndices.length === 0) return;

      setIsAnimating(true);
      playTradeApply();

      // Add animation delay for better UX
      setTimeout(() => {
        // Use the sorted indices for rule application
        const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
        const success = question.applyRule(
          rule.id,
          sortedIndices[0],
          rule.before.length
        );
        if (success) {
          setCurrentState([...question.getCurrentState()]);
          setSelectedIndices([]);
        }
        setIsAnimating(false);
      }, 500);
    },
    [question, selectedIndices, playTradeApply]
  );

  const handleUndo = useCallback(() => {
    if (question) {
      const success = question.undo();
      if (success) {
        setCurrentState([...question.getCurrentState()]);
        setSelectedIndices([]);
      }
    }
  }, [question]);

  const handleRedo = useCallback(() => {
    if (question) {
      const success = question.redo();
      if (success) {
        setCurrentState([...question.getCurrentState()]);
        setSelectedIndices([]);
      }
    }
  }, [question]);

  const handleReset = useCallback(() => {
    if (question) {
      question.resetToInitialState();
      setCurrentState([...question.getCurrentState()]);
      setSelectedIndices([]);
      setFishermanMood('wave');
    }
  }, [question]);

  if (loading || !question || !questionMetadata) {
    return (
      <SolverWrapper loading={loading} error={error}>
        <div />
      </SolverWrapper>
    );
  }

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && questionMetadata && (
        <div className="max-w-full mx-auto p-6">
          {/* Time Progress Bar */}
          <TimeProgressBar
            currentDuration={getCurrentDuration()}
            estimatedTime={questionMetadata.estimatedTime}
            formattedDuration={formattedDuration}
          />

          {/* Fisherman Story Section */}
          <div className="mb-8">
            <FishermanStory />
          </div>

          {/* Guided Hints Section */}
          {showHints && (
            <div className="mb-6">
              {(() => {
                const hint = getCurrentHint();
                if (!hint) return null;

                const bgColor = {
                  info: 'bg-blue-50 border-blue-200',
                  warning: 'bg-yellow-50 border-yellow-200',
                  success: 'bg-green-50 border-green-200'
                }[hint.type];

                const textColor = {
                  info: 'text-blue-800',
                  warning: 'text-yellow-800',
                  success: 'text-green-800'
                }[hint.type];

                return (
                  <div
                    className={`${bgColor} border-2 rounded-lg p-4 relative`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`${textColor} font-medium flex-1`}>
                        {hint.message}
                      </div>
                      <button
                        onClick={() => setShowHints(false)}
                        className="ml-4 text-gray-500 hover:text-gray-700 text-sm"
                        title="Sembunyikan petunjuk"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Help Button - Prominent placement */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg shadow-lg">
              <div className="bg-white rounded-md p-2">
                <DynamicHelp questionType={QuestionTypeEnum.CFG} />
              </div>
            </div>
          </div>

          {/* Main Layout - 50/50 Split */}
          <div className="grid grid-cols-2 gap-6">
            {/* Trading Table - Left side (50% width) */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex justify-center items-start mb-2">
                <h2 className="text-2xl font-bold text-center text-foreground">
                  📋 Meja Perdagangan Ikan
                </h2>
              </div>
              {/* Interactive rules table */}
              <div className="overflow-visible">
                <RulesTableShared
                  rules={question.getAvailableRules()}
                  isInteractive={true}
                  applicableRules={applicableRules}
                  onApplyRule={handleApplyRule}
                />
              </div>
            </div>

            {/* Right side - Current and Target states (50% width) */}
            <div className="space-y-4">
              {/* Sticky container for both current and target */}
              <div className="sticky top-[12vh]">
                {/* Current State Title - moved outside to avoid overlap */}
                <h2 className="text-xl font-bold mb-4 text-center">
                  🐟 Koleksi Ikan Sekarang
                </h2>

                {/* Current State with half-covered Fisherman */}
                <div className="bg-card rounded-lg p-4 shadow-lg border mb-6 relative">
                  {/* Fisherman positioned so half body is covered by the box */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-0">
                    <Fisherman
                      mood={fishermanMood}
                      size="md"
                      showHalfBody={true}
                      position="behind"
                      className="opacity-90"
                    />
                  </div>
                  <StateDisplaySolve
                    title=""
                    state={currentState}
                    isInteractive={true}
                    selectedIndices={selectedIndices}
                    onObjectClick={handleObjectClick}
                    containerClassName="bg-transparent border-none p-0 relative z-10"
                  />
                </div>

                {/* Blinking Arrow */}
                <div className="flex justify-center mb-3 items-center gap-3">
                  <div className="animate-bounce">
                    <Image
                      src="/graphic/arrow.png"
                      alt="Arrow pointing down"
                      width={32}
                      height={32}
                      className="transform rotate-90"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-base font-bold text-white bg-blue-600 px-2 py-1 rounded-full">
                      Tukar menjadi
                    </span>
                  </div>
                  <div className="animate-bounce">
                    <Image
                      src="/graphic/arrow.png"
                      alt="Arrow pointing down"
                      width={32}
                      height={32}
                      className="transform rotate-90"
                    />
                  </div>
                </div>

                {/* Target State Title - moved outside for consistency */}
                <h2 className="text-xl font-bold mb-3 text-center">
                  🎯 Target Koleksi Ikan
                </h2>

                {/* Target State */}
                <div className="bg-card rounded-lg p-4 shadow-lg border">
                  <StateDisplaySolve
                    title=""
                    state={question.getQuestionSetup().endState}
                    containerClassName="bg-transparent border-none p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={handleUndo}
              variant="outline"
              disabled={isAnimating}
            >
              ↶ Batalkan
            </Button>
            <Button
              onClick={handleRedo}
              variant="outline"
              disabled={isAnimating}
            >
              ↷ Ulangi
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              disabled={isAnimating}
            >
              🔄 Reset
            </Button>
          </div>

          {/* Submit Section */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-lg">
              <SubmitSection
                question={question}
                getCurrentDuration={getCurrentDuration}
                answerArr={currentState}
                buttonText="🐟 Kirim Jawaban Perdagangan"
                onSubmissionSuccess={markAsSubmitted}
              />
            </div>
          </div>
        </div>
      )}
    </SolverWrapper>
  );
}
