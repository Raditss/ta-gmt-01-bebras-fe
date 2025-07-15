import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import { QuestionAttemptData } from '@/types/question-attempt.type';
import {
  CombinationAnswer,
  DecisionTreeTraceAnswer,
  DecisionTreeTraceContent,
  Finish,
  Rule
} from '@/models/decision-tree-trace/decision-tree-trace.model.type';

export class DecisionTreeTraceSolveModel extends IQuestion implements IAttempt {
  private content: DecisionTreeTraceContent;
  private answer: DecisionTreeTraceAnswer;
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.DECISION_TREE_TRACE);

    this.content = {
      rules: [],
      finishes: [],
      goals: []
    };
    this.answer = {
      combinations: []
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
    const answer = JSON.parse(json) as DecisionTreeTraceAnswer;
    this.answer = {
      combinations: answer.combinations || []
    };
  }

  populateQuestionFromString(questionString: string): void {
    try {
      this.content = JSON.parse(questionString) as DecisionTreeTraceContent;

      this.resetToInitialState();
    } catch (error) {
      console.error('Error parsing question data:', error);
      throw new Error('Invalid question data format');
    }
  }

  resetToInitialState(): void {
    this.answer = {
      combinations: []
    };
  }

  getRules(): Rule[] {
    return this.content.rules;
  }

  getFinishes(): Finish[] {
    return this.content.finishes;
  }

  getGoals(): number[] {
    return this.content.goals;
  }

  getCombinations(): CombinationAnswer[] {
    return this.answer.combinations;
  }

  addCombination(combination: CombinationAnswer): void {
    this.answer.combinations.push(combination);
  }

  removeCombination(combinationId: number): void {
    this.answer.combinations = this.answer.combinations.filter(
      (combination) => combination.id !== combinationId
    );
  }

  getGoalRules(): Rule[] {
    return this.content.rules.filter((rule) =>
      this.content.goals.includes(rule.finish)
    );
  }
}
