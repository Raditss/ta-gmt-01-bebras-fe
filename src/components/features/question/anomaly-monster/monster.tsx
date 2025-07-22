import {
  MonsterPartEnum,
  MonsterPartOptionType
} from '@/components/features/question/anomaly-monster/monster.type';
import MonsterCharacter from '@/components/features/question/anomaly-monster/monster-character';

interface MonsterProps {
  selections: Record<string, string>;
  onSelection?: (
    category: MonsterPartEnum,
    value: MonsterPartOptionType
  ) => void;
  hovered?: {
    category: MonsterPartEnum;
    value: string;
  } | null;
}

const Monster = ({ selections, hovered = null }: MonsterProps) => {
  return (
    <div className="flex justify-center items-center">
      <MonsterCharacter selections={selections} hovered={hovered} />
    </div>
  );
};

export default Monster;
