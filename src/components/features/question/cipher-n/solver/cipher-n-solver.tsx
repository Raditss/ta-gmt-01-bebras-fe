"use client"

import { useState, useEffect, useCallback } from 'react';
import { CipherNSolveModel } from '@/models/cipher-n/cipher-n.solve.model';
import { BaseSolverProps, SolverWrapper } from '@/components/features/bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { TimeProgressBar } from '@/components/ui/time-progress-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';

interface PolygonProps {
  vertices: Array<{ pos: number; letters: string }>;
  currentVertex: number;
  targetVertex: number;
  highlightedPosition: number;
}

function OctagonVisualization({ vertices, currentVertex, targetVertex, highlightedPosition }: PolygonProps) {
  const centerX = 250;
  const centerY = 250;
  const radius = 150;
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
    <div className="flex flex-col items-center w-full">
      <svg 
        viewBox="0 0 500 500" 
        className="border-2 border-gray-300 rounded-lg bg-white w-full max-w-[500px] h-auto aspect-square"
      >
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
                r="30"
                fill={isTarget ? "rgb(239, 68, 68)" : isCurrent ? "rgb(34, 197, 94)" : "white"}
                stroke={isTarget ? "rgb(185, 28, 28)" : isCurrent ? "rgb(21, 128, 61)" : "rgb(107, 114, 128)"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
              
              {/* Letters */}
              <text
                x={pos.x}
                y={pos.y - 40}
                textAnchor="middle"
                className="text-base font-bold fill-gray-700"
              >
                {vertex.letters}
              </text>
              
              {/* Highlight specific letter */}
              {isTarget && highlightedPosition > 0 && highlightedPosition <= vertex.letters.length && (
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  className="text-xl font-bold fill-white"
                >
                  {vertex.letters[highlightedPosition - 1]}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Arrow from center to target vertex */}
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
          x2={targetPos.x - 30 * Math.cos(Math.atan2(targetPos.y - centerY, targetPos.x - centerX))}
          y2={targetPos.y - 30 * Math.sin(Math.atan2(targetPos.y - centerY, targetPos.x - centerX))}
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

export default function CipherNSolver({ questionId }: BaseSolverProps) {
  const { question, loading, error, currentDuration } = useSolveQuestion<CipherNSolveModel>(
    questionId,
    CipherNSolveModel
  );
  const { formattedDuration, getCurrentDuration } = useDuration(currentDuration());

  // UI state only
  const [rotationValue, setRotationValue] = useState<string>("");
  const [positionValue, setPositionValue] = useState<string>("");
  const [targetVertex, setTargetVertex] = useState<number>(0);
  const [highlightedPosition, setHighlightedPosition] = useState<number>(0);

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

  // For display: join as '23-34-45'
  const finalAnswerDisplay = answerArr.map(([r, p]) => `${r}${p}`).join("-");

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
              {/* Left Side - Cipher Wheel */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <OctagonVisualization
                  vertices={vertices}
                  currentVertex={currentVertex}
                  targetVertex={targetVertex}
                  highlightedPosition={highlightedPosition}
                />
                <div className="mt-6 flex justify-center space-x-6">
                  <Badge variant="outline" className="bg-green-100 text-sm px-3 py-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Current Position
                  </Badge>
                  <Badge variant="outline" className="bg-red-100 text-sm px-3 py-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Target Position
                  </Badge>
                </div>
              </div>

              {/* Right Side - Encryption Controls */}
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-8">Encryption Controls</h2>
                
                <div className="space-y-6">
                  {/* Rotation Input */}
                  <div>
                    <label className="block text-base font-medium mb-3">
                      Rotation (0-{maxRotation}):
                    </label>
                    <Input
                      type="text"
                      value={rotationValue}
                      onChange={(e) => handleRotationChange(e.target.value)}
                      placeholder={`Enter 0-${maxRotation}`}
                      className="w-full text-lg py-3 px-4"
                    />
                  </div>
                  
                  {/* Position Input */}
                  <div>
                    <label className="block text-base font-medium mb-3">
                      Position (1-{vertices[targetVertex]?.letters.length || 0}):
                    </label>
                    <Input
                      type="text"
                      value={positionValue}
                      onChange={(e) => handlePositionChange(e.target.value)}
                      placeholder={`Enter 0-${vertices[targetVertex]?.letters.length || 0}`}
                      className="w-full text-lg py-3 px-4"
                      disabled={!vertices[targetVertex]}
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
                    <label className="block text-base font-medium mb-3">Final Answer:</label>
                    <div className="p-6 bg-gray-50 rounded-lg border min-h-[100px] font-mono text-xl">
                      {finalAnswerDisplay || ""}
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
