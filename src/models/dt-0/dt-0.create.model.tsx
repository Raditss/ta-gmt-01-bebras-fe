import { ICreateQuestion } from "../interfaces/create-question.model";

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

export class DecisionTreeCreateQuestion extends ICreateQuestion {
  rules: Rule[];
  private steps: Rule[];
  private redoStack: Rule[];

  constructor(
    questionTypeId: number,
    content: string = "{}",
    isPublished: boolean = false,
    title: string = "New Question",
    points: number = 0,
    estimatedTime: number = 0,
    id?: string | number,
  ) {
    super(
      questionTypeId,
      content,
      isPublished,
      title,
      points,
      estimatedTime,
      id,
    );
    this.rules = [];
    this.steps = [];
    this.redoStack = [];
  }

  // Implementation of abstract methods
  contentToString(): string {
    const content: DecisionTreeCreationContent = {
      rules: this.rules,
    };
    return JSON.stringify(content);
  }

  populateFromContentString(contentString: string): void {
    try {
      const content = JSON.parse(contentString) as DecisionTreeCreationContent;
      this.rules = content.rules || [];
      this.steps = [];
      this.redoStack = [];
    } catch (error) {
      console.error("Error parsing Decision Tree creation content:", error);
      throw new Error("Invalid Decision Tree creation content format");
    }
  }

  // Rule management methods
  setRules(rules: Rule[]): void {
    this.rules = rules;
  }

  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.steps.push(rule);
    this.redoStack = [];
  }

  removeRule(ruleId: number): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      const removedRule = this.rules.splice(index, 1)[0];
      this.steps.push(removedRule);
      this.redoStack = [];
    }
  }

  updateRule(ruleId: number, updatedRule: Rule): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      const oldRule = this.rules[index];
      this.rules[index] = updatedRule;
      this.steps.push(oldRule);
      this.redoStack = [];
    }
  }

  // Condition management methods
  addCondition(ruleId: number, condition: Condition): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      const oldRule = { ...rule };
      rule.conditions.push(condition);
      this.steps.push(oldRule);
      this.redoStack = [];
    }
  }

  removeCondition(ruleId: number, attribute: string): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      const oldRule = { ...rule };
      rule.conditions = rule.conditions.filter(
        (c) => c.attribute !== attribute
      );
      this.steps.push(oldRule);
      this.redoStack = [];
    }
  }

  updateCondition(
    ruleId: number,
    attribute: string,
    updatedCondition: Condition
  ): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      const oldRule = { ...rule };
      const index = rule.conditions.findIndex((c) => c.attribute === attribute);
      if (index !== -1) {
        rule.conditions[index] = updatedCondition;
        this.steps.push(oldRule);
        this.redoStack = [];
      }
    }
  }

  // Undo/Redo functionality
  getSteps(): Rule[] {
    return this.steps;
  }

  resetSteps(): void {
    this.steps = [];
    this.redoStack = [];
  }

  undo(): boolean {
    if (this.steps.length === 0) return false;

    const lastStep = this.steps.pop();
    if (!lastStep) return false;

    this.redoStack.push(lastStep);
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const nextStep = this.redoStack.pop();
    if (!nextStep) return false;

    this.steps.push(nextStep);
    return true;
  }

  // Validation methods
  validateRule(rule: Rule): boolean {
    // Check if rule ID is unique
    if (this.rules.some((r) => r.id === rule.id)) {
      return false;
    }

    // Check if all conditions have required fields
    return rule.conditions.every(
      (condition) =>
        condition.attribute && condition.operator && condition.value
    );
  }

  validateQuestion(): boolean {
    // Check if there are any rules
    if (this.rules.length === 0) {
      return false;
    }

    // Check if all rules are valid
    return this.rules.every((rule) => this.validateRule(rule));
  }
}
