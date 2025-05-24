import { ICreateQuestion } from "../interfaces/create-question";

export interface Rule {
    id: string;
    before: any;
    after: any;
}

export interface State {
    id: number;
    type: string;
}

export interface Step {
    ruleId: string;
    index: number;
    replacedCount?: number; // Track how many items were replaced
}

export class CfgCreateQuestion extends ICreateQuestion {
    rules: Rule[];
    startState: State[];
    endState: State[];
    private initialEndState: State[]; // Store the initial end state for proper undo/redo
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
        // Reset steps when setting a new initial end state
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
            console.log('Popped step:', step, 'Remaining steps:', this.steps.length, 'Redo stack:', this.redoStack.length);
        }
        return step;
    }

    redoStep(): Step | undefined {
        const step = this.redoStack.pop();
        if (step) {
            this.steps.push(step);
            console.log('Redid step:', step, 'Current steps:', this.steps.length, 'Redo stack:', this.redoStack.length);
        }
        return step;
    }

    // Original method - replays from start state (for different use cases)
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

    // New method - replays from initial end state (for undo/redo in end state editing)
    replayStepsFromInitialEndState(): State[] {
        let currentState = [...this.initialEndState];
        console.log('Replaying from initial end state:', currentState.length, 'items');
        console.log('Steps to replay:', this.steps.length);
        
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            const rule = this.rules.find(r => r.id === step.ruleId);
            if (!rule) {
                console.log('Rule not found for step:', step.ruleId);
                continue;
            }
            
            const replacedCount = step.replacedCount || rule.before.length;
            console.log(`Step ${i}: replacing ${replacedCount} items at index ${step.index} with ${rule.after.length} items`);
            
            // Remove the items that were replaced
            currentState.splice(step.index, replacedCount);
            
            // Add the new items with unique IDs
            const newItems = rule.after.map((obj: any, idx: number) => ({
                ...obj,
                id: Date.now() + Math.random() + i + idx // More unique ID generation
            }));
            
            currentState.splice(step.index, 0, ...newItems);
            console.log('State after step:', currentState.length, 'items');
        }
        
        console.log('Final replayed state:', currentState.length, 'items');
        return currentState;
    }
}