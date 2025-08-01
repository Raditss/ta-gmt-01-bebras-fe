'use client';

import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';
import { Rule } from '@/types/cfg.type';

interface RulesTableProps {
  rules: Rule[];
  showActions?: boolean;
  onDeleteRule?: (ruleId: string) => void;
  applicableRules?: Rule[];
  onApplyRule?: (rule: Rule) => void;
  isInteractive?: boolean;
}

export function RulesTableShared({
  rules,
  showActions = false,
  onDeleteRule,
  applicableRules = [],
  onApplyRule,
  isInteractive = false
}: RulesTableProps) {
  const RuleShape = ({ type }: { type: string }) => (
    <ShapeContainer>
      <Shape type={type} size="md" />
    </ShapeContainer>
  );

  return (
    <>
      <style jsx>{`
        @keyframes glowInward {
          0% {
            box-shadow:
              inset 0 0 30px rgba(34, 197, 94, 1),
              inset 0 0 60px rgba(34, 197, 94, 0.8),
              0 0 15px rgba(34, 197, 94, 0.5);
          }
          100% {
            box-shadow:
              inset 0 0 50px rgba(34, 197, 94, 1),
              inset 0 0 100px rgba(34, 197, 94, 0.9),
              0 0 25px rgba(34, 197, 94, 0.7);
          }
        }
      `}</style>
      <div className="bg-white rounded-lg shadow-lg overflow-visible border-4 border-blue-400">
        <div
          className={`grid ${
            showActions ? 'grid-cols-[1fr,1fr,auto]' : 'grid-cols-2'
          } border-b-4 border-blue-400`}
        >
          <div className="p-6 text-center font-bold text-lg border-r-4 border-blue-400 bg-slate-600 text-white">
            🐟 Ikan yang Ditukar
          </div>
          <div
            className={`p-6 text-center font-bold text-lg bg-slate-700 text-white ${
              showActions ? 'border-r-4 border-blue-400' : ''
            }`}
          >
            🎣 Ikan yang Diterima
          </div>
          {showActions && (
            <div className="p-6 text-center font-bold text-lg w-32 bg-red-50">
              Aksi
            </div>
          )}
        </div>

        {rules.map((rule) => {
          const isApplicable = applicableRules.some((ar) => ar.id === rule.id);
          const isClickable = isInteractive && isApplicable;

          return (
            <div
              key={rule.id}
              className={`grid ${
                showActions ? 'grid-cols-[1fr,1fr,auto]' : 'grid-cols-2'
              } border-b-4 border-blue-400 last:border-b-0 transition-all duration-500 ${
                isApplicable
                  ? 'bg-gradient-to-r from-green-300 to-green-400 ring-4 ring-green-500 ring-opacity-90 shadow-2xl cursor-pointer animate-pulse border-green-500 my-8 relative z-10'
                  : 'hover:bg-slate-500'
              }`}
              style={
                isApplicable
                  ? {
                      boxShadow:
                        '0 0 40px rgba(34, 197, 94, 1), 0 0 80px rgba(34, 197, 94, 0.8), 0 0 120px rgba(34, 197, 94, 0.6)',
                      animation:
                        'glowOutward 1.5s ease-in-out infinite alternate'
                    }
                  : undefined
              }
              onClick={() => isClickable && onApplyRule?.(rule)}
              title={
                isApplicable
                  ? 'Klik untuk menerapkan aturan perdagangan ini!'
                  : undefined
              }
            >
              <div className="p-8 flex justify-center items-center border-r-4 border-blue-400 min-h-[120px] bg-gradient-to-r from-slate-700 to-slate-800">
                <div className="flex flex-wrap justify-center gap-3 max-w-full">
                  {rule.before.map((obj, idx) => (
                    <div key={idx}>
                      <RuleShape type={obj.type} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`p-8 flex justify-center items-center min-h-[120px] bg-gradient-to-r from-slate-800 to-slate-900 ${
                  showActions ? 'border-r-4 border-blue-400' : ''
                }`}
              >
                <div className="flex flex-wrap justify-center gap-3 max-w-full">
                  {rule.after.map((obj, idx) => (
                    <div key={idx}>
                      <RuleShape type={obj.type} />
                    </div>
                  ))}
                </div>
              </div>
              {showActions && (
                <div className="p-8 flex justify-center items-center w-32 min-h-[120px]">
                  <button
                    onClick={() => onDeleteRule?.(rule.id)}
                    className="text-red-500 hover:text-red-700 p-3 rounded-full hover:bg-red-100 transition-colors"
                    title="Hapus aturan perdagangan"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes glowOutward {
          0% {
            box-shadow:
              0 0 20px rgba(34, 197, 94, 0.7),
              0 0 40px rgba(34, 197, 94, 0.5),
              0 0 60px rgba(34, 197, 94, 0.3);
          }
          100% {
            box-shadow:
              0 0 40px rgba(34, 197, 94, 1),
              0 0 80px rgba(34, 197, 94, 0.8),
              0 0 120px rgba(34, 197, 94, 0.6);
          }
        }
      `}</style>
    </>
  );
}
