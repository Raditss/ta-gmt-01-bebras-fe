import { ICreateQuestion } from "../../interfaces/create-question";

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

export class CfgCreateQuestion extends ICreateQuestion {
    rules: Rule[];
    startState: State[];
    endState: State[];
    private initialEndState: State[];
    private steps: Step[];
    private redoStack: Step[];

    constructor(title: string, id?: string, creatorId?: string) {
        super(title, id, creatorId);
        this.rules = [];
        this.startState = [];
        this.endState = [];
        this.initialEndState = [];
        this.steps = [];
        this.redoStack = [];
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
        let currentState = [...this.startState];
        for (const step of this.steps) {
            const rule = this.rules.find(r => r.id === step.ruleId);
            if (!rule) continue;
            
            const replacedCount = step.replacedCount || rule.before.length;
            currentState.splice(step.index, replacedCount);
            currentState.splice(step.index, 0, ...rule.after.map((obj: any, i: number) => ({
                ...obj,
                id: Date.now() + Math.random() + i
            })));
        }
        return currentState;
    }

    replayStepsFromInitialEndState(): State[] {
        let currentState = [...this.initialEndState];
        
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            const rule = this.rules.find(r => r.id === step.ruleId);
            if (!rule) {
                continue;
            }
            
            const replacedCount = step.replacedCount || rule.before.length;
            
            currentState.splice(step.index, replacedCount);
            
            const newItems = rule.after.map((obj: any, idx: number) => ({
                ...obj,
                id: Date.now() + Math.random() + i + idx
            }));
            
            currentState.splice(step.index, 0, ...newItems);
        }
        
        return currentState;
    }
}