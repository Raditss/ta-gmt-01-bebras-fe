import { IQuestion, IAttempt, AttemptData } from "../../interfaces/question";
import { QuestionType } from "@/constants/questionTypes";

interface CipherVertex {
    pos: number;
    letters: string;
}

interface CipherConfig {
    vertexCount: number;
    polygonName: string;
    startingVertex: number;
    isClockwise: boolean;
}

interface CipherContent {
    problemType: string;
    config: CipherConfig;
    vertices: CipherVertex[];
    instructions: string[];
    example: {
        plaintext: string;
        encrypted: string;
        explanation: string;
    };
    question: {
        task: string;
        plaintext: string;
        prompt: string;
    };
    answer: {
        encrypted: string;
        steps: Array<{
            letter: string;
            from: number;
            rotation: number;
            to: number;
            pos: number;
            code: string;
        }>;
    };
}

export class CipherQuestion extends IQuestion implements IAttempt {
    private content: CipherContent;
    private currentState: {
        currentVertex: number;
        encryptedMessage: string;
        steps: Array<{
            letter: string;
            from: number;
            rotation: number;
            to: number;
            pos: number;
            code: string;
        }>;
    };
    private history: Array<typeof this.currentState>;
    private historyIndex: number;
    private userId: string | undefined;
    private attemptDuration: number;
    private attemptStatus: 'paused' | 'completed';

    constructor(id: string, title: string, isGenerated: boolean, duration: number, startTime: Date) {
        super(id, title, isGenerated, 'cipher', duration, startTime);
        this.history = [];
        this.historyIndex = -1;
        this.attemptDuration = 0;
        this.attemptStatus = 'paused';
        this.content = {
            problemType: '',
            config: {
                vertexCount: 0,
                polygonName: '',
                startingVertex: 0,
                isClockwise: true
            },
            vertices: [],
            instructions: [],
            example: {
                plaintext: '',
                encrypted: '',
                explanation: ''
            },
            question: {
                task: '',
                plaintext: '',
                prompt: ''
            },
            answer: {
                encrypted: '',
                steps: []
            }
        };
        this.currentState = {
            currentVertex: 0,
            encryptedMessage: "",
            steps: []
        };
    }

    populateQuestionFromString(questionString: string): void {
        this.content = JSON.parse(questionString);
        this.resetToInitialState();
    }

    checkAnswer(): boolean {
        return this.currentState.encryptedMessage === this.content.answer.encrypted;
    }

    questionToString(): string {
        return JSON.stringify(this.content);
    }

    undo(): boolean {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentState = { ...this.history[this.historyIndex] };
            return true;
        }
        return false;
    }

    redo(): boolean {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentState = { ...this.history[this.historyIndex] };
            return true;
        }
        return false;
    }

    resetToInitialState(): void {
        this.currentState = {
            currentVertex: this.content.config.startingVertex,
            encryptedMessage: "",
            steps: []
        };
        this.history = [this.currentState];
        this.historyIndex = 0;
    }

    // Helper methods for encryption
    private findVertexWithLetter(letter: string): number {
        return this.content.vertices.findIndex(vertex => 
            vertex.letters.includes(letter.toUpperCase())
        );
    }

    private getLetterPosition(vertex: number, letter: string): number {
        return this.content.vertices[vertex].letters.indexOf(letter.toUpperCase()) + 1;
    }

    private calculateRotation(from: number, to: number): number {
        const vertexCount = this.content.config.vertexCount;
        if (this.content.config.isClockwise) {
            return (to - from + vertexCount) % vertexCount;
        } else {
            return (from - to + vertexCount) % vertexCount;
        }
    }

    private encryptLetter(letter: string): string {
        const targetVertex = this.findVertexWithLetter(letter);
        if (targetVertex === -1) return "";

        const rotation = this.calculateRotation(this.currentState.currentVertex, targetVertex);
        const position = this.getLetterPosition(targetVertex, letter);
        const code = `${rotation}${position}`;

        const newState = {
            currentVertex: targetVertex,
            encryptedMessage: this.currentState.encryptedMessage 
                ? `${this.currentState.encryptedMessage}-${code}`
                : code,
            steps: [
                ...this.currentState.steps,
                {
                    letter,
                    from: this.currentState.currentVertex,
                    rotation,
                    to: targetVertex,
                    pos: position,
                    code
                }
            ]
        };

        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(newState);
        this.historyIndex++;
        this.currentState = newState;

        return code;
    }

    getCurrentState() {
        return this.currentState;
    }

    getContent() {
        return this.content;
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
        return JSON.stringify({
            currentState: this.currentState,
            history: this.history,
            historyIndex: this.historyIndex
        });
    }

    loadSolution(json: string): void {
        try {
            const solution = JSON.parse(json);
            this.currentState = solution.currentState;
            this.history = solution.history;
            this.historyIndex = solution.historyIndex;
        } catch (error) {
            console.error('Error loading solution:', error);
        }
    }
} 