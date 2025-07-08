import { ICreateQuestion } from "../interfaces/create-question.model";
import {Question} from "@/types/question.type";
import {isPresent} from "@/utils/helpers/common.helper";

export interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
}

export interface DecisionTreeCreationContent {
  rules: Rule[];
}

export class DecisionTreeCreateModel extends ICreateQuestion {
  private _content: DecisionTreeCreationContent;

  constructor(
    _question: Question
  ) {
    super(_question);
    this._content = {
      rules: [],
    };
    this.populateFromContentString(_question.content);
  }

  get content(): DecisionTreeCreationContent {
    return this._content;
  }

  set content(value: DecisionTreeCreationContent) {
    this._content = value;
  }

  contentToString(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(contentString: string): void {
    try {
      const content = JSON.parse(contentString) as DecisionTreeCreationContent;
      this.content = content || { rules: [] };
    } catch (error) {
      console.error("Error parsing Decision Tree creation content:", error);
      throw new Error("Invalid Decision Tree creation content format");
    }
  }

  setRules(rules: Rule[]): void {
    this.content.rules = rules;
  }

  validateContent(): boolean {
    if (!this.hasRequiredContent()) return false;

    return this.content.rules.every((rule) => this.validateRule(rule));
  }

  hasRequiredContent(): boolean {
    return Object.values(this.content).every(isPresent)
  }

  validateRule(rule: Rule): boolean {
    if (this.content.rules.some((r) => r.id === rule.id)) {
      return false;
    }

    return rule.conditions.every(
      (condition) =>
        condition.attribute && condition.operator && condition.value
    );
  }
}
