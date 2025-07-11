import { ICreateQuestion } from '../interfaces/create-question.model';
import { Question } from '@/types/question.type';

export interface Rule {
  id: string;
  before: State[];
  after: State[];
}

export interface State {
  id: number;
  type: string;
}

export interface Step {
  ruleId: string;
  index: number;
  replacedCount: number;
  endState: State[];
}

export interface CfgCreationContent {
  rules: Rule[];
  startState: State[];
  endState: State[];
  steps: Step[];
  redoStack: Step[];
}

export class CfgCreateModel extends ICreateQuestion {
  rules: Rule[];
  startState: State[];
  endState: State[];
  private initialEndState: State[];
  private steps: Step[];
  private redoStack: Step[];

  constructor(_question: Question) {
    super(_question);
    this.rules = [];
    this.startState = [];
    this.endState = [];
    this.initialEndState = [];
    this.steps = [];
    this.redoStack = [];

    // Load content from draft if it exists
    this.populateFromContentString(this.draft.content);
  }

  toJson(): string {
    const content: CfgCreationContent = {
      rules: this.rules,
      startState: this.startState,
      endState: this.endState,
      steps: this.steps,
      redoStack: this.redoStack
    };
    return JSON.stringify(content);
  }

  contentToString(): string {
    return this.toJson();
  }

  populateFromContentString(contentString: string): void {
    try {
      if (!contentString || contentString === '{}') {
        // Empty content - use defaults
        this.rules = [];
        this.startState = [];
        this.endState = [];
        this.initialEndState = [];
        this.steps = [];
        this.redoStack = [];
        return;
      }

      const content = JSON.parse(contentString) as CfgCreationContent;
      this.rules = content.rules || [];
      this.startState = content.startState || [];
      this.endState = content.endState || [];
      this.initialEndState = content.startState ? [...content.startState] : [];
      this.steps = content.steps || [];
      this.redoStack = content.redoStack || [];
    } catch (error) {
      console.error('Error parsing CFG creation content:', error);
      // Don't throw error, just use defaults
      this.rules = [];
      this.startState = [];
      this.endState = [];
      this.initialEndState = [];
      this.steps = [];
      this.redoStack = [];
    }
  }

  setRules(rules: Rule[]): void {
    this.rules = rules;
  }

  setStartState(state: State[]): void {
    this.startState = state;
  }

  setEndState(state: State[]): void {
    this.endState = state;
  }

  setInitialEndState(state: State[]): void {
    this.initialEndState = [...state];
    this.resetSteps();
  }

  getSteps(): Step[] {
    return this.steps;
  }

  resetSteps(): void {
    this.steps = [];
    this.redoStack = [];
  }

  pushStep(step: Step): void {
    this.steps.push(step);
    this.redoStack = [];
  }

  popStep(): Step | undefined {
    const step = this.steps.pop();
    if (step) {
      this.redoStack.push(step);
    }
    return step;
  }

  redoStep(): Step | undefined {
    const step = this.redoStack.pop();
    if (step) {
      this.steps.push(step);
    }
    return step;
  }

  replaySteps(): State[] {
    const currentState = [...this.startState];
    for (const step of this.steps) {
      const rule = this.rules.find((r) => r.id === step.ruleId);
      if (!rule) continue;

      const replacedCount = step.replacedCount || rule.before.length;
      currentState.splice(step.index, replacedCount);
      currentState.splice(
        step.index,
        0,
        ...rule.after.map((obj: State, i: number) => ({
          ...obj,
          id: Date.now() + Math.random() + i
        }))
      );
    }
    return currentState;
  }

  replayStepsFromInitialEndState(): State[] {
    const currentState = [...this.initialEndState];

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      const rule = this.rules.find((r) => r.id === step.ruleId);
      if (!rule) {
        continue;
      }

      const replacedCount = step.replacedCount || rule.before.length;

      currentState.splice(step.index, replacedCount);

      const newItems = rule.after.map((obj: State, idx: number) => ({
        ...obj,
        id: Date.now() + Math.random() + i + idx
      }));

      currentState.splice(step.index, 0, ...newItems);
    }

    return currentState;
  }

  resetEndState(): void {
    this.endState = [...this.startState];
    this.initialEndState = [...this.startState];
    this.resetSteps();
  }

  hasRequiredContent(): boolean {
    return (
      this.rules.length > 0 &&
      this.startState.length > 0 &&
      this.endState.length > 0
    );
  }

  validateContent(): boolean {
    // Basic validation - just need at least some content to save as draft
    return true; // Allow saving even incomplete content as draft
  }
}
