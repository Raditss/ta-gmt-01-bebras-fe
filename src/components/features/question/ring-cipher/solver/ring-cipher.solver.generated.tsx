"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RingCipherSolveModel } from '@/models/ring-cipher/ring-cipher.solve.model';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { GeneratedSolverProps, GeneratedSolverWrapper } from '@/components/features/bases/base.solver.generated';
import { SubmissionModalSolver, SubmissionResult } from '@/components/features/question/submission-modal.solver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';

interface RingVisualizationProps {
  rings: Array<{ id: number; letters: string[]; currentPosition: number }>;
  ringPositions: number[];
  highlightedRing?: number;
  highlightedLetter?: { ring: number; letter: string };
}

function RingVisualization({ rings, ringPositions, highlightedRing, highlightedLetter }: RingVisualizationProps) {
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 160;
  const minRadius = 60;
  const ringColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  return (
    <div className="flex flex-col items-center">
      <svg width="400" height="400" className="border-2 border-gray-300 rounded-lg bg-white">
        <polygon
          points={`${centerX},15 ${centerX - 8},5 ${centerX + 8},5`}
          fill="red"
          className="drop-shadow"
        />
        {rings.slice().reverse().map((ring, reverseIndex) => {
          const ringIndex = rings.length - 1 - reverseIndex;
          const radius = minRadius + (maxRadius - minRadius) * (ringIndex + 1) / rings.length;
          const isHighlighted = ringIndex === highlightedRing;
          const currentPosition = ringPositions[ringIndex] || 0;
          const angleStep = (2 * Math.PI) / ring.letters.length;
          const rotationAngle = -(currentPosition * angleStep * 180) / Math.PI;
          return (
            <g key={ring.id}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={isHighlighted ? ringColors[ringIndex % ringColors.length] : '#D1D5DB'}
                strokeWidth={isHighlighted ? "4" : "2"}
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
                  const isTargetLetter = highlightedLetter && 
                                       highlightedLetter.ring === ringIndex && 
                                       highlightedLetter.letter === letter;
                  return (
                    <g key={letterIndex}>
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill={isTargetLetter ? '#FDE68A' : isAtMarker ? '#FEF3C7' : 'white'}
                        stroke={isTargetLetter ? '#D97706' : isAtMarker ? '#F59E0B' : ringColors[ringIndex % ringColors.length]}
                        strokeWidth={isTargetLetter ? "3" : isAtMarker ? "3" : "1"}
                        className="transition-all duration-300"
                      />
                      <text
                        x={x}
                        y={y + 5}
                        textAnchor="middle"
                        transform={`rotate(${-rotationAngle} ${x} ${y})`}
                        className={`text-sm font-bold transition-all duration-300 ${
                          isTargetLetter ? 'fill-yellow-800' : 
                          isAtMarker ? 'fill-orange-700' : 'fill-gray-700'
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
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {rings.map((ring, index) => (
          <Badge
            key={ring.id}
            variant="outline"
            className={`${index === highlightedRing ? 'border-2' : 'border'}`}
            style={{
              borderColor: ringColors[index % ringColors.length],
              backgroundColor: index === highlightedRing ? `${ringColors[index % ringColors.length]}20` : 'white'
            }}
          >
            Ring {ring.id}: Position {ringPositions[index] || 0}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function GeneratedRingCipherSolver({ type }: GeneratedSolverProps) {
  const router = useRouter();
  
  // Use the generated question hook
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<RingCipherSolveModel>(type, RingCipherSolveModel);

  // UI state only
  const [ringValue, setRingValue] = useState<string>("");
  const [stepsValue, setStepsValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [highlightedRing, setHighlightedRing] = useState<number | undefined>(undefined);
  const [highlightedLetter, setHighlightedLetter] = useState<{ ring: number; letter: string } | undefined>(undefined);
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
        const previewPosition = (basePosition + steps) % rings[ringIndex].letters.length;
        const newPreview = [...ringPositions];
        newPreview[ringIndex] = previewPosition;
        setPreviewPositions(newPreview);
        setHighlightedLetter({ ring: ringIndex, letter: rings[ringIndex].letters[previewPosition] });
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
  const handleRingChange = useCallback((value: string) => {
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= rings.length)) {
      setRingValue(value);
    }
  }, [rings.length]);

  const handleStepsChange = useCallback((value: string) => {
    const ring = parseInt(ringValue);
    if (isNaN(ring) || ring < 1 || ring > rings.length) {
      return;
    }
    const maxSteps = rings[ring - 1].letters.length;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) < maxSteps)) {
      setStepsValue(value);
    }
  }, [ringValue, rings]);

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
    question.encryptLetter(rings[ringIndex].letters[(ringPositions[ringIndex] + steps) % maxSteps]);
    setRingValue("");
    setStepsValue("");
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
    setRingValue("");
    setStepsValue("");
  }, [question]);

  // Submit answer
  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;
    
    try {
      setIsSubmitting(true);

      const response = await questionAttemptApi.checkGeneratedAnswer({
        type,
        questionContent,
        answer: JSON.stringify(question.toJSON())
      });

      setSubmissionResult({
        isCorrect: response.isCorrect
      });
    } catch (error) {
      console.error('❌ Error submitting answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [question, type, questionContent]);

  const handleCloseSubmissionModal = useCallback(() => {
    setSubmissionResult(null);
    router.push('/problems');
  }, [router]);

  const isValidInputs = () => {
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    return !isNaN(ring) && 
           !isNaN(steps) && 
           ring >= 1 && 
           ring <= rings.length &&
           steps >= 0 && 
           steps < (rings[ring - 1]?.letters.length || 1);
  };

  const finalAnswerDisplay = answerArr.map(([r, s]) => `${r}${s}`).join("-");

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && content && (
        <>
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Problem Description */}
            <Card>
              <CardHeader>
                <CardTitle>{content.question.prompt}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Message to encrypt:</strong> {content.question.plaintext}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Ring Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Ring Cipher</CardTitle>
                </CardHeader>
                <CardContent>
                  <RingVisualization
                    rings={rings}
                    ringPositions={previewPositions.length ? previewPositions : ringPositions}
                    highlightedRing={highlightedRing}
                    highlightedLetter={highlightedLetter}
                  />
                  <div className="mt-4 flex justify-center space-x-4">
                    <Badge variant="outline" className="bg-yellow-100">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Marker Position
                    </Badge>
                    <Badge variant="outline" className="bg-orange-100">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      Target Letter
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Encryption Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ring Number (1-{rings.length}):
                    </label>
                    <Input
                      type="text"
                      value={ringValue}
                      onChange={(e) => handleRingChange(e.target.value)}
                      placeholder={`Enter 1-${rings.length}`}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rotation Steps (0-{rings[parseInt(ringValue) - 1]?.letters.length - 1 || 0}):
                    </label>
                    <Input
                      type="text"
                      value={stepsValue}
                      onChange={(e) => handleStepsChange(e.target.value)}
                      placeholder={`Enter 0-${rings[parseInt(ringValue) - 1]?.letters.length - 1 || 0}`}
                      className="w-full"
                      disabled={!rings[parseInt(ringValue) - 1]}
                    />
                  </div>

                  <Button 
                    onClick={handleAddToAnswer}
                    disabled={!isValidInputs()}
                    className="w-full"
                  >
                    Add to Final Answer
                  </Button>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium mb-2">Final Answer:</label>
                    <div className="p-3 bg-gray-50 rounded border min-h-[50px] font-mono text-lg">
                      {finalAnswerDisplay || "No codes added yet"}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        onClick={handleUndo}
                        variant="outline"
                        className="w-1/2"
                        disabled={answerArr.length === 0}
                      >
                        Undo
                      </Button>
                      <Button 
                        onClick={handleClearAnswer}
                        variant="outline"
                        className="w-1/2"
                      >
                        Clear Answer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <Button onClick={regenerate} variant="outline">
                New Question
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting || answerArr.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </div>

          {/* Submission result modal */}
          <SubmissionModalSolver
            isOpen={isSubmitting || !!submissionResult}
            isConfirming={isSubmitting && !submissionResult}
            result={submissionResult}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setIsSubmitting(false)}
            onClose={handleCloseSubmissionModal}
          />
        </>
      )}
    </GeneratedSolverWrapper>
  );
}
