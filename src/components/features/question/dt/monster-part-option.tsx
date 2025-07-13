import { MonsterPartOptionType } from '@/components/features/question/dt/monster-part.type';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
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
  return (
    <div
      className={`
        w-full h-20 p-2 rounded-lg transition-all duration-200 flex items-center justify-center hover:cursor-pointer
        ${
          selected
            ? 'bg-blue-500 text-white shadow-lg border-2 border-blue-600 scale-105'
            : 'hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {option.source ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src={`/kenney_monster-builder-pack/${option.source}`}
              alt={option.label}
              width={32}
              height={32}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{option.label}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {option.label}
        </span>
      )}
    </div>
  );
}
