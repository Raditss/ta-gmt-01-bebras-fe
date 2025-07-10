"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CipherNSolveModel } from '@/models/cipher-n/cipher-n.solve.model';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { GeneratedSolverProps, GeneratedSolverWrapper } from '@/components/features/bases/base.solver.generated';
import { SubmissionModalSolver, SubmissionResult } from '@/components/features/question/submission-modal.solver';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';

interface PolygonProps {
  vertices: Array<{ pos: number; letters: string }>;
  currentVertex: number;
  targetVertex: number;
  highlightedPosition: number;
}

function PolygonVisualization({ vertices, currentVertex, targetVertex, highlightedPosition }: PolygonProps) {
  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  const vertexCount = vertices.length;

  // Calculate positions for vertices in a regular polygon
  const getVertexPosition = (index: number) => {
    const angle = (index * 2 * Math.PI) / vertexCount - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Calculate arrow position
  const currentPos = getVertexPosition(currentVertex);

  return (
    <div className="flex flex-col items-center">
      <svg width="400" height="400" className="border-2 border-gray-300 rounded-lg bg-white">
        {/* Draw polygon */}
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

export default function GeneratedCipherNSolver({ type }: GeneratedSolverProps) {
  const router = useRouter();
  
  // Use the generated question hook
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<CipherNSolveModel>(type, CipherNSolveModel);

  // UI state only
  const [rotationValue, setRotationValue] = useState<string>("");
  const [positionValue, setPositionValue] = useState<string>("");
  const [targetVertex, setTargetVertex] = useState<number>(0);
  const [highlightedPosition, setHighlightedPosition] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const content = question?.getContent();
  const vertices = content?.vertices || [];
  const maxRotation = vertices.length - 1;
  const answer = question?.getAnswer();
  const currentVertex = answer?.currentVertex || 0;
  const answerArr = answer?.encryptedMessage || [];

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

  // Add to answer using model
  const handleAddToAnswer = useCallback(() => {
    if (!question) return;
    const rotation = parseInt(rotationValue);
    const position = parseInt(positionValue);
    
    if (isNaN(rotation) || isNaN(position)) return;
    if (rotation < 0 || rotation > maxRotation) return;
    
    const targetLetters = vertices[targetVertex]?.letters || "";
    if (position < 1 || position > targetLetters.length) return;

    // Use user's exact inputs instead of calculating from letter
    question.encryptWithUserInputs(rotation, position);
    
    // Clear inputs
    setRotationValue("");
    setPositionValue("");
  }, [question, rotationValue, positionValue, targetVertex, vertices, maxRotation]);

  // Undo last step
  const handleUndo = useCallback(() => {
    if (!question) return;
    question.undo();
    setRotationValue("");
    setPositionValue("");
  }, [question]);

  // Clear all (reset)
  const handleClearAnswer = useCallback(() => {
    if (!question) return;
    question.resetToInitialState();
    setRotationValue("");
    setPositionValue("");
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

  // For display: join as '23-34-45'
  const finalAnswerDisplay = answerArr.map(([r, p]) => `${r}${p}`).join("-");

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
              {/* Interactive Polygon */}
              <Card>
                <CardHeader>
                  <CardTitle>Cipher Wheel</CardTitle>
                </CardHeader>
                <CardContent>
                  <PolygonVisualization
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
