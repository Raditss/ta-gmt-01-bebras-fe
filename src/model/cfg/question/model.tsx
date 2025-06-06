import { QuestionType } from "@/constants/questionTypes";
import { IQuestion, IAttempt, AttemptData } from "@/model/interfaces/question";
import { State, Rule, Step, CfgQuestionSetup, CfgSolution } from "./types";

export class Question extends IQuestion implements IAttempt {
    private questionSetup: CfgQuestionSetup;
    private currentState: State[];
    private rules: Rule[];
    private steps: Step[];
    private redoStack: Step[];
    private userId: string | undefined;
    private attemptDuration: number;
    private attemptStatus: 'paused' | 'completed';

    constructor(id: string, title: string, questionType: QuestionType, isGenerated: boolean, duration: number) {
        const now = new Date();
        super(id, title, isGenerated, questionType, duration, now);
        
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
        this.attemptStatus = 'paused';
    }

    // IAttempt implementation
    setAttemptData(userId: string, duration: number, status: 'paused' | 'completed') {
        this.userId = userId;
        this.attemptDuration = duration;
        this.attemptStatus = status;
    }

    getAttemptData(): AttemptData {
        if (!this.userId) {
            throw new Error('No user ID set for this attempt');
        }
        return {
            questionId: this.getId(),
            userId: this.userId,
            duration: this.attemptDuration,
            status: this.attemptStatus,
            solution: this.toJSON()
        };
    }

    toJSON(): string {
        const solution: CfgSolution = {
            currentState: this.currentState,
            steps: this.steps
        };
        return JSON.stringify(solution);
    }

    loadSolution(json: string) {
        const solution = JSON.parse(json) as CfgSolution;
        this.resetToInitialState();
        solution.steps.forEach(step => {
            this.applyRule(step.ruleId, step.index, step.replacedCount);
        });
    }

    // IQuestion implementation
    populateQuestionFromString(questionString: string): void {
        try {
            const questionData = JSON.parse(questionString) as CfgQuestionSetup;
            this.questionSetup = questionData;
            this.resetToInitialState();
        } catch (error) {
            console.error('Error parsing question data:', error);
            throw new Error('Invalid question data format');
        }
    }

    questionToString(): string {
        return JSON.stringify(this.questionSetup);
    }

    checkAnswer(): boolean {
        if (this.steps.length === 0) return false;
        
        const finalState = this.steps[this.steps.length - 1].endState;
        
        if (finalState.length !== this.questionSetup.endState.length) return false;
        
        return finalState.every((state, index) => 
            state.type === this.questionSetup.endState[index].type
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
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return false;

        const newState = [...this.currentState];
        newState.splice(index, count, ...rule.after);

        const step: Step = {
            ruleId,
            index,
            replacedCount: count,
            endState: newState
        };

        this.steps.push(step);
        this.redoStack = [];
        this.currentState = newState;

        return true;
    }
}
