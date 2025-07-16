import { MonsterPartOptionType } from '@/components/features/question/anomaly-monster/monster-part.type';
import {} from '@/components/ui/tooltip';
import Image from 'next/image';

export interface MonsterPartOptionProps {
  option: MonsterPartOptionType;
  selected: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export default function MonsterPartOption({
  option,
  selected,
  onMouseEnter,
  onMouseLeave,
  onClick
}: MonsterPartOptionProps) {
  console.log('lower', option.label.toLowerCase());
  return (
    <div
      className={`
        w-full h-24 p-3 rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 hover:cursor-pointer
        ${
          selected
            ? 'bg-blue-500 text-white shadow-lg border-2 border-blue-600 scale-105'
            : 'hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
        bg-${option.label.toLowerCase() !== 'dark' ? option.label.toLowerCase() + '-500 text-gray-800' : 'black text-white hover:text-gray-800'}
        hover:text-blue-400
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {option.source ? (
        <div className="flex flex-col items-center gap-1 h-full w-full">
          <div className="flex-1 flex items-center justify-center max-h-12 max-w-12">
            <Image
              src={`/kenney_monster-builder-pack/${option.source}`}
              alt={option.label}
              width={32}
              height={32}
              className="object-contain max-h-full max-w-full"
            />
          </div>
          <span
            className={`text-xs font-medium text-center leading-tight ${
              option.label.toLowerCase() === 'dark'
                ? 'text-white'
                : 'text-gray-800'
            }`}
          >
            {option.label}
          </span>
        </div>
      ) : (
        <span className={`text-xs font-medium overflow-hidden text-ellipsis `}>
          {option.label}
        </span>
      )}
    </div>
  );
}
