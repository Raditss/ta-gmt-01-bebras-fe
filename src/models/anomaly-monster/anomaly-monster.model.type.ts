import {
  MonsterPartType,
  MonsterPartValue
} from '@/components/features/question/anomaly-monster/monster-part.type';

export interface MonsterCondition {
  attribute: MonsterPartType;
  value: MonsterPartValue;
}

export interface Monster {
  readonly id: number;
  readonly conditions: MonsterCondition[];
}

export interface AnomalyMonsterQuestion {
  tree: Monster[];
  choices: Monster[];
}

export interface AnomalyMonsterAnswer {
  anomaly: number[]; // id of AnomalyMonsterQuestionChoices
  normal: number[]; // id of AnomalyMonsterQuestionChoices

  currentIdx: number;
}
