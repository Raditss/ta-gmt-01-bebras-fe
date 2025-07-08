import { QuestionTypeEnum } from "@/types/question-type.type";
import { IAttempt, IQuestion } from "@/models/interfaces/question.model";
import { QuestionAttemptData } from "@/types/question-attempt.type";

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
        encrypted: [number, number][];
    };
}

interface CipherSolutionState {
    currentVertex: number;
    encryptedMessage: [number, number][];
}

export class CipherNSolveModel extends IQuestion implements IAttempt {
    private content: CipherContent;
    private currentState: CipherSolutionState;
    private undoStack: CipherSolutionState[];
    private redoStack: CipherSolutionState[];
    private attemptDuration: number;
    private attemptIsDraft: boolean;

    constructor(id: number,) {
        super(id, QuestionTypeEnum.CIPHER_N,);
        this.content = {
            config: {
                vertexCount: 0,
                polygonName: '',
                startingVertex: 0,
                isClockwise: true,
            },
            vertices: [],
            instructions: [],
            example: {
                plaintext: '',
                encrypted: '',
                explanation: '',
            },
            question: {
                task: '',
                plaintext: '',
                prompt: '',
            },
            answer: {
                encrypted: [],
            },
        };
        this.currentState = {
            currentVertex: 0,
            encryptedMessage: [],
        };
        this.undoStack = [];
        this.redoStack = [];
        this.attemptDuration = 0;
        this.attemptIsDraft = true;
    }

    populateQuestionFromString(questionString: string): void {
        this.content = JSON.parse(questionString);
        this.resetToInitialState();
    }

    checkAnswer(): boolean {
        const a = this.currentState.encryptedMessage;
        const b = this.content.answer.encrypted;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i][0] !== b[i][0] || a[i][1] !== b[i][1]) return false;
        }
        return true;
    }

    questionToString(): string {
        return JSON.stringify(this.content);
    }

    undo(): boolean {
        if (this.undoStack.length === 0) return false;
        const currentState: CipherSolutionState = {
            currentVertex: this.currentState.currentVertex,
            encryptedMessage: [...this.currentState.encryptedMessage],
        };
        this.redoStack.push(currentState);
        const previousState = this.undoStack.pop()!;
        this.currentState = {
            currentVertex: previousState.currentVertex,
            encryptedMessage: [...previousState.encryptedMessage],
        };
        return true;
    }

    redo(): boolean {
        if (this.redoStack.length === 0) return false;
        const currentState: CipherSolutionState = {
            currentVertex: this.currentState.currentVertex,
            encryptedMessage: [...this.currentState.encryptedMessage],
        };
        this.undoStack.push(currentState);
        const nextState = this.redoStack.pop()!;
        this.currentState = {
            currentVertex: nextState.currentVertex,
            encryptedMessage: [...nextState.encryptedMessage],
        };
        return true;
    }

    resetToInitialState(): void {
        this.currentState = {
            currentVertex: this.content.config.startingVertex,
            encryptedMessage: [],
        };
        this.undoStack = [];
        this.redoStack = [];
    }

    // Encryption helpers
    private findVertexWithLetter(letter: string): number {
        return this.content.vertices.findIndex((vertex) =>
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

    encryptLetter(letter: string): [number, number] | null {
        const targetVertex = this.findVertexWithLetter(letter);
        if (targetVertex === -1) return null;
        const rotation = this.calculateRotation(this.currentState.currentVertex, targetVertex);
        const position = this.getLetterPosition(targetVertex, letter);
        // Save current state for undo
        const prevState: CipherSolutionState = {
            currentVertex: this.currentState.currentVertex,
            encryptedMessage: [...this.currentState.encryptedMessage],
        };
        this.undoStack.push(prevState);
        this.redoStack = [];
        // Update state
        this.currentState = {
            currentVertex: targetVertex,
            encryptedMessage: [
                ...this.currentState.encryptedMessage,
                [rotation, position],
            ],
        };
        return [rotation, position];
    }

    getCurrentState(): CipherSolutionState {
        return this.currentState;
    }

    getContent(): CipherContent {
        return this.content;
    }

    // IAttempt implementation
    setAttemptData(duration: number, isDraft: boolean = true) {
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
        const solution = {
            currentState: this.currentState,
            undoStack: this.undoStack,
            redoStack: this.redoStack,
        };
        return JSON.stringify(solution);
    }

    loadAnswer(json: string): void {
        try {
            const solution = JSON.parse(json);
            this.currentState = solution.currentState;
            this.undoStack = solution.undoStack || [];
            this.redoStack = solution.redoStack || [];
        } catch (error) {
            console.error('Error loading solution:', error);
        }
    }
}