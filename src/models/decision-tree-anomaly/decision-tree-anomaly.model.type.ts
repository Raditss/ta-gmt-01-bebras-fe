export interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
}

export interface DecisionTreeAnomalyAnswer {
  selections: Record<string, string>;
}

export interface DecisionTreeAnomalyContent {
  rules: Rule[];
}
