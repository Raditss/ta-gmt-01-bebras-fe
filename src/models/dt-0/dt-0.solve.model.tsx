import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import { QuestionAttemptData } from '@/types/question-attempt.type';

interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
}

interface DecisionTreeAnswer {
  selections: Record<string, string>;
}

interface DecisionTreeContent {
  rules: Rule[];
}

export class DecisionTreeSolveModel extends IQuestion implements IAttempt {
  private content: DecisionTreeContent;
  private answer: DecisionTreeAnswer;
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.DECISION_TREE);

    this.content = {
      rules: []
    };
    this.answer = {
      selections: {}
    };
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  setAttemptData(duration: number, isDraft: boolean = true) {
    this.attemptDuration = duration;
    this.attemptIsDraft = isDraft;
  }

  getAttemptData(): QuestionAttemptData {
    return {
      questionId: this.id,
      duration: this.attemptDuration,
      isDraft: this.attemptIsDraft,
      answer: this.toJSON()
    };
  }

  toJSON(): string {
    return JSON.stringify(this.answer);
  }

  loadAnswer(json: string) {
    const answer = JSON.parse(json) as DecisionTreeAnswer;
    this.answer.selections = answer.selections || {};
  }

  populateQuestionFromString(questionString: string): void {
    try {
      this.content = JSON.parse(questionString) as DecisionTreeContent;

      this.resetToInitialState();
    } catch (error) {
      console.error('Error parsing question data:', error);
      throw new Error('Invalid question data format');
    }
  }

  resetToInitialState(): void {
    this.answer = {
      selections: {}
    };
  }

  getRules(): Rule[] {
    return this.content.rules;
  }

  setAnswerSelections(monsterPart: string, value: string): void {
    this.answer.selections[monsterPart] = value;
  }
}
