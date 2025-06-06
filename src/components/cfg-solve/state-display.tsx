import { State } from "@/model/cfg/create-question/model";

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
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${
                isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
              } ${selectedIndices.includes(idx) ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => isInteractive && onObjectClick?.(idx)}
            >
              {obj.type === 'circle' ? (
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              ) : obj.type === 'triangle' ? (
                <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
              ) : obj.type === 'square' ? (
                <div className="w-10 h-10 bg-gray-300"></div>
              ) : obj.type === 'star' ? (
                <div className="w-10 h-10 bg-gray-300 clip-star"></div>
              ) : (
                <div className="w-10 h-10 bg-gray-300 clip-hexagon"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 