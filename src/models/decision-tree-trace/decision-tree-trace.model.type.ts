export interface Condition {
  attribute: string;
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

export interface DecisionTreeTraceAnswer {
  combinations: CombinationAnswer[];
}

export interface DecisionTreeTraceContent {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
}
