import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import {
  CfgQuestionSetup,
  CfgSolution,
  Rule,
  State,
  Step
} from '@/types/cfg.type';
import { QuestionAttemptData } from '@/types/question-attempt.type';

export class CfgSolveModel extends IQuestion implements IAttempt {
  private questionSetup: CfgQuestionSetup;
  private currentState: State[];
  private rules: Rule[];
  private steps: Step[];
  private redoStack: Step[];
  private attemptDuration: number;
  private attemptIsDraft: boolean;
  private answer: CfgSolution;

  constructor(id: number) {
    super(id, QuestionTypeEnum.CFG);

    this.questionSetup = {
      startState: [],
      endState: [],
      rules: [],
      steps: []
    };
    this.currentState = [];
    this.rules = [];
    this.steps = [];
    this.redoStack = [];
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
    this.answer = {
      currentState: [],
      steps: []
    };
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
    try {
      const solution = JSON.parse(json) as CfgSolution;
      this.resetToInitialState();

      if (solution.steps && Array.isArray(solution.steps)) {
        solution.steps.forEach((step) => {
          this.applyRule(step.ruleId, step.index, step.replacedCount);
        });
      }
    } catch (error) {
      console.error('📥 CFG loadAnswer error:', error);
    }
  }

  populateQuestionFromString(questionString: string): void {
    try {
      // Handle double JSON encoding - parse twice if needed
      let questionData = JSON.parse(questionString);
      if (typeof questionData === 'string') {
        questionData = JSON.parse(questionData);
      }

      this.questionSetup = {
        startState: questionData.startState || [],
        endState: questionData.endState || [],
        rules: questionData.rules || [],
        steps: questionData.steps || []
      };

      this.resetToInitialState();
    } catch (error) {
      console.error('CFG Solve Model - Error parsing question data:', error);

      this.questionSetup = {
        startState: [],
        endState: [],
        rules: [],
        steps: []
      };
      this.resetToInitialState();
    }
  }

  checkAnswer(): boolean {
    if (this.steps.length === 0) return false;

    const finalState = this.steps[this.steps.length - 1].endState;

    if (finalState.length !== this.questionSetup.endState.length) return false;

    // Sort both states by type before comparing (order shouldn't matter in CFG)
    const finalTypes = finalState.map((s) => s.type).sort();
    const expectedTypes = this.questionSetup.endState.map((s) => s.type).sort();

    return finalTypes.every((type, index) => type === expectedTypes[index]);
  }

  resetToInitialState(): void {
    this.currentState = [...this.questionSetup.startState];
    this.rules = [...this.questionSetup.rules];
    this.steps = [];
    this.redoStack = [];
    this.answer = {
      currentState: [...this.currentState],
      steps: [...this.steps]
    };
  }

  undo(): boolean {
    if (this.steps.length === 0) return false;

    const lastStep = this.steps.pop();
    if (!lastStep) return false;

    this.redoStack.push(lastStep);

    if (this.steps.length > 0) {
      this.currentState = [...this.steps[this.steps.length - 1].endState];
    } else {
      this.currentState = [...this.questionSetup.startState];
    }

    this.answer = {
      currentState: [...this.currentState],
      steps: [...this.steps]
    };

    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const nextStep = this.redoStack.pop();
    if (!nextStep) return false;

    this.steps.push(nextStep);
    this.currentState = [...nextStep.endState];

    this.answer = {
      currentState: [...this.currentState],
      steps: [...this.steps]
    };

    return true;
  }

  // CFG-specific methods
  getCurrentState(): State[] {
    return this.currentState;
  }

  getAvailableRules(): Rule[] {
    return this.rules;
  }

  getSteps(): Step[] {
    return this.steps;
  }

  getQuestionSetup(): CfgQuestionSetup {
    return this.questionSetup;
  }

  applyRule(ruleId: string, index: number, _count: number): boolean {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return false;

    const newState = [...this.currentState];

    // Remove the matched elements (should be rule.before.length, not count)
    newState.splice(index, rule.before.length);

    // Create replacement elements with proper structure
    const replacements = rule.after.map((item, i) => ({
      id: index + i + 1,
      type: item.type
    }));

    // Insert the replacement elements
    newState.splice(index, 0, ...replacements);

    // Re-index the entire state to match backend behavior
    const reindexedState = newState.map((item, i) => ({
      id: i + 1,
      type: item.type
    }));

    const step: Step = {
      ruleId,
      index,
      replacedCount: rule.before.length, // Use rule.before.length instead of count
      endState: reindexedState
    };

    this.steps.push(step);
    this.redoStack = [];
    this.currentState = reindexedState;

    this.answer = {
      currentState: [...this.currentState],
      steps: [...this.steps]
    };

    return true;
  }
}
