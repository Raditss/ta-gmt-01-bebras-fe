import { ICreateQuestion } from "@/models/interfaces/create-question.model";

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

export interface DecisionTree2CreationContent {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
}

export class DecisionTree2CreateQuestion extends ICreateQuestion {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
  private steps: string[];
  private redoStack: string[];

  constructor(
    title: string,
    description: string = "",
    category: string = "Decision Tree 2",
    points: number = 100,
    estimatedTime: number = 30,
    author: string = "",
    id?: string,
    creatorId?: string
  ) {
    super(
      title,
      description,
      category,
      points,
      estimatedTime,
      author,
      id,
      creatorId
    );
    this.rules = [];
    this.finishes = [];
    this.goals = [];
    this.steps = [];
    this.redoStack = [];
  }

  // Implementation of abstract methods
  contentToString(): string {
    const content: DecisionTree2CreationContent = {
      rules: this.rules,
      finishes: this.finishes,
      goals: this.goals,
    };
    return JSON.stringify(content);
  }

  populateFromContentString(contentString: string): void {
    try {
      const content = JSON.parse(contentString) as DecisionTree2CreationContent;
      this.rules = content.rules || [];
      this.finishes = content.finishes || [];
      this.goals = content.goals || [];
      this.steps = [];
      this.redoStack = [];
    } catch (error) {
      console.error("Error parsing Decision Tree 2 creation content:", error);
      throw new Error("Invalid Decision Tree 2 creation content format");
    }
  }

  // Rule management methods
  setRules(rules: Rule[]): void {
    this.rules = rules;
    this.steps.push("setRules");
    this.redoStack = [];
  }

  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.steps.push(`addRule:${rule.id}`);
    this.redoStack = [];
  }

  removeRule(ruleId: number): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      this.steps.push(`removeRule:${ruleId}`);
      this.redoStack = [];
    }
  }

  updateRule(ruleId: number, updatedRule: Rule): void {
    const index = this.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.rules[index] = updatedRule;
      this.steps.push(`updateRule:${ruleId}`);
      this.redoStack = [];
    }
  }

  // Finish management methods
  setFinishes(finishes: Finish[]): void {
    this.finishes = finishes;
    this.steps.push("setFinishes");
    this.redoStack = [];
  }

  addFinish(finish: Finish): void {
    this.finishes.push(finish);
    this.steps.push(`addFinish:${finish.id}`);
    this.redoStack = [];
  }

  removeFinish(finishId: number): void {
    const index = this.finishes.findIndex((finish) => finish.id === finishId);
    if (index !== -1) {
      this.finishes.splice(index, 1);
      // Remove finish from goals if it exists there
      this.goals = this.goals.filter((goalId) => goalId !== finishId);
      // Remove or update rules that reference this finish
      this.rules = this.rules.filter((rule) => rule.finish !== finishId);
      this.steps.push(`removeFinish:${finishId}`);
      this.redoStack = [];
    }
  }

  updateFinish(finishId: number, updatedFinish: Finish): void {
    const index = this.finishes.findIndex((finish) => finish.id === finishId);
    if (index !== -1) {
      this.finishes[index] = updatedFinish;
      this.steps.push(`updateFinish:${finishId}`);
      this.redoStack = [];
    }
  }

  // Goal management methods
  setGoals(goals: number[]): void {
    this.goals = goals;
    this.steps.push("setGoals");
    this.redoStack = [];
  }

  addGoal(finishId: number): void {
    if (
      !this.goals.includes(finishId) &&
      this.finishes.some((f) => f.id === finishId)
    ) {
      this.goals.push(finishId);
      this.steps.push(`addGoal:${finishId}`);
      this.redoStack = [];
    }
  }

  removeGoal(finishId: number): void {
    const index = this.goals.indexOf(finishId);
    if (index !== -1) {
      this.goals.splice(index, 1);
      this.steps.push(`removeGoal:${finishId}`);
      this.redoStack = [];
    }
  }

  toggleGoal(finishId: number): void {
    if (this.goals.includes(finishId)) {
      this.removeGoal(finishId);
    } else {
      this.addGoal(finishId);
    }
  }

  // Condition management methods
  addCondition(ruleId: number, condition: Condition): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.conditions.push(condition);
      this.steps.push(`addCondition:${ruleId}:${condition.attribute}`);
      this.redoStack = [];
    }
  }

  removeCondition(ruleId: number, attribute: string): void {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (rule) {
      rule.conditions = rule.conditions.filter(
        (c) => c.attribute !== attribute
      );
      this.steps.push(`removeCondition:${ruleId}:${attribute}`);
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
      const index = rule.conditions.findIndex((c) => c.attribute === attribute);
      if (index !== -1) {
        rule.conditions[index] = updatedCondition;
        this.steps.push(`updateCondition:${ruleId}:${attribute}`);
        this.redoStack = [];
      }
    }
  }

  // Undo/Redo functionality
  getSteps(): string[] {
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
    if (this.rules.some((r) => r.id === rule.id && r !== rule)) {
      return false;
    }

    // Check if all conditions have required fields
    const conditionsValid = rule.conditions.every(
      (condition) =>
        condition.attribute && condition.operator && condition.value
    );

    // Check if finish exists
    const finishExists = this.finishes.some((f) => f.id === rule.finish);

    return conditionsValid && finishExists;
  }

  validateFinish(finish: Finish): boolean {
    // Check if finish ID is unique
    if (this.finishes.some((f) => f.id === finish.id && f !== finish)) {
      return false;
    }

    // Check if name is provided
    return Boolean(finish.name && finish.name.trim().length > 0);
  }

  validateQuestion(): boolean {
    // Check if there are any rules
    if (this.rules.length === 0) {
      return false;
    }

    // Check if there are any finishes
    if (this.finishes.length === 0) {
      return false;
    }

    // Check if there are any goals
    if (this.goals.length === 0) {
      return false;
    }

    // Check if all rules are valid
    if (!this.rules.every((rule) => this.validateRule(rule))) {
      return false;
    }

    // Check if all finishes are valid
    if (!this.finishes.every((finish) => this.validateFinish(finish))) {
      return false;
    }

    // Check if all goals reference existing finishes
    if (
      !this.goals.every((goalId) => this.finishes.some((f) => f.id === goalId))
    ) {
      return false;
    }

    return true;
  }

  // Helper methods
  getNextRuleId(): number {
    return this.rules.length > 0
      ? Math.max(...this.rules.map((r) => r.id)) + 1
      : 1;
  }

  getNextFinishId(): number {
    return this.finishes.length > 0
      ? Math.max(...this.finishes.map((f) => f.id)) + 1
      : 1;
  }

  getGoalFinishes(): Finish[] {
    return this.finishes.filter((finish) => this.goals.includes(finish.id));
  }

  getRulesForFinish(finishId: number): Rule[] {
    return this.rules.filter((rule) => rule.finish === finishId);
  }
}
