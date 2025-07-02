"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CipherQuestion } from '@/model/cipher/question/model';
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

// Custom hook for cipher question attempts
const useCipherQuestionAttempt = (questionId: string) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState<CipherQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState<Date>(new Date());

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const questionData = await questionService.getQuestionById(questionId);
        const q = new CipherQuestion(
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

interface PolygonProps {
  vertices: Array<{ pos: number; letters: string }>;
  currentVertex: number;
  targetVertex: number;
  highlightedPosition: number;
}

function OctagonVisualization({ vertices, currentVertex, targetVertex, highlightedPosition }: PolygonProps) {
  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  const vertexCount = vertices.length;

  // Calculate positions for vertices in a regular octagon
  const getVertexPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / vertexCount - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Calculate arrow position
  const currentPos = getVertexPosition(currentVertex);
  const targetPos = getVertexPosition(targetVertex);

  return (
    <div className="flex flex-col items-center">
      <svg width="400" height="400" className="border-2 border-gray-300 rounded-lg bg-white">
        {/* Draw octagon */}
        <polygon
          points={vertices.map((_, i) => {
            const pos = getVertexPosition(i);
            return `${pos.x},${pos.y}`;
          }).join(' ')}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />
        
        {/* Draw vertices and labels */}
        {vertices.map((vertex, i) => {
          const pos = getVertexPosition(i);
          const isTarget = i === targetVertex;
          const isCurrent = i === currentVertex;
          
          return (
            <g key={i}>
              {/* Vertex circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="25"
                fill={isTarget ? "rgb(239, 68, 68)" : isCurrent ? "rgb(34, 197, 94)" : "white"}
                stroke={isTarget ? "rgb(185, 28, 28)" : isCurrent ? "rgb(21, 128, 61)" : "rgb(107, 114, 128)"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Letters */}
              <text
                x={pos.x}
                y={pos.y - 35}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-700"
              >
                {vertex.letters}
              </text>
              
              {/* Highlight specific letter */}
              {isTarget && highlightedPosition > 0 && highlightedPosition <= vertex.letters.length && (
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-lg font-bold fill-yellow-600"
                >
                  {vertex.letters[highlightedPosition - 1]}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Arrow from center to current vertex */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        
        <line
          x1={centerX}
          y1={centerY}
          x2={currentPos.x - 25 * Math.cos(Math.atan2(currentPos.y - centerY, currentPos.x - centerX))}
          y2={currentPos.y - 25 * Math.sin(Math.atan2(currentPos.y - centerY, currentPos.x - centerX))}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
          className="transition-all duration-500"
        />
        
        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="5" fill="black" />
      </svg>
    </div>
  );
}

export default function CipherSolver({ questionId }: BaseSolverProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [rotationValue, setRotationValue] = useState<string>("");
  const [positionValue, setPositionValue] = useState<string>("");
  const [finalAnswer, setFinalAnswer] = useState<string>("");
  const [currentVertex, setCurrentVertex] = useState<number>(0);
  const [targetVertex, setTargetVertex] = useState<number>(0);
  const [highlightedPosition, setHighlightedPosition] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Setup hooks for question functionality
  const { question, loading, error, currentDuration } = useCipherQuestionAttempt(questionId);
  const { formattedDuration, getCurrentDuration } = useDuration(currentDuration());

  const content = question?.getContent();
  const vertices = content?.vertices || [];
  const maxRotation = vertices.length - 1;

  // Update states when rotation value changes
  useEffect(() => {
    const rotation = parseInt(rotationValue);
    if (!isNaN(rotation) && rotation >= 0 && rotation <= maxRotation) {
      const newTargetVertex = (currentVertex + rotation) % vertices.length;
      setTargetVertex(newTargetVertex);
    } else {
      setTargetVertex(currentVertex);
    }
  }, [rotationValue, currentVertex, vertices.length, maxRotation]);

  // Update highlighted position when position value changes
  useEffect(() => {
    const position = parseInt(positionValue);
    const targetLetters = vertices[targetVertex]?.letters || "";
    if (!isNaN(position) && position >= 1 && position <= targetLetters.length) {
      setHighlightedPosition(position);
    } else {
      setHighlightedPosition(0);
    }
  }, [positionValue, targetVertex, vertices]);

  // Initialize current vertex from question
  useEffect(() => {
    if (question && content) {
      const state = question.getCurrentState();
      setCurrentVertex(state.currentVertex);
    }
  }, [question, content]);

  const handleRotationChange = useCallback((value: string) => {
    // Only allow numbers and validate range
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) <= maxRotation)) {
      setRotationValue(value);
    }
  }, [maxRotation]);

  const handlePositionChange = useCallback((value: string) => {
    const targetLetters = vertices[targetVertex]?.letters || "";
    // Only allow numbers and validate range
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= targetLetters.length)) {
      setPositionValue(value);
    }
  }, [vertices, targetVertex]);

  const handleAddToAnswer = useCallback(() => {
    const rotation = parseInt(rotationValue);
    const position = parseInt(positionValue);
    
    if (isNaN(rotation) || isNaN(position)) return;
    if (rotation < 0 || rotation > maxRotation) return;
    
    const targetLetters = vertices[targetVertex]?.letters || "";
    if (position < 1 || position > targetLetters.length) return;

    const code = `${rotation}${position}`;
    
    if (finalAnswer === "") {
      setFinalAnswer(code);
    } else {
      setFinalAnswer(prev => `${prev}-${code}`);
    }
    
    // Update current vertex to target vertex for next encryption
    setCurrentVertex(targetVertex);
    
    // Clear inputs
    setRotationValue("");
    setPositionValue("");
  }, [rotationValue, positionValue, finalAnswer, targetVertex, vertices, maxRotation]);

  const handleClearAnswer = useCallback(() => {
    setFinalAnswer("");
    setCurrentVertex(content?.config.startingVertex || 0);
    setRotationValue("");
    setPositionValue("");
  }, [content]);

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
    const rotation = parseInt(rotationValue);
    const position = parseInt(positionValue);
    const targetLetters = vertices[targetVertex]?.letters || "";
    
    return !isNaN(rotation) && 
           !isNaN(position) && 
           rotation >= 0 && 
           rotation <= maxRotation &&
           position >= 1 && 
           position <= targetLetters.length;
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
              {/* Interactive Polygon */}
              <Card>
                <CardHeader>
                  <CardTitle>Cipher Wheel</CardTitle>
                </CardHeader>
                <CardContent>
                  <OctagonVisualization
                    vertices={vertices}
                    currentVertex={currentVertex}
                    targetVertex={targetVertex}
                    highlightedPosition={highlightedPosition}
                  />
                  <div className="mt-4 flex justify-center space-x-4">
                    <Badge variant="outline" className="bg-green-100">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Current Position
                    </Badge>
                    <Badge variant="outline" className="bg-red-100">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Target Position
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
                      Rotation (0-{maxRotation}):
                    </label>
                    <Input
                      type="text"
                      value={rotationValue}
                      onChange={(e) => handleRotationChange(e.target.value)}
                      placeholder={`Enter 0-${maxRotation}`}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Position (1-{vertices[targetVertex]?.letters.length || 0}):
                    </label>
                    <Input
                      type="text"
                      value={positionValue}
                      onChange={(e) => handlePositionChange(e.target.value)}
                      placeholder={`Enter 1-${vertices[targetVertex]?.letters.length || 0}`}
                      className="w-full"
                      disabled={!vertices[targetVertex]}
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
