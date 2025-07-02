import { QuestionType } from "@/constants/questionTypes";
import { IQuestion, IAttempt, AttemptData } from "@/model/interfaces/question";

interface Condition {
  attribute: string;
  operator: string;
  value: string;
}

export interface Rule {
  id: number;
  conditions: Condition[];
  finish: number; // Points to a finish ID
}

export interface Finish {
  id: number;
  name: string;
}

export interface CombinationAnswer {
  parts: Record<string, string>; // Monster parts combination
  ruleId: number; // Rule ID that this combination triggers
}

interface DecisionTree2QuestionSetup {
  rules: Rule[];
  finishes: Finish[];
  goals: number[]; // Array of finish IDs that are goals
}

interface DecisionTree2Solution {
  selectedRules: number[]; // Array of selected rule IDs (deprecated)
  userSelections: Record<string, string>; // Current temporary selection (old format)
  userCombinations?: CombinationAnswer[]; // ANSWER: Array of combinations with rule IDs
  currentSelection?: Record<string, string>; // Current temporary selection being built
}

export class DecisionTree2Question extends IQuestion implements IAttempt {
  private questionSetup: DecisionTree2QuestionSetup;
  private selectedRules: number[];
  private userSelections: Record<string, string>; // Current temporary selection (old format)
  private userCombinations: CombinationAnswer[]; // ANSWER: Array of combinations with rule IDs
  private currentSelection: Record<string, string>; // Current temporary selection
  private userId: string | undefined;
  private attemptDuration: number;
  private attemptStatus: "paused" | "completed";
  private undoStack: DecisionTree2Solution[];
  private redoStack: DecisionTree2Solution[];

  constructor(
    id: string,
    title: string,
    questionType: QuestionType,
    isGenerated: boolean,
    duration: number
  ) {
    const now = new Date();
    super(id, title, isGenerated, questionType, duration, now);

    this.questionSetup = {
      rules: [],
      finishes: [],
      goals: [],
    };
    this.selectedRules = [];
    this.userSelections = {}; // Current temporary selection (old format)
    this.userCombinations = []; // ANSWER: Array of combinations with rule IDs
    this.currentSelection = {}; // Current temporary selection
    this.undoStack = [];
    this.redoStack = [];
    this.attemptDuration = 0;
    this.attemptStatus = "paused";
  }

  setAttemptData(
    userId: string,
    duration: number,
    status: "paused" | "completed"
  ) {
    this.userId = userId;
    this.attemptDuration = duration;
    this.attemptStatus = status;
  }

  getAttemptData(): AttemptData {
    if (!this.userId) {
      throw new Error("No user ID set for this attempt");
    }
    return {
      questionId: this.getId(),
      userId: this.userId,
      duration: this.attemptDuration,
      status: this.attemptStatus,
      solution: this.toJSON(),
    };
  }

  toJSON(): string {
    // The solution is directly an array of CombinationAnswer objects
    const solution: CombinationAnswer[] = this.getUserCombinations();
    return JSON.stringify(solution);
  }

  loadSolution(json: string) {
    try {
      const solution = JSON.parse(json) as CombinationAnswer[];
      // If it's the new format (array of CombinationAnswer)
      if (Array.isArray(solution)) {
        this.setUserCombinations(solution);
      } else {
        // Handle legacy format for backward compatibility
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
      // Reset to empty state if parsing fails
      this.setUserCombinations([]);
      this.userSelections = {};
      this.selectedRules = [];
    }
  }

  // IQuestion implementation
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
    // The answer should be combinations that can trigger ALL goal rules
    const userCombinations = this.getUserCombinations();

    if (userCombinations.length === 0) return false;

    // Find all goal rules (rules that lead to goal finishes)
    const goalRules = this.getGoalRules();
    if (goalRules.length === 0) return false;

    // Get all rule IDs that can be triggered by the user's combinations
    const triggeredRuleIds = new Set(
      userCombinations.map((combo) => combo.ruleId)
    );

    // Check if ALL goal rules can be triggered
    const allGoalRuleIds = goalRules.map((rule) => rule.id);
    const canTriggerAllGoals = allGoalRuleIds.every((ruleId) =>
      triggeredRuleIds.has(ruleId)
    );

    return canTriggerAllGoals;
  }

  resetToInitialState(): void {
    this.selectedRules = [];
    this.userSelections = {};
    this.userCombinations = []; // Reset the answer combinations
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

  // Decision Tree 2 specific methods
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

  // Get the answer: array of combinations with rule IDs
  getUserCombinations(): CombinationAnswer[] {
    return [...this.userCombinations];
  }

  // Set the answer: array of combinations with rule IDs
  setUserCombinations(combinations: CombinationAnswer[]): void {
    this.userCombinations = [...combinations];
  }

  // Add a single combination to the answer
  addUserCombination(parts: Record<string, string>, ruleId: number): void {
    const currentCombinations = this.getUserCombinations();
    const newCombination: CombinationAnswer = { parts, ruleId };
    const updatedCombinations = [...currentCombinations, newCombination];
    this.setUserCombinations(updatedCombinations);
  }

  // Legacy methods for backward compatibility
  getSavedCombinations(): Array<Record<string, string>> {
    return this.getUserCombinations().map((combo) => combo.parts);
  }

  setSavedCombinations(combinations: Array<Record<string, string>>): void {
    // Convert to new format - need to calculate rule IDs
    const combinationsWithRules: CombinationAnswer[] = combinations.map(
      (parts) => {
        // Find which rule this combination can trigger
        const matchingRule = this.questionSetup.rules.find((rule) =>
          rule.conditions.every(
            (condition) => parts[condition.attribute] === condition.value
          )
        );
        return {
          parts,
          ruleId: matchingRule?.id || 0, // fallback to 0 if no rule found
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
    // Clear selected rules when new selection is made as they may no longer be valid
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

  // Get rules that match current user selections
  getMatchingRules(): Rule[] {
    return this.questionSetup.rules.filter((rule) =>
      rule.conditions.every((condition) => {
        const userValue = this.userSelections[condition.attribute];
        return userValue === condition.value;
      })
    );
  }

  // Get rules that lead to goal finishes
  getGoalRules(): Rule[] {
    return this.questionSetup.rules.filter((rule) =>
      this.questionSetup.goals.includes(rule.finish)
    );
  }

  // Check if a rule is selectable (matches current selections and leads to a goal)
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
