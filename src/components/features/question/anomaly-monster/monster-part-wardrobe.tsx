import {
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/anomaly-monster/monster-part.type';
import MonsterPartOptions from './monster-part-options';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { monsterParts } from '@/components/features/question/anomaly-monster/helper';

export interface MonsterPartWardrobeProps {
  selections: Record<string, string>;
  onSelection: (
    category: MonsterPartType,
    value: MonsterPartOptionType
  ) => void;
  onHover: (category: MonsterPartType, value: string) => void;
  onMouseLeave: () => void;
}

export default function MonsterPartWardrobe({
  selections,
  onSelection,
  onHover,
  onMouseLeave
}: MonsterPartWardrobeProps) {
  const partKeys = Object.keys(monsterParts);

  if (partKeys.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={partKeys[0]} className="mt-4 justify-center">
      <TabsList className="justify-center w-full">
        {partKeys.map((part) => (
          <TabsTrigger
            key={part}
            value={part}
            className="capitalize text-xs font-medium px-2 py-2"
          >
            {part.replace(/_/g, ' ')}
          </TabsTrigger>
        ))}
      </TabsList>

      {partKeys.map((part) => (
        <TabsContent key={part} value={part} className="w-full h-full">
          <MonsterPartOptions
            options={monsterParts[part as MonsterPartType]}
            selectedOption={selections[part]}
            onSelection={(option) =>
              onSelection(part as MonsterPartType, option)
            }
            onHover={(value) => onHover(part as MonsterPartType, value)}
            onMouseLeave={onMouseLeave}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
