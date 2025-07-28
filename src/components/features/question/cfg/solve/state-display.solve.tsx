'use client';

import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';
import { State } from '@/types/cfg.type';

interface StateDisplayProps {
  title: string;
  state: State[];
  isInteractive?: boolean;
  selectedIndices?: number[];
  onObjectClick?: (index: number) => void;
  containerClassName?: string;
}

export function StateDisplaySolve({
  title,
  state,
  isInteractive = false,
  selectedIndices = [],
  onObjectClick,
  containerClassName = ''
}: StateDisplayProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <div
        className={`p-6 rounded-lg shadow-md min-h-32 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 ${containerClassName}`}
      >
        <div className="flex flex-wrap justify-center gap-3 max-w-full">
          {state.map((obj, idx) => (
            <ShapeContainer
              key={idx}
              interactive={isInteractive}
              className={`
                transition-all duration-300 
                ${selectedIndices.includes(idx) ? 'transform scale-110' : ''}
                ${isInteractive ? 'hover:scale-105 hover:shadow-md' : ''}
              `}
              onClick={() => isInteractive && onObjectClick?.(idx)}
            >
              <Shape
                type={obj.type}
                size="md"
                interactive={isInteractive}
                selected={selectedIndices.includes(idx)}
                isFloating={selectedIndices.includes(idx)}
              />
            </ShapeContainer>
          ))}
          {state.length === 0 && (
            <div className="text-slate-300 text-lg italic">Tidak ada ikan</div>
          )}
        </div>
      </div>
    </div>
  );
}
