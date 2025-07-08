import { QuestionTypeEnum } from "@/types/question-type.type";
import { IQuestion, IAttempt } from "@/models/interfaces/question.model";
import {
  State,
  Rule,
  Step,
  CfgQuestionSetup,
  CfgSolution,
} from "@/types/cfg.type";
import {QuestionAttemptData} from "@/types/question-attempt.type";

export class CfgSolveModel extends IQuestion implements IAttempt {
  private questionSetup: CfgQuestionSetup;
  private currentState: State[];
  private rules: Rule[];
  private steps: Step[];
  private redoStack: Step[];
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number,) {
    super(id, QuestionTypeEnum.CFG);

    this.questionSetup = {
      startState: [],
      endState: [],
      rules: [],
      steps: [],
    };
    this.currentState = [];
    this.rules = [];
    this.steps = [];
    this.redoStack = [];
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  setAttemptData(
    duration: number,
    isDraft: boolean = true,
  ) {
    this.attemptDuration = duration;
    this.attemptIsDraft = isDraft;
  }

  getAttemptData(): QuestionAttemptData {
    return {
      questionId: this.getId(),
      duration: this.attemptDuration,
      isDraft: this.attemptIsDraft,
      answer: this.toJSON(),
    };
  }

  toJSON(): string {
    const solution: CfgSolution = {
      currentState: this.currentState,
      steps: this.steps,
    };
    return JSON.stringify(solution);
  }

  loadAnswer(json: string) {
    const solution = JSON.parse(json) as CfgSolution;
    this.resetToInitialState();
    solution.steps.forEach((step) => {
      this.applyRule(step.ruleId, step.index, step.replacedCount);
    });
  }

  populateQuestionFromString(questionString: string): void {
    try {
      const questionData = JSON.parse(questionString) as CfgQuestionSetup;

      if (!questionData || typeof questionData !== "object") {
        throw new Error("Invalid question data structure");
      }

      this.questionSetup = {
        startState: questionData.startState || [],
        endState: questionData.endState || [],
        rules: questionData.rules || [],
        steps: questionData.steps || [],
      };

      this.resetToInitialState();
    } catch (error) {
      console.error("Error parsing question data:", error);
      console.error("Question string:", questionString);

      this.questionSetup = {
        startState: [],
        endState: [],
        rules: [],
        steps: [],
      };
      this.resetToInitialState();
    }
  }

  questionToString(): string {
    return JSON.stringify(this.questionSetup);
  }

  checkAnswer(): boolean {
    if (this.steps.length === 0) return false;

    const finalState = this.steps[this.steps.length - 1].endState;

    if (finalState.length !== this.questionSetup.endState.length) return false;

    return finalState.every(
      (state, index) => state.type === this.questionSetup.endState[index].type
    );
  }

  resetToInitialState(): void {
    this.currentState = [...this.questionSetup.startState];
    this.rules = [...this.questionSetup.rules];
    this.steps = [];
    this.redoStack = [];
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

    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const nextStep = this.redoStack.pop();
    if (!nextStep) return false;

    this.steps.push(nextStep);
    this.currentState = [...nextStep.endState];

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

  applyRule(ruleId: string, index: number, count: number): boolean {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return false;

    const newState = [...this.currentState];
    newState.splice(index, count, ...rule.after);

    const step: Step = {
      ruleId,
      index,
      replacedCount: count,
      endState: newState,
    };

    this.steps.push(step);
    this.redoStack = [];
    this.currentState = newState;

    return true;
  }
}
