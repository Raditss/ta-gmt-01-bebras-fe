import { ICreateQuestion } from '../interfaces/create-question.model';
import {
  AnomalyMonsterQuestion,
  Monster
} from '@/models/anomaly-monster/anomaly-monster.model.type';
import { MonsterPartType } from '@/components/features/question/anomaly-monster/monster-part.type';
import { Question } from '@/types/question.type';

export class AnomalyMonsterCreateModel extends ICreateQuestion {
  private content: AnomalyMonsterQuestion;

  constructor(draft: Question) {
    super(draft);
    this.content = {
      tree: [],
      choices: []
    };
    this.populateFromContentString(this.draft.content);
  }

  get monsterTree(): Monster[] {
    return this.content.tree;
  }

  set monsterTree(value: Monster[]) {
    this.content.tree = value;
  }

  get monsterChoices(): Monster[] {
    return this.content.choices;
  }

  set monsterChoices(value: Monster[]) {
    this.content.choices = value;
  }

  toJson(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(contentString: string): void {
    try {
      this.content = JSON.parse(contentString) as AnomalyMonsterQuestion;
      if (!this.hasRequiredContent()) {
        this.content.tree = this.content.tree || [];
        this.content.choices = this.content.choices || [];
      }
    } catch (error) {
      console.error(
        'Error parsing Decision Tree Anomaly creation content:',
        error
      );
      this.content.tree = this.content.tree || [];
      this.content.choices = this.content.choices || [];
    }
  }

  validateContent(): boolean {
    return (
      this.hasRequiredContent() &&
      this.content.tree.every((rule) => this.validateMonster(rule)) &&
      this.content.choices.every((choice) => this.validateMonster(choice))
    );
  }

  hasRequiredContent(): boolean {
    return (
      this.content.tree &&
      this.content.tree.length > 0 &&
      this.content.choices &&
      this.content.choices.length > 0
    );
  }

  validateMonster(monster: Monster): boolean {
    if (Object.values(MonsterPartType).length != monster.conditions.length)
      return false;

    return Object.values(MonsterPartType).every((part) =>
      monster.conditions.some(
        (condition) => condition.attribute === part && condition.value
      )
    );
  }
}
