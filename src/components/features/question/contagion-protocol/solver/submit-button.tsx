import {
  Monster,
  MonsterAnswer
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { useCallback, useState } from 'react';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { AlertTriangle, Zap } from 'lucide-react';
import ContagionProtocolResultDialog from '@/components/features/question/contagion-protocol/solver/ContagionProtocolResultDialog';
import { useRouter } from 'next/navigation';

export interface SubmissionResult {
  isCorrect: boolean;
  points: number;
  streak: number;
  timeTaken: number;
  scoringDetails?: {
    explanation: string;
    timeBonus: number;
    newTotalScore: number;
    questionsCompleted: number;
  };
}

interface QuestionModel {
  setAttemptData: (duration: number, isDraft: boolean) => void;
  getAttemptData: () => {
    questionId: number;
    duration: number;
    isDraft: boolean;
    answer: string;
  };
}

interface ContagionProtocolSubmitButtonProps {
  question: QuestionModel;
  getCurrentDuration: () => number;
  monstersQuestion: Monster[];
  monstersAnswer: MonsterAnswer[];
}

const ContagionProtocolSubmitButton = ({
  question,
  getCurrentDuration,
  monstersQuestion,
  monstersAnswer
}: ContagionProtocolSubmitButtonProps) => {
  const router = useRouter();
  const [isArmed, setIsArmed] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const totalSpecimens = monstersQuestion.length;
  const classifiedSpecimens = monstersAnswer.length;
  const allClassified =
    totalSpecimens > 0 && classifiedSpecimens === totalSpecimens;
  const unclassifiedCount = totalSpecimens - classifiedSpecimens;

  const handleArm = useCallback(async () => {
    if (!allClassified) return; // Prevent action if not all classified

    if (!isArmed) {
      setIsArmed(true);
    } else {
      const duration = getCurrentDuration();
      question.setAttemptData(duration, false);
      const attemptData = question.getAttemptData();
      const response = await questionAttemptApi.submit({
        questionId: attemptData.questionId,
        duration: attemptData.duration,
        answer: JSON.parse(attemptData.answer)
      });

      // Take the answer from the response
      const isCorrect = response.isCorrect;
      const points = response.points;
      const scoringDetails = response.scoringDetails;

      const streak = isCorrect ? 1 : 0;

      setSubmissionResult({
        isCorrect,
        points,
        streak,
        timeTaken: duration,
        scoringDetails
      });
      setIsSubmit(true);
      setIsResultDialogOpen(true);
    }
  }, [allClassified, getCurrentDuration, question, isArmed]);

  const handleDisarm = () => {
    setIsArmed(false);
    setIsSubmit(false);
  };

  const panelGlow = allClassified
    ? 'shadow-[0_0_20px_5px_rgba(255,0,80,0.5)] animate-[pulse_2s_ease-in-out_infinite]'
    : '';

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div
        className={`bg-red-950/30 border-2 border-red-500/50 rounded-xl p-6 backdrop-blur-sm ${panelGlow}`}
      >
        {/* Warning Header */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            <span className="font-mono text-lg font-bold text-red-400 tracking-wider">
              TOMBOL DARURAT
            </span>
            <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Status Display */}
        <div className="text-center mb-6">
          {!allClassified ? (
            <div>
              <p className="font-mono text-sm text-red-400 animate-pulse mb-2">
                ⚠️ KLASIFIKASI BELUM SELESAI
              </p>
              <p className="font-mono text-xs text-slate-400">
                Masih ada {unclassifiedCount} monster yang belum dianalisis
              </p>
            </div>
          ) : !isArmed ? (
            <p className="font-mono text-sm text-green-400">
              ✅ Semua monster sudah diklasifikasi — Protokol siap dijalankan
            </p>
          ) : !isSubmit ? (
            <p className="font-mono text-sm text-yellow-400 animate-pulse">
              ⚠️ SISTEM SIAP — Klik lagi untuk menjalankan protokol
            </p>
          ) : (
            <p className="font-mono text-lg text-red-400 font-bold animate-pulse">
              🚨 PROTOKOL SEDANG BERJALAN... 🚨
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleArm}
            disabled={!allClassified}
            className={`
              relative px-8 py-4 rounded-lg font-mono font-bold text-lg
              transition-all duration-200 transform
              ${
                !allClassified
                  ? 'bg-slate-700 text-slate-500 border-2 border-slate-600 cursor-not-allowed opacity-50'
                  : 'bg-red-500 hover:bg-red-400 text-white border-2 border-red-300 shadow-lg shadow-red-500/50 animate-pulse'
              }
            `}
          >
            {/* Button glow effect - only when enabled */}
            {allClassified && (
              <div className="absolute inset-0 rounded-lg bg-red-400/20 blur-sm animate-pulse" />
            )}

            <div className="relative flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>
                {!allClassified
                  ? 'CLASSIFICATION REQUIRED'
                  : !isArmed
                    ? 'INITIATE CONTAINMENT'
                    : 'EXECUTE PROTOCOL'}
              </span>
              <Zap className="w-5 h-5" />
            </div>
          </button>

          {isArmed && !isSubmit && allClassified && (
            <button
              onClick={handleDisarm}
              className="px-6 py-4 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-mono border-2 border-slate-500 transition-all duration-200"
            >
              BATALKAN
            </button>
          )}
        </div>

        {/* Warning Text */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded border border-slate-700">
          <p className="text-xs font-mono text-slate-400 text-center">
            {!allClassified ? (
              <>
                PROTOKOL TERKUNCI: Lengkapi analisis semua monster sebelum
                melanjutkan.
                <br />
                Tersisa {unclassifiedCount} monster yang belum dianalisis
              </>
            ) : (
              <>
                PERINGATAN: Tombol ini akan menjalankan protokol penanganan
                untuk semua monster yang sudah dianalisis.
                <br />
                Pastikan semua sudah benar. Tindakan ini tidak bisa dibatalkan.
              </>
            )}
          </p>
        </div>
      </div>
      <ContagionProtocolResultDialog
        isOpen={isResultDialogOpen}
        onClose={() => {
          router.push('/problems');
        }}
        submissionResult={submissionResult}
      />
    </div>
  );
};

export default ContagionProtocolSubmitButton;
