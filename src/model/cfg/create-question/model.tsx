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

export interface CfgCreationContent {
    rules: Rule[];
    startState: State[];
    endState: State[];
    steps: Step[];
}

export class CfgCreateQuestion extends ICreateQuestion {
    rules: Rule[];
    startState: State[];
    endState: State[];
    private initialEndState: State[];
    private steps: Step[];
    private redoStack: Step[];

    constructor(
        title: string,
        description: string = '',
        difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy',
        category: string = 'Context-Free Grammar',
        points: number = 100,
        estimatedTime: number = 30,
        author: string = '',
        id?: string,
        creatorId?: string
    ) {
        super(title, description, difficulty, category, points, estimatedTime, author, id, creatorId);
        this.rules = [];
        this.startState = [];
        this.endState = [];
        this.initialEndState = [];
        this.steps = [];
        this.redoStack = [];
    }

    // Implementation of abstract methods
    contentToString(): string {
        const content: CfgCreationContent = {
            rules: this.rules,
            startState: this.startState,
            endState: this.endState,
            steps: this.steps
        };
        
        const jsonString = JSON.stringify(content);
        console.log('📝 CFG CONTENT TO STRING - Generated content:', {
            rulesCount: this.rules.length,
            startStateCount: this.startState.length,
            endStateCount: this.endState.length,
            stepsCount: this.steps.length,
            contentObject: content,
            jsonString: jsonString,
            jsonLength: jsonString.length
        });
        
        return jsonString;
    }

    populateFromContentString(contentString: string): void {
        console.log('🔄 CFG POPULATE - Starting with content string:', contentString);
        try {
            const content = JSON.parse(contentString) as CfgCreationContent;
            console.log('🔄 CFG POPULATE - Parsed content:', content);
            
            this.rules = content.rules || [];
            this.startState = content.startState || [];
            this.endState = content.endState || [];
            this.initialEndState = [...this.endState];
            this.steps = content.steps || [];
            this.redoStack = [];
            
            console.log('✅ CFG POPULATE - Successfully populated:', {
                rulesCount: this.rules.length,
                startStateCount: this.startState.length,
                endStateCount: this.endState.length,
                stepsCount: this.steps.length
            });
        } catch (error) {
            console.error('❌ CFG POPULATE - Error parsing CFG creation content:', error);
            throw new Error('Invalid CFG creation content format');
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