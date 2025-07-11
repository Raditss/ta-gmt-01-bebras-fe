import { ICreateQuestion } from '@/models/interfaces/create-question.model';
import { Question } from '@/types/question.type';
import { isPresent } from '@/utils/helpers/common.helper';
import {
  DecisionTree2Content,
  Finish,
  Rule
} from '@/models/dt-1/dt-1.model.type';

export class DecisionTree2CreateModel extends ICreateQuestion {
  private _content: DecisionTree2Content;

  constructor(_question: Question) {
    super(_question);
    this._content = {
      rules: [],
      finishes: [],
      goals: []
    };
    this.populateFromContentString(_question.content);
  }

  get content(): DecisionTree2Content {
    return this._content;
  }

  set content(value: DecisionTree2Content) {
    this._content = value;
  }

  toJson(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(contentString: string): void {
    try {
      this.content = JSON.parse(contentString) as DecisionTree2Content;
    } catch (error) {
      console.error('Error parsing Decision Tree 2 creation content:', error);
      throw new Error('Invalid Decision Tree 2 creation content format');
    }
  }

  hasRequiredContent(): boolean {
    return Object.values(this.content).every(isPresent);
  }

  // Rule management methods
  addRule(rule: Rule): void {
    this.content.rules.push(rule);
  }

  removeRule(ruleId: number): void {
    const index = this.content.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.content.rules.splice(index, 1);
    }
  }

  updateRule(ruleId: number, updatedRule: Rule): void {
    const index = this.content.rules.findIndex((rule) => rule.id === ruleId);
    if (index !== -1) {
      this.content.rules[index] = updatedRule;
    }
  }

  // Finish management methods
  addFinish(finish: Finish): void {
    this.content.finishes.push(finish);
  }

  removeFinish(finishId: number): void {
    const index = this.content.finishes.findIndex(
      (finish) => finish.id === finishId
    );
    if (index !== -1) {
      this.content.finishes.splice(index, 1);
      // Remove finish from goals if it exists there
      this.content.goals = this.content.goals.filter(
        (goalId) => goalId !== finishId
      );
      // Remove or update rules that reference this finish
      this.content.rules = this.content.rules.filter(
        (rule) => rule.finish !== finishId
      );
    }
  }

  updateFinish(finishId: number, updatedFinish: Finish): void {
    const index = this.content.finishes.findIndex(
      (finish) => finish.id === finishId
    );
    if (index !== -1) {
      this.content.finishes[index] = updatedFinish;
    }
  }

  // Goal management methods
  setGoals(goals: number[]): void {
    this.content.goals = goals;
  }

  addGoal(finishId: number): void {
    if (
      !this.content.goals.includes(finishId) &&
      this.content.finishes.some((f) => f.id === finishId)
    ) {
      this.content.goals.push(finishId);
    }
  }

  removeGoal(finishId: number): void {
    const index = this.content.goals.indexOf(finishId);
    if (index !== -1) {
      this.content.goals.splice(index, 1);
    }
  }

  toggleGoal(finishId: number): void {
    if (this.content.goals.includes(finishId)) {
      this.removeGoal(finishId);
    } else {
      this.addGoal(finishId);
    }
  }

  // Validation methods
  validateRule(rule: Rule): boolean {
    // Check if rule ID is unique
    if (this.content.rules.some((r) => r.id === rule.id && r !== rule)) {
      return false;
    }

    // Check if all conditions have required fields
    const conditionsValid = rule.conditions.every(
      (condition) =>
        condition.attribute && condition.operator && condition.value
    );

    // Check if finish exists
    const finishExists = this.content.finishes.some(
      (f) => f.id === rule.finish
    );

    return conditionsValid && finishExists;
  }

  validateFinish(finish: Finish): boolean {
    // Check if finish ID is unique
    if (this.content.finishes.some((f) => f.id === finish.id && f !== finish)) {
      return false;
    }

    // Check if name is provided
    return Boolean(finish.name && finish.name.trim().length > 0);
  }

  // Helper methods
  getNextRuleId(): number {
    return this.content.rules.length > 0
      ? Math.max(...this.content.rules.map((r) => r.id)) + 1
      : 1;
  }

  getNextFinishId(): number {
    return this.content.finishes.length > 0
      ? Math.max(...this.content.finishes.map((f) => f.id)) + 1
      : 1;
  }

  getGoalFinishes(): Finish[] {
    return this.content.finishes.filter((finish) =>
      this.content.goals.includes(finish.id)
    );
  }

  getRulesForFinish(finishId: number): Rule[] {
    return this.content.rules.filter((rule) => rule.finish === finishId);
  }

  validateContent(): boolean {
    if (!this.hasRequiredContent()) return false;

    if (!this.content.rules.every((rule) => this.validateRule(rule)))
      return false;

    if (!this.content.finishes.every((finish) => this.validateFinish(finish)))
      return false;

    return this.content.goals.every((goalId) =>
      this.content.finishes.some((f) => f.id === goalId)
    );
  }
}
