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
        @keyframes pulseBlueBackground {
          0% {
            background: linear-gradient(to right, #dbeafe, #bfdbfe);
          }
          50% {
            background: linear-gradient(to right, #c7d2fe, #a5b4fc);
          }
          100% {
            background: linear-gradient(to right, #dbeafe, #bfdbfe);
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
              } border-b-4 border-blue-400 last:border-b-0 transition-all duration-300 ${
                isApplicable
                  ? 'cursor-pointer hover:scale-105'
                  : 'hover:bg-slate-100'
              }`}
              style={
                isApplicable
                  ? {
                      background: 'linear-gradient(to right, #dbeafe, #bfdbfe)',
                      animation: 'pulseBlueBackground 1.5s ease-in-out infinite'
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
              <div
                className={`p-8 flex justify-center items-center border-r-4 border-blue-400 min-h-[120px] ${
                  isApplicable
                    ? 'text-white'
                    : 'bg-gradient-to-r from-blue-50 to-blue-100'
                }`}
                style={isApplicable ? { background: 'transparent' } : undefined}
              >
                <div className="flex flex-wrap justify-center gap-3 max-w-full">
                  {rule.before.map((obj, idx) => (
                    <div key={idx}>
                      <RuleShape type={obj.type} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`p-8 flex justify-center items-center min-h-[120px] ${
                  isApplicable
                    ? 'text-white'
                    : 'bg-gradient-to-r from-blue-100 to-blue-200'
                } ${showActions ? 'border-r-4 border-blue-400' : ''}`}
                style={isApplicable ? { background: 'transparent' } : undefined}
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
