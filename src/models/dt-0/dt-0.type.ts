export interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
}

export interface DecisionTreeAnswer {
  selections: Record<string, string>;
}

export interface DecisionTreeContent {
  rules: Rule[];
}
