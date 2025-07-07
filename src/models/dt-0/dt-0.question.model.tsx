import {QuestionTypeEnum} from "@/types/question-type.type";
import {IAttempt, IQuestion} from "@/models/interfaces/question";
import {QuestionAttemptData} from "@/types/question-attempt.type";

interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
}

interface DecisionTreeQuestionSetup {
  rules: Rule[];
}

interface DecisionTreeSolution {
  selectedRule: number | null;
  userSelections: Record<string, string>;
}

export class DecisionTreeQuestionModel extends IQuestion implements IAttempt {
  private questionSetup: DecisionTreeQuestionSetup;
  private selectedRule: number | null;
  private userSelections: Record<string, string>;
  private attemptDuration: number;
  private attemptIsDraft: boolean;
  private undoStack: DecisionTreeSolution[];
  private redoStack: DecisionTreeSolution[];

  constructor(
    id: number,
    title: string,
    questionType: QuestionTypeEnum,
    duration: number
  ) {
    const now = new Date();
    super(id, title, questionType, duration, now);

    this.questionSetup = {
      rules: [],
    };
    this.selectedRule = null;
    this.userSelections = {};
    this.undoStack = [];
    this.redoStack = [];
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  setAttemptData(
    duration: number,
    isDraft: boolean = true
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
    const solution: DecisionTreeSolution = {
      selectedRule: this.selectedRule,
      userSelections: this.userSelections,
    };
    return JSON.stringify(solution);
  }

  loadAnswer(json: string) {
    const solution = JSON.parse(json) as DecisionTreeSolution;
    this.selectedRule = solution.selectedRule;
    this.userSelections = solution.userSelections;
  }

  populateQuestionFromString(questionString: string): void {
    try {
      this.questionSetup = JSON.parse(
        questionString
      ) as DecisionTreeQuestionSetup;

      this.resetToInitialState();
    } catch (error) {
      console.error("Error parsing question data:", error);
      throw new Error("Invalid question data format");
    }
  }

  questionToString(): string {
    return JSON.stringify(this.questionSetup);
  }

  checkAnswer(): boolean {
    if (this.selectedRule === null) return false;

    const rule = this.questionSetup.rules.find(
      (r) => r.id === this.selectedRule
    );
    if (!rule) return false;

    return rule.conditions.every((condition) => {
      const userValue = this.userSelections[condition.attribute];
      return userValue === condition.value;
    });
  }

  resetToInitialState(): void {
    this.selectedRule = null;
    this.userSelections = {};
    this.undoStack = [];
    this.redoStack = [];
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;

    const currentState: DecisionTreeSolution = {
      selectedRule: this.selectedRule,
      userSelections: { ...this.userSelections },
    };
    this.redoStack.push(currentState);

    const previousState = this.undoStack.pop()!;
    this.selectedRule = previousState.selectedRule;
    this.userSelections = { ...previousState.userSelections };

    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const currentState: DecisionTreeSolution = {
      selectedRule: this.selectedRule,
      userSelections: { ...this.userSelections },
    };
    this.undoStack.push(currentState);

    const nextState = this.redoStack.pop()!;
    this.selectedRule = nextState.selectedRule;
    this.userSelections = { ...nextState.userSelections };

    return true;
  }

  // Decision Tree specific methods
  getRules(): Rule[] {
    return this.questionSetup.rules;
  }

  getSelectedRule(): number | null {
    return this.selectedRule;
  }

  getUserSelections(): Record<string, string> {
    return { ...this.userSelections };
  }

  setSelection(attribute: string, value: string): void {
    const currentState: DecisionTreeSolution = {
      selectedRule: this.selectedRule,
      userSelections: { ...this.userSelections },
    };
    this.undoStack.push(currentState);
    this.redoStack = [];

    this.userSelections[attribute] = value;
    this.selectedRule = null; // Reset selected rule when new selection is made
  }

  selectRule(ruleId: number): void {
    const currentState: DecisionTreeSolution = {
      selectedRule: this.selectedRule,
      userSelections: { ...this.userSelections },
    };
    this.undoStack.push(currentState);
    this.redoStack = [];

    this.selectedRule = ruleId;
  }
}
