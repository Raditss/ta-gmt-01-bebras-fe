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
import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';

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
        // Find rules that match the selected elements
        const selectedTypes = selectedIndices
          .map((index) => currentState[index]?.type)
          .filter(Boolean);
        const applicable = availableRules.filter((rule) => {
          return (
            rule.before.length === selectedTypes.length &&
            rule.before.every((obj, i) => obj.type === selectedTypes[i])
          );
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

        // Play sound feedback
        if (prev.includes(index)) {
          playFishDeselect();
        } else {
          playFishSelect();
        }

        return newSelected;
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
        const success = question.applyRule(
          rule.id,
          selectedIndices[0],
          selectedIndices.length
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

          {/* Main Layout - Flexible Grid */}
          <div className="grid grid-cols-4 gap-8">
            {/* Trading Table - Left side (3 columns wide) */}
            <div className="col-span-3 bg-card rounded-lg p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
                📋 Meja Perdagangan Ikan
              </h2>
              {/* Remove height constraints to let table flow naturally */}
              <div className="overflow-visible">
                <RulesTableShared rules={question.getAvailableRules()} />
              </div>
            </div>

            {/* Right side - Current and Target states (sticky container) */}
            <div className="space-y-4">
              {/* Sticky container for both current and target */}
              <div className="sticky top-[15vh]">
                {/* Current State Title - moved outside to avoid overlap */}
                <h2 className="text-xl font-bold mb-7 text-center">
                  🐟 Koleksi Ikan Sekarang
                </h2>

                {/* Current State with half-covered Fisherman */}
                <div className="bg-card rounded-lg p-4 shadow-lg border mb-8 relative">
                  {/* Fisherman positioned so half body is covered by the box */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-0">
                    <Fisherman
                      mood={fishermanMood}
                      size="lg"
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
                <div className="flex justify-center mb-3">
                  <div className="animate-bounce text-4xl">⬇️</div>
                  <div className="ml-2 flex items-center">
                    <span className="text-lg font-bold text-white bg-blue-600 px-3 py-1 rounded-full">
                      Tukar menjadi
                    </span>
                  </div>
                  <div className="animate-bounce text-4xl">⬇️</div>
                </div>

                {/* Target State Title - moved outside for consistency */}
                <h2 className="text-xl font-bold mb-4 text-center">
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

          {/* Available Trades Section - Fixed height */}
          <div className="mt-8 bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-bold mb-4 text-center">
              🔄 Perdagangan yang Tersedia
            </h2>

            {applicableRules.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {applicableRules.map((rule, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleApplyRule(rule)}
                    disabled={isAnimating}
                    className="p-6 bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-lg flex items-center space-x-4 min-h-[100px] transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex flex-wrap gap-2">
                      {rule.before.map((obj, idx) => (
                        <ShapeContainer key={idx}>
                          <Shape type={obj.type} size="md" />
                        </ShapeContainer>
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-gray-700">→</span>
                    <div className="flex flex-wrap gap-2">
                      {rule.after.map((obj, idx) => (
                        <ShapeContainer key={idx}>
                          <Shape type={obj.type} size="md" />
                        </ShapeContainer>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  {selectedIndices.length === 0
                    ? '🐟 Pilih ikan yang ingin ditukar terlebih dahulu'
                    : '🚫 Tidak ada perdagangan yang tersedia untuk ikan yang dipilih'}
                </p>
              </div>
            )}
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

          {/* Help Section */}
          <div className="mt-8">
            <DynamicHelp questionType={QuestionTypeEnum.CFG} />
          </div>
        </div>
      )}
    </SolverWrapper>
  );
}
