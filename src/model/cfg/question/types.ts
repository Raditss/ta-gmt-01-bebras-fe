export interface State {
    id: number;
    type: string;
}

export interface Rule {
    id: string;
    before: State[];
    after: State[];
}

export interface Step {
    ruleId: string;
    index: number;
    replacedCount: number;
    endState: State[];
}

export interface CfgQuestionSetup {
    startState: State[];
    endState: State[];
    rules: Rule[];
    steps: Step[];
}

export interface CfgSolution {
    currentState: State[];
    steps: Step[];
} 