import {
  Monster,
  MonsterAnswer
} from '@/models/contagion-protocol/contagion-protocol.model.type';
import { useCallback, useState } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import { questionAttemptApi } from '@/lib/api/question-attempt.api';
import { QuestionTypeEnum } from '@/types/question-type.type';

interface QuestionModel {
  toJSON: () => unknown;
}

interface EmergencyActionButtonProps {
  question: QuestionModel; // The question model instance
  type: string;
  questionContent: string;
  onExecute: (isCorrect: boolean) => void;
  monstersQuestion: Monster[];
  monstersAnswer: MonsterAnswer[];
}

const GeneratedContagionProtocolSubmitButton = ({
  question,
  type,
  questionContent,
  onExecute,
  monstersQuestion,
  monstersAnswer
}: EmergencyActionButtonProps) => {
  const [isArmed, setIsArmed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Check if all specimens are classified
  const totalSpecimens = monstersQuestion.length;
  const classifiedSpecimens = monstersAnswer.length;
  const allClassified =
    totalSpecimens > 0 && classifiedSpecimens === totalSpecimens;
  const unclassifiedCount = totalSpecimens - classifiedSpecimens;

  const handleArm = useCallback(async () => {
    if (!allClassified) return; // Prevent action if not all classified

    if (!isArmed) {
      setIsArmed(true);
    } else if (!isCountingDown) {
      const response = await questionAttemptApi.checkGeneratedAnswer({
        type: type as QuestionTypeEnum,
        questionContent,
        answer: JSON.stringify(question.toJSON())
      });

      // Start countdown
      setIsCountingDown(true);
      let count = 3;
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          onExecute(response.isCorrect ?? false);
          setIsArmed(false);
          setIsCountingDown(false);
          setCountdown(3);
        }
      }, 1000);
    }
  }, [
    allClassified,
    isArmed,
    isCountingDown,
    onExecute,
    question,
    questionContent,
    type
  ]);

  const handleDisarm = () => {
    setIsArmed(false);
    setIsCountingDown(false);
    setCountdown(5);
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
          ) : !isCountingDown ? (
            <p className="font-mono text-sm text-yellow-400 animate-pulse">
              ⚠️ SISTEM SIAP — Klik lagi untuk menjalankan protokol
            </p>
          ) : (
            <p className="font-mono text-lg text-red-400 font-bold animate-pulse">
              🚨 PROTOKOL BERJALAN DALAM {countdown} DETIK 🚨
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleArm}
            disabled={!allClassified || isCountingDown}
            className={`
              relative px-8 py-4 rounded-lg font-mono font-bold text-lg
              transition-all duration-200 transform
              ${
                !allClassified
                  ? 'bg-slate-700 text-slate-500 border-2 border-slate-600 cursor-not-allowed opacity-50'
                  : !isArmed
                    ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-red-500 hover:scale-105'
                    : isCountingDown
                      ? 'bg-red-700 text-red-200 border-2 border-red-400 animate-pulse cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-400 text-white border-2 border-red-300 shadow-lg shadow-red-500/50 animate-pulse'
              }
              ${isCountingDown ? 'scale-110' : ''}
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
                    : isCountingDown
                      ? `EXECUTING... ${countdown}`
                      : 'EXECUTE PROTOCOL'}
              </span>
              <Zap className="w-5 h-5" />
            </div>
          </button>

          {isArmed && !isCountingDown && allClassified && (
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
    </div>
  );
};

export default GeneratedContagionProtocolSubmitButton;
