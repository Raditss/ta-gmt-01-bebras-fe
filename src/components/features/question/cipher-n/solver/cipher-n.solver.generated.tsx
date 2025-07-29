'use client';

import { useState, useEffect, useCallback } from 'react';
import { CipherNSolveModel } from '@/models/cipher-n/cipher-n.solve.model';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import { GeneratedSubmitSection } from '@/components/features/question/shared/submit-section-generated';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGeneratedQuestion } from '@/hooks/useGeneratedQuestion';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import { QuestionTypeEnum } from '@/types/question-type.type';

interface PolygonProps {
  vertices: Array<{ pos: number; letters: string }>;
  currentVertex: number;
  targetVertex: number;
  highlightedPosition: number;
}

function PolygonVisualization({
  vertices,
  currentVertex,
  targetVertex,
  highlightedPosition
}: PolygonProps) {
  const centerX = 250;
  const centerY = 250;
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
  const targetPos = getVertexPosition(targetVertex);

  return (
    <div className="flex flex-col items-center w-full">
      <svg
        viewBox="0 0 500 500"
        className="border-2 border-gray-300 rounded-lg bg-white w-full max-w-[500px] h-auto aspect-square"
      >
        {/* Draw polygon */}
        <polygon
          points={vertices
            .map((_, i) => {
              const pos = getVertexPosition(i);
              return `${pos.x},${pos.y}`;
            })
            .join(' ')}
          fill="rgba(59, 130, 246, 0.1)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />

        {/* Draw vertices and labels */}
        {vertices.map((vertex, i) => {
          const pos = getVertexPosition(i);
          const isTarget = i === targetVertex;
          const isCurrent = i === currentVertex;

          // Calculate position for the label outside the polygon
          const labelRadius = radius + 60; // 70px outside the polygon
          const angle = (i * 2 * Math.PI) / vertexCount - Math.PI / 2;
          const labelX = centerX + labelRadius * Math.cos(angle);
          const labelY = centerY + labelRadius * Math.sin(angle);

          return (
            <g key={i}>
              {/* Vertex circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="30"
                fill={
                  isTarget
                    ? 'rgb(239, 68, 68)'
                    : isCurrent
                      ? 'rgb(34, 197, 94)'
                      : 'white'
                }
                stroke={
                  isTarget
                    ? 'rgb(185, 28, 28)'
                    : isCurrent
                      ? 'rgb(21, 128, 61)'
                      : 'rgb(107, 114, 128)'
                }
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Letters - now outside the polygon */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                alignmentBaseline="middle"
                className="text-base font-bold fill-gray-700"
              >
                {vertex.letters}
              </text>

              {/* Highlight specific letter */}
              {isTarget &&
                highlightedPosition > 0 &&
                highlightedPosition <= vertex.letters.length && (
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
          x2={
            targetPos.x -
            30 *
              Math.cos(Math.atan2(targetPos.y - centerY, targetPos.x - centerX))
          }
          y2={
            targetPos.y -
            30 *
              Math.sin(Math.atan2(targetPos.y - centerY, targetPos.x - centerX))
          }
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
  // Use the generated question hook
  const { question, questionContent, loading, error, regenerate } =
    useGeneratedQuestion<CipherNSolveModel>(type, CipherNSolveModel);

  // Add breathing glow animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes breathing-glow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(147, 51, 234, 0.3), 0 0 10px rgba(147, 51, 234, 0.2);
          border-color: rgb(147, 51, 234);
        }
        50% {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6), 0 0 30px rgba(147, 51, 234, 0.4);
          border-color: rgb(168, 85, 247);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // UI state only
  const [rotationValue, setRotationValue] = useState<string>('');
  const [positionValue, setPositionValue] = useState<string>('');
  const [targetVertex, setTargetVertex] = useState<number>(0);
  const [highlightedPosition, setHighlightedPosition] = useState<number>(0);

  const content = question?.getContent();
  const vertices = content?.vertices || [];
  const maxRotation = vertices.length - 1;
  const answer = question?.getAnswer();
  const currentVertex = answer?.currentVertex || 0;
  const answerArr = answer?.encryptedMessage || [];
  const isClockwise = content?.config?.isClockwise ?? true;

  // Update target vertex when current vertex changes (e.g., after undo/clear)
  useEffect(() => {
    setTargetVertex(currentVertex);
  }, [currentVertex]);

  // Update states when rotation value changes
  useEffect(() => {
    const rotation = parseInt(rotationValue);
    if (!isNaN(rotation) && rotation >= 0 && rotation <= maxRotation) {
      let newTargetVertex: number;
      if (isClockwise) {
        newTargetVertex = (currentVertex + rotation) % vertices.length;
      } else {
        // Counterclockwise rotation
        newTargetVertex =
          (currentVertex - rotation + vertices.length) % vertices.length;
      }
      setTargetVertex(newTargetVertex);
    } else {
      setTargetVertex(currentVertex);
    }
  }, [rotationValue, currentVertex, vertices.length, maxRotation, isClockwise]);

  // Update highlighted position when position value changes
  useEffect(() => {
    const position = parseInt(positionValue);
    const targetLetters = vertices[targetVertex]?.letters || '';
    if (!isNaN(position) && position >= 1 && position <= targetLetters.length) {
      setHighlightedPosition(position);
    } else {
      setHighlightedPosition(0);
    }
  }, [positionValue, targetVertex, vertices]);

  const handleRotationChange = useCallback(
    (value: string) => {
      // Only allow numbers and validate range
      if (
        value === '' ||
        (/^\d+$/.test(value) && parseInt(value) <= maxRotation)
      ) {
        setRotationValue(value);
      }
    },
    [maxRotation]
  );

  const handlePositionChange = useCallback(
    (value: string) => {
      const targetLetters = vertices[targetVertex]?.letters || '';
      // Only allow numbers and validate range
      if (
        value === '' ||
        (/^\d+$/.test(value) &&
          parseInt(value) >= 1 &&
          parseInt(value) <= targetLetters.length)
      ) {
        setPositionValue(value);
      }
    },
    [vertices, targetVertex]
  );

  // Add to answer using model
  const handleAddToAnswer = useCallback(() => {
    if (!question) return;
    const rotation = parseInt(rotationValue);
    const position = parseInt(positionValue);

    if (isNaN(rotation) || isNaN(position)) return;
    if (rotation < 0 || rotation > maxRotation) return;

    const targetLetters = vertices[targetVertex]?.letters || '';
    if (position < 1 || position > targetLetters.length) return;

    // Use user's exact inputs instead of calculating from letter
    const result = question.encryptWithUserInputs(rotation, position);

    if (result) {
      // Update UI state to reflect the new current vertex
      const newAnswer = question.getAnswer();
      setTargetVertex(newAnswer.currentVertex);
      setHighlightedPosition(0);
    }

    // Clear inputs
    setRotationValue('');
    setPositionValue('');
  }, [
    question,
    rotationValue,
    positionValue,
    targetVertex,
    vertices,
    maxRotation
  ]);

  // Undo last step
  const handleUndo = useCallback(() => {
    if (!question) return;
    const success = question.undo();
    if (success) {
      setRotationValue('');
      setPositionValue('');
      setTargetVertex(question.getAnswer().currentVertex);
      setHighlightedPosition(0);
    }
  }, [question]);

  // Clear all (reset)
  const handleClearAnswer = useCallback(() => {
    if (!question) return;
    question.resetToInitialState();
    setRotationValue('');
    setPositionValue('');
    setTargetVertex(question.getAnswer().currentVertex);
    setHighlightedPosition(0);
  }, [question]);

  const isValidInputs = () => {
    const rotation = parseInt(rotationValue);
    const position = parseInt(positionValue);
    const targetLetters = vertices[targetVertex]?.letters || '';

    return (
      !isNaN(rotation) &&
      !isNaN(position) &&
      rotation >= 0 &&
      rotation <= maxRotation &&
      position >= 1 &&
      position <= targetLetters.length
    );
  };

  // For display: join as '23-34-45'
  const finalAnswerDisplay = answerArr.map(([r, p]) => `${r}${p}`).join('-');

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && content && (
        <>
          <div className="min-h-screen bg-gray-100 p-8">
            {/* Backstory Section */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🏛️</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-blue-800 mb-3">
                      🗺️ Sandi Poligon: Kuil Sandikala
                    </h2>
                    <p className="text-blue-700 leading-relaxed">
                      Di jantung hutan yang belum pernah dipetakan, tim arkeolog
                      internasional menemukan reruntuhan kuil kuno dari
                      Peradaban Sandikala, sebuahperadaban yang hilang ribuan
                      tahun lalu. Di dalamnya, mereka menemukan peta menuju
                      harta karun legendaris yang tersembunyi di dalam ruang
                      rahasia kuil.
                    </p>
                    <p className="text-blue-700 leading-relaxed mt-3">
                      Namun, untuk membuka gerbangnya, mereka harus
                      menyelesaikan teka-teki yang ditinggalkan para penjaga
                      kuno: sebuah <strong>Poligon Enkripsi</strong> dengan
                      delapan sisi yang bisa diputar. Hanya mereka yang tahu
                      aturan rotasi dan urutan simbol yang bisa membuka jalan
                      menuju ruang penyimpanan emas dan artefak suci.
                    </p>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                      <p className="text-blue-800 font-semibold">
                        📜 Misi Anda: Sebagai bagian dari tim ekspedisi, kamu
                        ditugaskan mengenkripsi pesan kuno{' '}
                        <strong>
                          &quot;{content.question.plaintext.toUpperCase()}&quot;
                        </strong>{' '}
                        dengan menggunakan Poligon Enkripsi. <br />
                        <br />
                        <strong>
                          <span className="text-amber-800 font-semibold">
                            Tips: untuk berinteraksi dengan Poligon Enkripsi,
                            kamu harus memasukkan nomor rotasi dan posisi di
                            kotak sebelah kanan.
                          </span>
                        </strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
              {/* Question Title */}
              {/* <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800">
                  {content.question.prompt}
                </h1>
              </div> */}

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Side - Cipher Wheel */}
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  {/* Rotation Direction Indicator */}
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-lg ${
                        isClockwise
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                          : 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mr-3 ${
                          isClockwise ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                      ></div>
                      <span className="mr-2">Arah Rotasi:</span>
                      <span className="font-bold">
                        {isClockwise
                          ? 'Searah Jarum Jam'
                          : 'Berlawanan Jarum Jam'}
                      </span>
                      {isClockwise ? (
                        <svg
                          className="w-5 h-5 ml-2 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 ml-2 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.707 8.707l3 3a1 1 0 001.414-1.414L11 10.586V7a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <PolygonVisualization
                    vertices={vertices}
                    currentVertex={currentVertex}
                    targetVertex={targetVertex}
                    highlightedPosition={highlightedPosition}
                  />
                  <div className="mt-6 flex justify-center space-x-6">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-sm px-3 py-1"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      Current Position
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-sm px-3 py-1"
                    >
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      Target Position
                    </Badge>
                  </div>
                </div>

                {/* Right Side - Encryption Controls */}
                <div className="bg-white rounded-lg p-8 shadow-sm relative">
                  {/* Help Component - Top Right */}
                  <div className="absolute top-5 right-5 z-10">
                    <DynamicHelp questionType={QuestionTypeEnum.CIPHER_N} />
                  </div>

                  <h2 className="text-2xl font-semibold mb-8 pr-12">
                    Kata yang harus anda enkripsi:
                    <br />
                    &quot;{content.question.plaintext.toUpperCase()}&quot;
                  </h2>

                  <div className="space-y-6">
                    {/* Rotation Input */}
                    <div>
                      <label className="block text-base font-medium mb-3">
                        Rotasi (0-{maxRotation}):
                      </label>
                      <Input
                        type="text"
                        value={rotationValue}
                        onChange={(e) => handleRotationChange(e.target.value)}
                        placeholder={`Masukkan 0-${maxRotation}`}
                        className="w-full text-lg py-3 px-4 border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                        style={{
                          animation: 'breathing-glow 2s ease-in-out infinite'
                        }}
                      />
                    </div>

                    {/* Position Input */}
                    <div>
                      <label className="block text-base font-medium mb-3">
                        Posisi (1-
                        {vertices[targetVertex]?.letters.length || 0}
                        ):
                      </label>
                      <Input
                        type="text"
                        value={positionValue}
                        onChange={(e) => handlePositionChange(e.target.value)}
                        placeholder={`Masukkan 1-${vertices[targetVertex]?.letters.length || 0}`}
                        className="w-full text-lg py-3 px-4 border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          animation: !vertices[targetVertex]
                            ? 'none'
                            : 'breathing-glow 2s ease-in-out infinite'
                        }}
                        disabled={!vertices[targetVertex]}
                      />
                    </div>

                    {/* Add to Final Answer Button */}
                    <Button
                      onClick={handleAddToAnswer}
                      disabled={!isValidInputs()}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-regular py-3 text-lg"
                    >
                      Tambahkan ke Jawaban Akhir
                    </Button>

                    {/* Final Answer Section */}
                    <div className="mt-8">
                      <label className="block text-base font-medium mb-3">
                        Jawaban Akhir:
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
                          Hapus
                        </Button>
                      </div>
                    </div>

                    {/* Submit Section */}
                    <GeneratedSubmitSection
                      question={question}
                      answerArr={answerArr}
                      type={type}
                      questionContent={questionContent}
                      onRegenerate={regenerate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </GeneratedSolverWrapper>
  );
}
