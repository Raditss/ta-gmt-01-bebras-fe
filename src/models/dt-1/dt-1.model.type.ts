export interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
  finish: number;
}

export interface Finish {
  id: number;
  name: string;
}

export interface CombinationAnswer {
  parts: Record<string, string>;
  id: number;
}

export interface DecisionTree2Answer {
  combinations: CombinationAnswer[];
}

export interface DecisionTree2Content {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
}
