import { QuestionTypeEnum } from "@/types/question-type.type";
import { IQuestion, IAttempt } from "@/models/interfaces/question";
import {QuestionAttemptData} from "@/types/question-attempt.type";

interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
  finish: number;
}

export interface Finish {
  id: number;
  name: string;
}

export interface CombinationAnswer {
  parts: Record<string, string>;
  ruleId: number;
}

interface DecisionTree2QuestionSetup {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
}

interface DecisionTree2Solution {
  selectedRules: number[];
  userSelections: Record<string, string>;
  userCombinations?: CombinationAnswer[];
  currentSelection?: Record<string, string>;
}

export class DecisionTree2QuestionModel extends IQuestion implements IAttempt {
  private questionSetup: DecisionTree2QuestionSetup;
  private selectedRules: number[];
  private userSelections: Record<string, string>;
  private userCombinations: CombinationAnswer[];
  private currentSelection: Record<string, string>;
  private attemptDuration: number;
  private attemptIsDraft: boolean;
  private undoStack: DecisionTree2Solution[];
  private redoStack: DecisionTree2Solution[];

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
      finishes: [],
      goals: [],
    };
    this.selectedRules = [];
    this.userSelections = {};
    this.userCombinations = [];
    this.currentSelection = {};
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
    const solution: CombinationAnswer[] = this.getUserCombinations();
    return JSON.stringify(solution);
  }

  loadAnswer(json: string) {
    try {
      const solution = JSON.parse(json) as CombinationAnswer[];
      if (Array.isArray(solution)) {
        this.setUserCombinations(solution);
      } else {
        const legacySolution = solution as DecisionTree2Solution;
        if (legacySolution.userCombinations) {
          this.setUserCombinations(legacySolution.userCombinations);
        }
        if (legacySolution.userSelections) {
          this.userSelections = legacySolution.userSelections;
        }
        if (legacySolution.selectedRules) {
          this.selectedRules = legacySolution.selectedRules;
        }
      }
    } catch (error) {
      console.error("Error loading solution:", error);
      this.setUserCombinations([]);
      this.userSelections = {};
      this.selectedRules = [];
    }
  }

  populateQuestionFromString(questionString: string): void {
    try {
      const questionData = JSON.parse(
        questionString
      ) as DecisionTree2QuestionSetup;
      this.questionSetup = questionData;
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
    const userCombinations = this.getUserCombinations();

    if (userCombinations.length === 0) return false;

    const goalRules = this.getGoalRules();
    if (goalRules.length === 0) return false;

    const triggeredRuleIds = new Set(
      userCombinations.map((combo) => combo.ruleId)
    );

    const allGoalRuleIds = goalRules.map((rule) => rule.id);
    const canTriggerAllGoals = allGoalRuleIds.every((ruleId) =>
      triggeredRuleIds.has(ruleId)
    );

    return canTriggerAllGoals;
  }

  resetToInitialState(): void {
    this.selectedRules = [];
    this.userSelections = {};
    this.userCombinations = [];
    this.undoStack = [];
    this.redoStack = [];
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;

    const currentState: DecisionTree2Solution = {
      selectedRules: [...this.selectedRules],
      userSelections: { ...this.userSelections },
      userCombinations: [...this.userCombinations],
    };
    this.redoStack.push(currentState);

    const previousState = this.undoStack.pop()!;
    this.selectedRules = [...previousState.selectedRules];
    this.userSelections = { ...previousState.userSelections };
    this.userCombinations = [...(previousState.userCombinations || [])];

    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;

    const currentState: DecisionTree2Solution = {
      selectedRules: [...this.selectedRules],
      userSelections: { ...this.userSelections },
      userCombinations: [...this.userCombinations],
    };
    this.undoStack.push(currentState);

    const nextState = this.redoStack.pop()!;
    this.selectedRules = [...nextState.selectedRules];
    this.userSelections = { ...nextState.userSelections };
    this.userCombinations = [...(nextState.userCombinations || [])];

    return true;
  }

  getRules(): Rule[] {
    return this.questionSetup.rules;
  }

  getFinishes(): Finish[] {
    return this.questionSetup.finishes;
  }

  getGoals(): number[] {
    return this.questionSetup.goals;
  }

  getSelectedRules(): number[] {
    return [...this.selectedRules];
  }

  getUserSelections(): Record<string, string> {
    return { ...this.userSelections };
  }

  getUserCombinations(): CombinationAnswer[] {
    return [...this.userCombinations];
  }

  setUserCombinations(combinations: CombinationAnswer[]): void {
    this.userCombinations = [...combinations];
  }

  addUserCombination(parts: Record<string, string>, ruleId: number): void {
    const currentCombinations = this.getUserCombinations();
    const newCombination: CombinationAnswer = { parts, ruleId };
    const updatedCombinations = [...currentCombinations, newCombination];
    this.setUserCombinations(updatedCombinations);
  }

  getSavedCombinations(): Array<Record<string, string>> {
    return this.getUserCombinations().map((combo) => combo.parts);
  }

  setSavedCombinations(combinations: Array<Record<string, string>>): void {
    const combinationsWithRules: CombinationAnswer[] = combinations.map(
      (parts) => {
        const matchingRule = this.questionSetup.rules.find((rule) =>
          rule.conditions.every(
            (condition) => parts[condition.attribute] === condition.value
          )
        );
        return {
          parts,
          ruleId: matchingRule?.id || 0,
        };
      }
    );
    this.setUserCombinations(combinationsWithRules);
  }

  setSelection(attribute: string, value: string): void {
    const currentState: DecisionTree2Solution = {
      selectedRules: [...this.selectedRules],
      userSelections: { ...this.userSelections },
      userCombinations: [...this.userCombinations],
    };
    this.undoStack.push(currentState);
    this.redoStack = [];

    this.userSelections[attribute] = value;
    this.selectedRules = [];
  }

  toggleRuleSelection(ruleId: number): void {
    const currentState: DecisionTree2Solution = {
      selectedRules: [...this.selectedRules],
      userSelections: { ...this.userSelections },
      userCombinations: [...this.userCombinations],
    };
    this.undoStack.push(currentState);
    this.redoStack = [];

    const index = this.selectedRules.indexOf(ruleId);
    if (index === -1) {
      this.selectedRules.push(ruleId);
    } else {
      this.selectedRules.splice(index, 1);
    }
  }

  getMatchingRules(): Rule[] {
    return this.questionSetup.rules.filter((rule) =>
      rule.conditions.every((condition) => {
        const userValue = this.userSelections[condition.attribute];
        return userValue === condition.value;
      })
    );
  }

  getGoalRules(): Rule[] {
    return this.questionSetup.rules.filter((rule) =>
      this.questionSetup.goals.includes(rule.finish)
    );
  }

  isRuleSelectable(ruleId: number): boolean {
    const rule = this.questionSetup.rules.find((r) => r.id === ruleId);
    if (!rule) return false;

    const matchesSelections = rule.conditions.every((condition) => {
      const userValue = this.userSelections[condition.attribute];
      return userValue === condition.value;
    });

    const leadsToGoal = this.questionSetup.goals.includes(rule.finish);

    return matchesSelections && leadsToGoal;
  }
}
