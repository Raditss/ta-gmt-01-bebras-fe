import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import { QuestionAttemptData } from '@/types/question-attempt.type';
import {
  DecisionTreeAnomalyAnswer,
  DecisionTreeAnomalyContent,
  Rule
} from '@/models/decision-tree-anomaly/decision-tree-anomaly.model.type';

export class DecisionTreeAnomalySolveModel
  extends IQuestion
  implements IAttempt
{
  private content: DecisionTreeAnomalyContent;
  private answer: DecisionTreeAnomalyAnswer;
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.DECISION_TREE_ANOMALY);

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

  getSelection() {
    return this.answer.selections;
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
    const answer = JSON.parse(json) as DecisionTreeAnomalyAnswer;
    this.answer = answer || {};
  }

  populateQuestionFromString(questionString: string): void {
    try {
      this.content = JSON.parse(questionString) as DecisionTreeAnomalyContent;

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
