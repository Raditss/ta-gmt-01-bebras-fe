import {
  BodyType,
  ColorType,
  MonsterPartType,
  MonsterPartValue,
  MouthType
} from '@/components/features/question/anomaly-monster/monster.type';

export interface MonsterCondition {
  attribute: MonsterPartType;
  value: MonsterPartValue;
}

export interface Monster {
  readonly id: number;
  name: string;
  readonly conditions: MonsterCondition[];
}

export interface Branch {
  readonly id: number;
  readonly conditions: MonsterCondition[];
}

export interface AnomalyMonsterQuestion {
  tree: Branch[];
  choices: Monster[];
}

export interface AnomalyMonsterForm {
  id: number;
  Color?: ColorType;
  Body?: BodyType;
  Mouth?: MouthType;
}

export interface AnomalyMonsterAnswer {
  anomaly: number[]; // id of AnomalyMonsterQuestionChoices
  normal: number[]; // id of AnomalyMonsterQuestionChoices
  forms: AnomalyMonsterForm[];

  currentIdx: number;
}
