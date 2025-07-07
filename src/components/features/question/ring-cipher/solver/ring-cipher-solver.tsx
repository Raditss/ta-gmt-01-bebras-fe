"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RingCipherQuestion } from '@/models/ring-cipher/question/ring-cipher.question.model';
import { MainNavbar } from '@/components/main-navbar';
import { questionService } from '@/services/questionService';
import { useAuth } from '@/lib/auth';
import { BaseSolverProps, SolverWrapper } from './base-solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmissionModal } from './submission-modal';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Custom hook for ring cipher question attempts
const useRingCipherQuestionAttempt = (questionId: string) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState<RingCipherQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState<Date>(new Date());

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(questionId);
        const q = new RingCipherQuestion(
          questionData.id,
          questionData.title,
          questionData.isGenerated,
          questionData.duration,
          new Date()
        );
        q.populateQuestionFromString(questionData.content);
        setQuestion(q);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch question:', err);
        setError('Failed to fetch question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  return {
    question,
    loading,
    error,
    currentDuration: () => {
      return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    }
  };
};

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
        {/* Marker at 12 o'clock position - moved higher up with down arrow */}
        <polygon
          points={`${centerX},15 ${centerX - 8},5 ${centerX + 8},5`}
          fill="red"
          className="drop-shadow"
        />


        {/* Draw rings from outer to inner */}
        {rings.slice().reverse().map((ring, reverseIndex) => {
          const ringIndex = rings.length - 1 - reverseIndex;
          const radius = minRadius + (maxRadius - minRadius) * (ringIndex + 1) / rings.length;
          const isHighlighted = ringIndex === highlightedRing;
          const currentPosition = ringPositions[ringIndex] || 0;
          
          const angleStep = (2 * Math.PI) / ring.letters.length;
          // Calculate rotation angle for the entire ring
          const rotationAngle = -(currentPosition * angleStep * 180) / Math.PI;
          
          return (
            <g key={ring.id}>
              {/* Ring circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={isHighlighted ? ringColors[ringIndex % ringColors.length] : '#D1D5DB'}
                strokeWidth={isHighlighted ? "4" : "2"}
                className="transition-all duration-500"
              />
              
              {/* Ring letters group with rotation transform */}
              <g 
                transform={`rotate(${rotationAngle} ${centerX} ${centerY})`}
                className="transition-all duration-500 ease-in-out"
              >
                {ring.letters.map((letter, letterIndex) => {
                  const angle = letterIndex * angleStep - Math.PI / 2; // Start from top
                  const x = centerX + radius * Math.cos(angle);
                  const y = centerY + radius * Math.sin(angle);
                  
                  const isAtMarker = letterIndex === currentPosition; // Letter at marker after rotation
                  const isTargetLetter = highlightedLetter && 
                                       highlightedLetter.ring === ringIndex && 
                                       highlightedLetter.letter === letter;
                  
                  return (
                    <g key={letterIndex}>
                      {/* Letter background circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="15"
                        fill={isTargetLetter ? '#FDE68A' : isAtMarker ? '#FEF3C7' : 'white'}
                        stroke={isTargetLetter ? '#D97706' : isAtMarker ? '#F59E0B' : ringColors[ringIndex % ringColors.length]}
                        strokeWidth={isTargetLetter ? "3" : isAtMarker ? "3" : "1"}
                        className="transition-all duration-300"
                      />
                      
                      {/* Letter text - counter-rotated to stay upright */}
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
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="5" fill="black" />
      </svg>
      
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {rings.map((ring, index) => (
          <Badge
            key={ring.id}
            variant="outline"
            className={`${
              index === highlightedRing ? 'border-2' : 'border'
            }`}
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
  const { user } = useAuth();
  const [ringValue, setRingValue] = useState<string>("");
  const [stepsValue, setStepsValue] = useState<string>("");
  const [finalAnswer, setFinalAnswer] = useState<string>("");
  const [ringPositions, setRingPositions] = useState<number[]>([]);
  const [highlightedRing, setHighlightedRing] = useState<number | undefined>(undefined);
  const [highlightedLetter, setHighlightedLetter] = useState<{ ring: number; letter: string } | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Setup hooks for question functionality
  const { question, loading, error, currentDuration } = useRingCipherQuestionAttempt(questionId);
  const { formattedDuration, getCurrentDuration } = useDuration(currentDuration());

  const content = question?.getContent();
  const rings = content?.rings || [];

  // Initialize ring positions when question loads
  useEffect(() => {
    if (question && content) {
      const state = question.getCurrentState();
      setRingPositions(state.ringPositions);
    }
  }, [question, content]);

  // Update highlights and preview ring rotation when ring/steps values change
  useEffect(() => {
    const ring = parseInt(ringValue);
    const steps = parseInt(stepsValue);
    
    if (!isNaN(ring) && ring >= 1 && ring <= rings.length) {
      setHighlightedRing(ring - 1);
      
      if (!isNaN(steps)) {
        // Update ring position for live preview and highlight the target letter
        const ringIndex = ring - 1;
        const basePosition = question?.getCurrentState().ringPositions[ringIndex] || 0;
        const previewPosition = (basePosition + steps) % rings[ringIndex].letters.length;
        
        // Update ring positions for preview
        const newPositions = [...(question?.getCurrentState().ringPositions || [])];
        newPositions[ringIndex] = previewPosition;
        setRingPositions(newPositions);
        
        // Highlight the letter that will be at the marker
        const targetLetter = rings[ringIndex].letters[previewPosition];
        setHighlightedLetter({ ring: ringIndex, letter: targetLetter });
      } else {
        // Reset to original positions when no steps entered
        if (question) {
          setRingPositions([...question.getCurrentState().ringPositions]);
        }
        setHighlightedLetter(undefined);
      }
    } else {
      setHighlightedRing(undefined);
      setHighlightedLetter(undefined);
      // Reset to original positions when no valid ring selected
      if (question) {
        setRingPositions([...question.getCurrentState().ringPositions]);
      }
    }
  }, [ringValue, stepsValue, rings, question]);

  const handleRingChange = useCallback((value: string) => {
    // Only allow numbers and validate range
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
    // Only allow numbers and validate range
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

    const code = `${ring}${steps}`;
    
    if (finalAnswer === "") {
      setFinalAnswer(code);
    } else {
      setFinalAnswer(prev => `${prev}-${code}`);
    }
    
    // Update the actual question state and ring positions
    if (question) {
      // Rotate the ring in the question model
      question.rotateRing(ringIndex, steps);
      
      // Save the state and update local positions
      question.saveState();
      const newState = question.getCurrentState();
      setRingPositions([...newState.ringPositions]);
    }
    
    // Clear inputs
    setRingValue("");
    setStepsValue("");
  }, [ringValue, stepsValue, finalAnswer, rings, question]);

  const handleClearAnswer = useCallback(() => {
    setFinalAnswer("");
    setRingPositions(rings.map(() => 0)); // Reset all rings to position 0
    setRingValue("");
    setStepsValue("");
  }, [rings]);

  const handleSubmit = async () => {
    if (!question) return;
    setIsSubmitting(true);
  };

  const handleConfirmSubmit = async () => {
    if (!question || !user?.id) return;
    
    try {
      const duration = getCurrentDuration();
      
      question.setAttemptData(String(user.id), duration, 'completed');
      await questionService.submitAttempt(question.getAttemptData());

      // Check if answer matches expected format and content
      const expectedAnswer = content?.answer.encrypted || "";
      const isCorrect = finalAnswer === expectedAnswer;
      
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
  };

  const handleModalClose = () => {
    setIsSubmitting(false);
    setSubmissionResult(null);
    router.push('/problems');
  };

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

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && content && (
        <>
          {/* Duration display */}
          <div className="fixed top-20 right-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2 z-10">
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formattedDuration}</span>
          </div>

          <div className="max-w-6xl mx-auto space-y-6">
            {/* Problem Description */}
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
              {/* Interactive Ring Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Ring Cipher</CardTitle>
                </CardHeader>
                <CardContent>
                  <RingVisualization
                    rings={rings}
                    ringPositions={ringPositions}
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
                      {finalAnswer || "No codes added yet"}
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
                    disabled={!finalAnswer}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Submit Answer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submission Modal */}
          <SubmissionModal
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