import { State, Step, Rule } from "../create-question/model";
import { IQuestion, QuestionSetup } from "@/model/interfaces/question";

export class Question extends IQuestion {
    private questionSetup: QuestionSetup;
    private currentState: State[];
    private rules: Rule[];
    private steps: Step[];
    private redoStack: Step[];

    constructor(id: string, title: string, isGenerated: boolean, duration: number) {
        const now = new Date();
        super(id, title, isGenerated, duration, now);
        
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
    }

    populateQuestionFromString(questionString: string): void {
        try {
            const questionData = JSON.parse(questionString) as QuestionSetup;
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

    getCurrentState(): State[] {
        return this.currentState;
    }

    getAvailableRules(): Rule[] {
        return this.rules;
    }

    getSteps(): Step[] {
        return this.steps;
    }

    getQuestionSetup(): QuestionSetup {
        return this.questionSetup;
    }
}
