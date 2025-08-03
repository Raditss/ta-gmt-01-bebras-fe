import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';

export interface SubmissionResult {
  isCorrect: boolean;
  points?: number;
  basePoints?: number;
  timeBonus?: number;
  scoringDetails?: {
    explanation: string;
    timeBonus: number;
  };
}

interface SubmissionModalProps {
  isOpen: boolean;
  isConfirming: boolean;
  result: SubmissionResult | null;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

function AnimatedScoreCalculation({ result }: { result: SubmissionResult }) {
  const [displayedBasePoints, setDisplayedBasePoints] = useState(0);
  const [displayedTimeBonus, setDisplayedTimeBonus] = useState(0);
  const [displayedTotalPoints, setDisplayedTotalPoints] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  // Extract base points from scoring details or use default
  const basePoints =
    result.basePoints ||
    (result.scoringDetails?.explanation?.includes('Base points:')
      ? parseInt(
          result.scoringDetails.explanation.match(/Base points: (\d+)/)?.[1] ||
            '100'
        )
      : 100);
  const timeBonus = result.scoringDetails?.timeBonus || 0;
  const totalPoints = result.points || basePoints;

  // Calculate the multiplier (timeBonus is the additional multiplier, so we add 1)
  const speedMultiplier = 1 + timeBonus;

  useEffect(() => {
    if (!result.isCorrect) return;

    const timer = setTimeout(() => {
      // Step 1: Animate base points
      setCurrentStep(1);
      animateValue(setDisplayedBasePoints, 0, basePoints, 1000);

      // Step 2: Animate time bonus after base points
      setTimeout(() => {
        setCurrentStep(2);
        animateValue(setDisplayedTimeBonus, 0, speedMultiplier, 800, true);

        // Step 3: Animate total points after time bonus
        setTimeout(() => {
          setCurrentStep(3);
          animateValue(setDisplayedTotalPoints, 0, totalPoints, 1200);
        }, 1000);
      }, 1200);
    }, 500);

    return () => clearTimeout(timer);
  }, [result, basePoints, timeBonus, totalPoints]);

  const animateValue = (
    setter: (value: number) => void,
    start: number,
    end: number,
    duration: number,
    isDecimal: boolean = false
  ) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = start + (end - start) * easeOutQuart;

      setter(
        isDecimal ? Number(currentValue.toFixed(2)) : Math.round(currentValue)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  if (!result.isCorrect) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Jawaban Belum Tepat
          </h3>
          <p className="text-sm text-gray-600">
            Jangan khawatir, ini adalah bagian dari proses belajar!
          </p>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 text-xl">💡</div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">
                Tips untuk Mencoba Lagi:
              </h4>
              <ul className="text-sm text-red-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Periksa kembali aturan dan petunjuk soal</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Pastikan setiap langkah sudah benar</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Gunakan fitur bantuan jika diperlukan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-red-500">•</span>
                  <span>Jangan ragu untuk mencoba pendekatan berbeda</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-blue-500 text-xl">🎯</div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Tetap semangat! Setiap kesalahan adalah kesempatan untuk
                belajar.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-green-600 mb-2">
          🎉 Selamat! Anda berhasil menyelesaikan soal dengan benar!
        </h3>
        <p className="text-sm text-gray-600">
          Beginilah perhitungan poin Anda:
        </p>
      </div>

      <div className="space-y-4">
        {/* Base Points */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-500 ${
            currentStep >= 1
              ? 'border-blue-200 bg-blue-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Base Points</p>
              <p className="text-xs text-gray-500">
                Poin dasar dari jawaban yang benar
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold transition-all duration-300 ${
                  currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {displayedBasePoints}
              </p>
            </div>
          </div>
        </div>

        {/* Time Bonus */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-500 ${
            currentStep >= 2
              ? 'border-green-200 bg-green-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Speed Bonus</p>
              <p className="text-xs text-gray-500">
                {timeBonus > 0
                  ? 'Lebih cepat dari waktu ekspektasi'
                  : 'Melebihi waktu ekspektasi'}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold transition-all duration-300 ${
                  currentStep >= 2 ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                +{displayedTimeBonus.toFixed(2)}x
              </p>
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-500 ${
            currentStep >= 3
              ? 'border-purple-200 bg-purple-50'
              : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-xs text-gray-500">Final score</p>
            </div>
            <div className="text-right">
              <p
                className={`text-3xl font-bold transition-all duration-300 ${
                  currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'
                }`}
              >
                {displayedTotalPoints}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      {/* {result.scoringDetails?.explanation && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600">
            {result.scoringDetails.explanation}
          </p>
        </div>
      )} */}
    </div>
  );
}

export function SubmissionModalSolver({
  isOpen,
  isConfirming,
  result,
  onConfirm,
  onCancel,
  onClose
}: SubmissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {isConfirming ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pengiriman</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your answer? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onConfirm}>Kirim</Button>
          </DialogFooter>
        </DialogContent>
      ) : result ? (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle
              className={result.isCorrect ? 'text-green-600' : 'text-red-600'}
            >
              {result.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
            </DialogTitle>
          </DialogHeader>

          {result.points !== undefined ? (
            <AnimatedScoreCalculation result={result} />
          ) : (
            <div className="text-center">
              <p className="text-lg">
                {result.isCorrect
                  ? 'Great job! You solved the problem correctly.'
                  : 'Not quite right. Try reviewing the rules and try again.'}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={onClose}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
