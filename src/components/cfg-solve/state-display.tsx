"use client"

import { State } from "@/model/cfg/create-question/model";
import { Shape, ShapeContainer } from '@/components/shared/shape';

interface StateDisplayProps {
  title: string;
  state: State[];
  isInteractive?: boolean;
  selectedIndices?: number[];
  onObjectClick?: (index: number) => void;
  containerClassName?: string;
}

export function StateDisplay({ 
  title, 
  state, 
  isInteractive = false, 
  selectedIndices = [], 
  onObjectClick,
  containerClassName = ''
}: StateDisplayProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className={`p-4 rounded-md shadow-md min-h-32 flex items-center justify-center ${containerClassName}`}>
        <div className="flex flex-wrap justify-center gap-2 max-w-full">
          {state.map((obj, idx) => (
            <ShapeContainer
              key={idx}
              interactive={isInteractive}
              className={selectedIndices.includes(idx) ? 'ring-2 ring-blue-500' : ''}
              onClick={() => isInteractive && onObjectClick?.(idx)}
            >
              <Shape 
                type={obj.type}
                size="md"
                interactive={isInteractive}
                selected={selectedIndices.includes(idx)}
              />
            </ShapeContainer>
          ))}
        </div>
      </div>
    </div>
  );
} 