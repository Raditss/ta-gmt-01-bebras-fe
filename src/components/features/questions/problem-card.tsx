import { QuestionTypeEnum } from '@/types/question-type.type';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

interface ProblemCardProps {
  id: string;
  title: string;
  author: string;
  type: QuestionTypeEnum;
  isSolved?: boolean;
}

const typeGradientMap: Record<QuestionTypeEnum, string> = {
  [QuestionTypeEnum.CFG]: 'from-pink-500 to-pink-300',
  [QuestionTypeEnum.CIPHER_N]: 'from-green-500 to-green-300',
  [QuestionTypeEnum.RING_CIPHER]: 'from-purple-500 to-purple-300',
  [QuestionTypeEnum.ANOMALY_MONSTER]: 'from-blue-500 to-blue-300',
  [QuestionTypeEnum.DECISION_TREE_TRACE]: 'from-orange-500 to-orange-300',
  [QuestionTypeEnum.CONTAGION_PROTOCOL]: 'from-red-500 to-yellow-300'
};

export function ProblemCard({
  id,
  title,
  author,
  type,
  isSolved = false
}: ProblemCardProps) {
  const bgGradient =
    typeGradientMap[type as QuestionTypeEnum] || 'from-gray-200 to-gray-100';

  // Truncate helpers
  const truncateWithHyphen = (str: string, max: number) => {
    if (str.length <= max) return str;
    // If the cut is in the middle of a word, add a hard hyphen
    const cut = str.slice(0, max);
    if (/\w$/.test(cut) && /\w/.test(str[max])) {
      return cut + '-';
    }
    return cut + '…';
  };
  const maxTitleLength = 40;
  const maxAuthorLength = 20;

  return (
    <div
      className={`rounded-2xl shadow-2xl shadow-black/30 p-6 flex flex-col justify-between min-h-[280px] bg-gradient-to-br ${bgGradient} relative ${
        isSolved ? 'opacity-50' : ''
      }`}
    >
      {/* Solved indicator */}
      {isSolved && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-green-600 rounded-full p-2 shadow-lg border border-white/50">
          <CheckCircle className="w-5 h-5" />
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        <span className="px-3 py-1 self-start rounded-full bg-white/30 text-xs font-semibold text-white border border-white/40 backdrop-blur-sm">
          {type ? type.replace(/_/g, ' ') : 'unknown'}
        </span>
        <h2 className="text-2xl font-bold text-white drop-shadow-md break-all hyphens-auto">
          {truncateWithHyphen(title, maxTitleLength)}
        </h2>
        <p className="text-white/80 text-sm break-all hyphens-auto">
          By {truncateWithHyphen(author, maxAuthorLength)}
        </p>
      </div>
      <div className="flex-1" />
      <Link
        href={`/problems/${id}`}
        className="mt-auto bg-white text-black font-bold py-2 px-6 rounded-full text-center shadow hover:bg-gray-100 transition"
      >
        {isSolved ? 'View Solution' : 'View Problem'}
      </Link>
    </div>
  );
}
