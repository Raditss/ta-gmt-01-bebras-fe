'use client';

import { useState, useEffect, useCallback } from 'react';
import { RingCipherSolveModel } from '@/models/ring-cipher/ring-cipher.solve.model';
import {
  BaseSolverProps,
  SolverWrapper
} from '@/components/features/bases/base.solver';
import { useDuration } from '@/hooks/useDuration';
import { SubmitSection } from '@/components/features/question/shared/submit-section';
import { TimeProgressBar } from '@/components/features/question/shared/time-progress-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSolveQuestion } from '@/hooks/useSolveQuestion';
import { DynamicHelp } from '@/components/features/question/shared/dynamic-help';
import { QuestionTypeEnum } from '@/types/question-type.type';

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
  // Increased spacing for better visibility with multiple rings
  const maxRadius = 220; // Increased from 200
  const minRadius = 60; // Reduced from 75 to start closer to center
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
            let radiusStep;
            let radius;

            if (rings.length === 2) {
              // For 2 rings, give more space to the first ring
              radiusStep = (maxRadius - minRadius) / 2;
              if (ringIndex === 0) {
                // First ring gets more space
                radius = minRadius + radiusStep * 0.3;
              } else {
                // Second ring gets the full space
                radius = minRadius + radiusStep * 1.7;
              }
            } else {
              // Original logic for 3+ rings
              radiusStep =
                (maxRadius - minRadius) / Math.max(rings.length - 1, 1);
              radius = minRadius + radiusStep * ringIndex;
            }
            const isHighlighted = ringIndex === highlightedRing;
            const currentPosition = ringPositions[ringIndex] || 0;
            const angleStep = (2 * Math.PI) / ring.letters.length;
            const rotationAngle =
              -(currentPosition * angleStep * 180) / Math.PI; // positive for counter-clockwise
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
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transformOrigin: `${centerX}px ${centerY}px`
                  }}
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
                          y={y + 5}
                          textAnchor="middle"
                          className={`text-sm font-bold transition-all duration-300 ${
                            isTargetLetter
                              ? 'fill-black'
                              : isAtMarker
                                ? 'fill-orange-700'
                                : 'fill-gray-700'
                          }`}
                          transform={`rotate(${-rotationAngle} ${x} ${y})`}
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
  const {
    question,
    questionMetadata,
    loading,
    error,
    currentDuration,
    markAsSubmitted
  } = useSolveQuestion<RingCipherSolveModel>(questionId, RingCipherSolveModel);
  const { formattedDuration, getCurrentDuration } =
    useDuration(currentDuration());

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
        <>
          <div className="min-h-screen bg-gray-100 p-8">
            {/* Time Progress Bar */}
            <div className="max-w-7xl mx-auto mb-8">
              {questionMetadata && (
                <TimeProgressBar
                  currentDuration={currentDuration()}
                  estimatedTime={questionMetadata.estimatedTime}
                  formattedDuration={formattedDuration}
                />
              )}
            </div>

            {/* Backstory Section */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🏛️</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-amber-800 mb-3">
                      🗺️ Sandi cincin: Kuil Sandikala
                    </h2>
                    <p className="text-amber-700 leading-relaxed">
                      Di jantung hutan yang belum pernah dipetakan, tim arkeolog
                      internasional menemukan reruntuhan kuil kuno dari
                      Peradaban Sandikala, sebuah peradaban yang hilang ribuan
                      tahun lalu. Di dalamnya, mereka menemukan peta menuju
                      harta karun legendaris yang tersembunyi di dalam ruang
                      rahasia kuil.
                    </p>
                    <p className="text-amber-700 leading-relaxed mt-3">
                      Namun, untuk membuka gerbangnya, mereka harus
                      menyelesaikan teka-teki yang ditinggalkan para penjaga
                      kuno: sebuah <strong>cincin enkripsi</strong> dengan
                      cincin-cincin melingkar yang bisa diputar. Hanya mereka
                      yang tahu aturan rotasi dan urutan simbol yang bisa
                      membuka jalan menuju ruang penyimpanan emas dan artefak
                      suci.
                    </p>
                    <div className="mt-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                      <p className="text-amber-800 font-semibold">
                        📜 Misi Anda: Sebagai bagian dari tim ekspedisi, kamu
                        ditugaskan mengenkripsi pesan kuno{' '}
                        <strong>
                          &quot;{content.question.plaintext.toUpperCase()}&quot;
                        </strong>{' '}
                        dengan menggunakan Cincin Enkripsi. Hasil enkripsi suatu
                        huruf adalah 2 buah angka XY, X adalah nomor ring dan Y
                        adalah jumlah langkah rotasi. <br />
                        <br />
                        <strong>
                          <span className="text-amber-800 font-semibold">
                            Tips: untuk berinteraksi dengan Cincin Enkripsi,
                            kamu harus memasukkan nomor ring dan langkah rotasi
                            di kotak sebelah kanan.
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
                <div className="bg-white rounded-lg p-8 shadow-sm relative">
                  {/* Help Component - Top Right */}
                  <div className="absolute top-5 right-5 z-10">
                    <DynamicHelp questionType={QuestionTypeEnum.RING_CIPHER} />
                  </div>

                  <h2 className="text-2xl font-semibold mb-8 pr-12">
                    Kata yang harus anda enkripsi:
                    <br />
                    &quot;{content.question.plaintext.toUpperCase()}&quot;
                  </h2>

                  <div className="space-y-6">
                    {/* Ring Input */}
                    <div>
                      <label className="block text-base font-medium mb-3">
                        Nomor Ring (1-{rings.length}):
                      </label>
                      <Input
                        type="text"
                        value={ringValue}
                        onChange={(e) => handleRingChange(e.target.value)}
                        placeholder={`Masukkan 1-${rings.length}`}
                        className="w-full text-lg py-3 px-4 border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl"
                        style={{
                          animation: 'breathing-glow 2s ease-in-out infinite'
                        }}
                      />
                    </div>

                    {/* Steps Input */}
                    <div>
                      <label className="block text-base font-medium mb-3">
                        Langkah Rotasi (0-
                        {rings[parseInt(ringValue) - 1]?.letters.length - 1 ||
                          0}
                        ):
                      </label>
                      <Input
                        type="text"
                        value={stepsValue}
                        onChange={(e) => handleStepsChange(e.target.value)}
                        placeholder={`Masukkan 0-${rings[parseInt(ringValue) - 1]?.letters.length - 1 || 0}`}
                        className="w-full text-lg py-3 px-3 px-4 border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          animation: !rings[parseInt(ringValue) - 1]
                            ? 'none'
                            : 'breathing-glow 2s ease-in-out infinite'
                        }}
                        disabled={!rings[parseInt(ringValue) - 1]}
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
                    <SubmitSection
                      question={question}
                      getCurrentDuration={getCurrentDuration}
                      answerArr={answerArr}
                      isDisabled={false}
                      onSubmissionSuccess={markAsSubmitted}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </SolverWrapper>
  );
}
