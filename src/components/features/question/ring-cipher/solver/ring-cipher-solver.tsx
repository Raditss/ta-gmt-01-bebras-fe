'use client';

import { useState, useEffect, useCallback } from 'react';
import { RingCipherSolveModel } from '@/models/ring-cipher/ring-cipher.solve.model';
import {
  BaseSolverProps,
  SolverWrapper
} from '@/components/features/bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { TimeProgressBar } from '@/components/ui/time-progress-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';

interface RingVisualizationProps {
  rings: Array<{ id: number; letters: string[]; currentPosition: number }>;
  ringPositions: number[];
  highlightedRing?: number;
  highlightedLetter?: { ring: number; letter: string };
}

function RingVisualization({
  rings,
  ringPositions,
  highlightedRing,
  highlightedLetter
}: RingVisualizationProps) {
  const centerX = 250;
  const centerY = 250;
  // Dynamic spacing based on ring count for better visual balance
  const ringCount = rings.length;
  let minRadius, maxRadius;

  if (ringCount === 2) {
    // For 2 rings: give more space around center
    minRadius = 100;
    maxRadius = 200;
  } else if (ringCount === 3) {
    // For 3 rings: balanced spacing
    minRadius = 80;
    maxRadius = 210;
  } else {
    // For 4+ rings: tighter inner spacing, extended outer
    minRadius = 60;
    maxRadius = 220;
  }

  const ringColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox="0 0 500 500"
        className="border-2 border-gray-300 rounded-lg bg-white w-full max-w-[500px] h-auto aspect-square"
      >
        <polygon
          points={`${centerX},15 ${centerX - 8},5 ${centerX + 8},5`}
          fill="red"
          className="drop-shadow"
        />
        {rings
          .slice()
          .reverse()
          .map((ring, reverseIndex) => {
            const ringIndex = rings.length - 1 - reverseIndex;
            // Better spacing calculation for multiple rings
            const radiusStep =
              (maxRadius - minRadius) / Math.max(rings.length - 1, 1);
            const radius = minRadius + radiusStep * ringIndex;
            const isHighlighted = ringIndex === highlightedRing;
            const currentPosition = ringPositions[ringIndex] || 0;
            const angleStep = (2 * Math.PI) / ring.letters.length;
            const rotationAngle =
              -(currentPosition * angleStep * 180) / Math.PI;
            return (
              <g key={ring.id}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={
                    isHighlighted
                      ? ringColors[ringIndex % ringColors.length]
                      : '#D1D5DB'
                  }
                  strokeWidth={isHighlighted ? '4' : '2'}
                  className="transition-all duration-500"
                />
                <g
                  transform={`rotate(${rotationAngle} ${centerX} ${centerY})`}
                  className="transition-all duration-500 ease-in-out"
                >
                  {ring.letters.map((letter, letterIndex) => {
                    const angle = letterIndex * angleStep - Math.PI / 2;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    const isAtMarker = letterIndex === currentPosition;
                    const isTargetLetter =
                      highlightedLetter &&
                      highlightedLetter.ring === ringIndex &&
                      highlightedLetter.letter === letter;
                    return (
                      <g key={letterIndex}>
                        <circle
                          cx={x}
                          cy={y}
                          r="15" // Reduced from 18 to prevent crowding
                          fill={
                            isTargetLetter
                              ? '#FDE68A'
                              : isAtMarker
                                ? '#FEF3C7'
                                : 'white'
                          }
                          stroke={
                            isTargetLetter
                              ? '#D97706'
                              : isAtMarker
                                ? '#F59E0B'
                                : ringColors[ringIndex % ringColors.length]
                          }
                          strokeWidth={
                            isTargetLetter ? '3' : isAtMarker ? '3' : '2'
                          }
                          className="transition-all duration-300"
                        />
                        <text
                          x={x}
                          y={y + 5} // Adjusted for smaller circle
                          textAnchor="middle"
                          transform={`rotate(${-rotationAngle} ${x} ${y})`}
                          className={`text-sm font-bold transition-all duration-300 ${
                            isTargetLetter
                              ? 'fill-white'
                              : isAtMarker
                                ? 'fill-orange-700'
                                : 'fill-gray-700'
                          }`}
                        >
                          {letter}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </g>
            );
          })}
        <circle cx={centerX} cy={centerY} r="5" fill="black" />
      </svg>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {rings.map((ring, index) => (
          <Badge
            key={ring.id}
            variant="outline"
            className={`text-sm px-3 py-1 ${index === highlightedRing ? 'border-2' : 'border'}`}
            style={{
              borderColor: ringColors[index % ringColors.length],
              backgroundColor:
                index === highlightedRing
                  ? `${ringColors[index % ringColors.length]}20`
                  : 'white'
            }}
          >
            Ring {ring.id}: Position {ringPositions[index] || 0}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function RingCipherSolver({ questionId }: BaseSolverProps) {
  const { question, loading, error, currentDuration } =
    useSolveQuestion<RingCipherSolveModel>(questionId, RingCipherSolveModel);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

  // UI state only
  const [ringValue, setRingValue] = useState<string>('');
  const [stepsValue, setStepsValue] = useState<string>('');
  const [highlightedRing, setHighlightedRing] = useState<number | undefined>(
    undefined
  );
  const [highlightedLetter, setHighlightedLetter] = useState<
    { ring: number; letter: string } | undefined
  >(undefined);
  const [previewPositions, setPreviewPositions] = useState<number[]>([]);

  const content = question?.getContent();
  const rings = content?.rings || [];
  const answer = question?.getAnswer();
  const ringPositions = answer?.ringPositions || rings.map(() => 0);
  const answerArr = answer?.encryptedMessage || [];

  // Keep preview in sync with input
  useEffect(() => {
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    if (!isNaN(ring) && ring >= 1 && ring <= rings.length) {
      setHighlightedRing(ring - 1);
      if (!isNaN(steps)) {
        const ringIndex = ring - 1;
        const basePosition = ringPositions[ringIndex] || 0;
        const previewPosition =
          (basePosition + steps) % rings[ringIndex].letters.length;
        const newPreview = [...ringPositions];
        newPreview[ringIndex] = previewPosition;
        setPreviewPositions(newPreview);
        setHighlightedLetter({
          ring: ringIndex,
          letter: rings[ringIndex].letters[previewPosition]
        });
      } else {
        setPreviewPositions([...ringPositions]);
        setHighlightedLetter(undefined);
      }
    } else {
      setHighlightedRing(undefined);
      setHighlightedLetter(undefined);
      setPreviewPositions([...ringPositions]);
    }
  }, [ringValue, stepsValue, rings, ringPositions]);

  // Input handlers
  const handleRingChange = useCallback(
    (value: string) => {
      if (
        value === '' ||
        (/^\d+$/.test(value) &&
          parseInt(value) >= 1 &&
          parseInt(value) <= rings.length)
      ) {
        setRingValue(value);
      }
    },
    [rings.length]
  );

  const handleStepsChange = useCallback(
    (value: string) => {
      const ring = parseInt(ringValue);
      if (isNaN(ring) || ring < 1 || ring > rings.length) {
        return;
      }
      const maxSteps = rings[ring - 1].letters.length;
      if (
        value === '' ||
        (/^\d+$/.test(value) &&
          parseInt(value) >= 0 &&
          parseInt(value) < maxSteps)
      ) {
        setStepsValue(value);
      }
    },
    [ringValue, rings]
  );

  // Add to answer using model
  const handleAddToAnswer = useCallback(() => {
    if (!question) return;
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    if (isNaN(ring) || isNaN(steps)) return;
    if (ring < 1 || ring > rings.length) return;
    const ringIndex = ring - 1;
    const maxSteps = rings[ringIndex].letters.length;
    if (steps < 0 || steps >= maxSteps) return;
    // Save state for undo
    question.encryptLetter(
      rings[ringIndex].letters[(ringPositions[ringIndex] + steps) % maxSteps]
    );
    setRingValue('');
    setStepsValue('');
  }, [question, ringValue, stepsValue, rings, ringPositions]);

  // Undo last step
  const handleUndo = useCallback(() => {
    if (!question) return;
    question.undo();
  }, [question]);

  // Clear all (reset)
  const handleClearAnswer = useCallback(() => {
    if (!question) return;
    question.resetToInitialState();
    setRingValue('');
    setStepsValue('');
  }, [question]);

  // For display: join as '12-34-56'
  const finalAnswerDisplay = answerArr.map(([r, s]) => `${r}${s}`).join('-');

  const isValidInputs = () => {
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    return (
      !isNaN(ring) &&
      !isNaN(steps) &&
      ring >= 1 &&
      ring <= rings.length &&
      steps >= 0 &&
      steps < (rings[ring - 1]?.letters.length || 1)
    );
  };

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && content && (
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
                {content.question.prompt}
              </h1>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Ring Cipher */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <RingVisualization
                  rings={rings}
                  ringPositions={
                    previewPositions.length ? previewPositions : ringPositions
                  }
                  highlightedRing={highlightedRing}
                  highlightedLetter={highlightedLetter}
                />
                <div className="mt-6 flex justify-center space-x-6">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-sm px-3 py-1"
                  >
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Marker Position
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-orange-100 text-sm px-3 py-1"
                  >
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    Target Letter
                  </Badge>
                </div>
              </div>

              {/* Right Side - Encryption Controls */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-8">
                  Encryption Controls
                </h2>

                <div className="space-y-6">
                  {/* Ring Input */}
                  <div>
                    <label className="block text-base font-medium mb-3">
                      Ring Number (1-{rings.length}):
                    </label>
                    <Input
                      type="text"
                      value={ringValue}
                      onChange={(e) => handleRingChange(e.target.value)}
                      placeholder={`Enter 1-${rings.length}`}
                      className="w-full text-lg py-3 px-4"
                    />
                  </div>

                  {/* Steps Input */}
                  <div>
                    <label className="block text-base font-medium mb-3">
                      Rotation Steps (0-
                      {rings[parseInt(ringValue) - 1]?.letters.length - 1 || 0}
                      ):
                    </label>
                    <Input
                      type="text"
                      value={stepsValue}
                      onChange={(e) => handleStepsChange(e.target.value)}
                      placeholder={`Enter 0-${rings[parseInt(ringValue) - 1]?.letters.length - 1 || 0}`}
                      className="w-full text-lg py-3 px-4"
                      disabled={!rings[parseInt(ringValue) - 1]}
                    />
                  </div>

                  {/* Add to Final Answer Button */}
                  <Button
                    onClick={handleAddToAnswer}
                    disabled={!isValidInputs()}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-regular py-3 text-lg"
                  >
                    Add to Final Answer
                  </Button>

                  {/* Final Answer Section */}
                  <div className="mt-8">
                    <label className="block text-base font-medium mb-3">
                      Final Answer:
                    </label>
                    <div className="p-6 bg-gray-50 rounded-lg border min-h-[100px] font-mono text-xl">
                      {finalAnswerDisplay || ''}
                    </div>

                    {/* Undo and Clear Buttons */}
                    <div className="flex gap-4 mt-4">
                      <Button
                        onClick={handleUndo}
                        className="flex-1 py-3 text-base bg-yellow-400 hover:bg-yellow-500 text-black"
                        disabled={answerArr.length === 0}
                      >
                        Undo
                      </Button>
                      <Button
                        onClick={handleClearAnswer}
                        className="flex-1 py-3 text-base bg-red-500 hover:bg-red-600 text-white"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Submit Section */}
                  <SubmitSection
                    question={question}
                    getCurrentDuration={getCurrentDuration}
                    content={content}
                    answerArr={answerArr}
                    isDisabled={false}
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
