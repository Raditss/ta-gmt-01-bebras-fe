import { ICreateQuestion } from '../interfaces/create-question.model';
import { DecisionTreeContent, Rule } from '@/models/dt-0/dt-0.model.type';
import { MonsterPartType } from '@/components/features/question/dt/monster-part.type';
import { Question } from '@/types/question.type';

export class DecisionTreeCreateModel extends ICreateQuestion {
  private content: DecisionTreeContent;

  constructor(draft: Question) {
    super(draft);
    this.content = {
      rules: []
    };
    this.populateFromContentString(this.draft.content);
  }

  get rules(): Rule[] {
    return this.content.rules;
  }

  set rules(value: Rule[]) {
    this.content.rules = value;
  }

  toJson(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(contentString: string): void {
    try {
      this.content = JSON.parse(contentString) as DecisionTreeContent;
      if (!this.hasRequiredContent()) {
        this.content.rules = [];
      }
    } catch (error) {
      console.error('Error parsing Decision Tree creation content:', error);
      throw new Error('Invalid Decision Tree creation content format');
    }
  }

  validateContent(): boolean {
    return (
      this.hasRequiredContent() &&
      this.content.rules.every((rule) => this.validateRule(rule))
    );
  }

  hasRequiredContent(): boolean {
    return this.content.rules && this.content.rules.length > 0;
  }

  validateRule(rule: Rule): boolean {
    if (Object.values(MonsterPartType).length != rule.conditions.length)
      return false;

    return Object.values(MonsterPartType).every((part) =>
      rule.conditions.some(
        (condition) =>
          condition.attribute === part && condition.operator && condition.value
      )
    );
  }
}
