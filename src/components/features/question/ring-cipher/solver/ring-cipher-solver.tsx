"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RingCipherQuestionModel } from '@/models/ring-cipher/ring-cipher.question.model';
import { BaseSolverProps, SolverWrapper } from '@/components/features/bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmissionModalSolver } from '@/components/features/question/submission-modal.solver';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuestionAttempt } from '@/hooks/useQuestionAttempt';
import { questionService } from '@/lib/services/question.service';

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

export default function RingCipherSolver({ questionId }: BaseSolverProps) {
  const router = useRouter();
  const { question, loading, error, currentDuration } = useQuestionAttempt<RingCipherQuestionModel>(
    questionId,
    RingCipherQuestionModel

  );
  const { formattedDuration, getCurrentDuration } = useDuration(currentDuration());

  const [ringValue, setRingValue] = useState<string>("");
  const [stepsValue, setStepsValue] = useState<string>("");
  const [answerArr, setAnswerArr] = useState<[number, number][]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [ringPositions, setRingPositions] = useState<number[]>([]);
  const [highlightedRing, setHighlightedRing] = useState<number | undefined>(undefined);
  const [highlightedLetter, setHighlightedLetter] = useState<{ ring: number; letter: string } | undefined>(undefined);
  const [previewPositions, setPreviewPositions] = useState<number[]>([]);

  const content = question?.getContent();
  const rings = content?.rings || [];

  useEffect(() => {
    if (question && content) {
      const state = question.getCurrentState();
      setAnswerArr(state.encryptedMessage);
      setRingPositions(state.ringPositions || []);
    }
  }, [question, content]);

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

  const handleAddToAnswer = useCallback(() => {
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    if (isNaN(ring) || isNaN(steps)) return;
    if (ring < 1 || ring > rings.length) return;
    const ringIndex = ring - 1;
    const maxSteps = rings[ringIndex].letters.length;
    if (steps < 0 || steps >= maxSteps) return;
    setAnswerArr(prev => [...prev, [ring, steps]]);
    // Update ringPositions to reflect the rotation
    setRingPositions(prev => {
      const newPositions = [...prev];
      newPositions[ringIndex] = ((newPositions[ringIndex] || 0) + steps) % maxSteps;
      return newPositions;
    });
    setRingValue("");
    setStepsValue("");
  }, [ringValue, stepsValue, rings]);

  const handleClearAnswer = useCallback(() => {
    setAnswerArr([]);
    setRingPositions(rings.map(() => 0)); // Reset all rings to position 0
    setRingValue("");
    setStepsValue("");
  }, [rings]);

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;
    try {
      question.getCurrentState().encryptedMessage = answerArr;
      const duration = getCurrentDuration();
      question.setAttemptData(duration, false);
      const attemptData = question.getAttemptData();
      await questionService.submitAttempt({
        ...attemptData,
        answer: JSON.parse(attemptData.answer),
      });
      const expectedAnswer = content?.answer.encrypted || [];
      const isCorrect = answerArr.length === expectedAnswer.length && answerArr.every((pair, i) => pair[0] === expectedAnswer[i][0] && pair[1] === expectedAnswer[i][1]);
      const points = isCorrect ? Math.max(100 - Math.floor(duration / 10), 10) : 0;
      const streak = isCorrect ? 1 : 0;
      setSubmissionResult({
        isCorrect,
        points,
        streak,
        timeTaken: duration
      });
    } catch (err) {
      console.error('Failed to submit answer:', err);
    }
  }, [question, getCurrentDuration, content, answerArr]);

  const handleModalClose = useCallback(() => {
    setIsSubmitting(false);
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
    <SolverWrapper loading={loading} error={error}>
      {question && content && (
        <>
          <div className="fixed top-20 right-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2 z-10">
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formattedDuration}</span>
          </div>
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{content.question.prompt}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Message to encrypt:</strong> {content.question.plaintext}</p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Instructions:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      {content.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                  {content.example && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p><strong>Example:</strong> {content.example.plaintext} → {content.example.encrypted}</p>
                      <p className="text-sm text-gray-600">{content.example.explanation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-6">
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
                    <Button 
                      onClick={handleClearAnswer}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Clear Answer
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    disabled={answerArr.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <SubmissionModalSolver
            isOpen={isSubmitting || !!submissionResult}
            isConfirming={isSubmitting && !submissionResult}
            result={submissionResult}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setIsSubmitting(false)}
            onClose={handleModalClose}
          />
        </>
      )}
    </SolverWrapper>
  );
} 