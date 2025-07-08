import { QuestionTypeEnum } from "@/types/question-type.type";
import { IAttempt, IQuestion } from "@/models/interfaces/question.model";
import { QuestionAttemptData } from "@/types/question-attempt.type";

interface RingCipherRing {
    id: number;
    letters: string[];
    currentPosition: number;
}

interface RingCipherConfig {
    ringCount: number;
    markerPosition: number;
}

interface RingCipherContent {
    problemType: string;
    config: RingCipherConfig;
    rings: RingCipherRing[];
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

interface RingCipherSolutionState {
    ringPositions: number[];
    encryptedMessage: [number, number][];
}

export class RingCipherSolveModel extends IQuestion implements IAttempt {
    private content: RingCipherContent;
    private currentState: RingCipherSolutionState;
    private undoStack: RingCipherSolutionState[];
    private redoStack: RingCipherSolutionState[];
    private attemptDuration: number;
    private attemptIsDraft: boolean;

    constructor(
        id: number,
    ) {
        super(id, QuestionTypeEnum.RING_CIPHER,);
        this.content = {
            problemType: '',
            config: {
                ringCount: 3,
                markerPosition: 0,
            },
            rings: [],
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
            ringPositions: [],
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
        return this.currentState.encryptedMessage === this.content.answer.encrypted;
    }

    questionToString(): string {
        return JSON.stringify(this.content);
    }

    undo(): boolean {
        if (this.undoStack.length === 0) return false;
        const currentState: RingCipherSolutionState = JSON.parse(JSON.stringify(this.currentState));
        this.redoStack.push(currentState);
        const previousState = this.undoStack.pop()!;
        this.currentState = JSON.parse(JSON.stringify(previousState));
        return true;
    }

    redo(): boolean {
        if (this.redoStack.length === 0) return false;
        const currentState: RingCipherSolutionState = JSON.parse(JSON.stringify(this.currentState));
        this.undoStack.push(currentState);
        const nextState = this.redoStack.pop()!;
        this.currentState = JSON.parse(JSON.stringify(nextState));
        return true;
    }

    resetToInitialState(): void {
        this.currentState = {
            ringPositions: this.content.rings.map(() => 0),
            encryptedMessage: [],
        };
        this.undoStack = [];
        this.redoStack = [];
    }

    // Ring cipher specific methods
    findLetterRing(letter: string): number {
        return this.content.rings.findIndex(ring =>
            ring.letters.includes(letter.toUpperCase())
        );
    }

    getLetterPositionInRing(ringId: number, letter: string): number {
        const ring = this.content.rings[ringId];
        return ring ? ring.letters.indexOf(letter.toUpperCase()) : -1;
    }

    calculateStepsToRotate(ringId: number, letterPosition: number): number {
        const currentPosition = this.currentState.ringPositions[ringId];
        const targetPosition = letterPosition;
        const ring = this.content.rings[ringId];
        const ringSize = ring.letters.length;
        return (targetPosition - currentPosition + ringSize) % ringSize;
    }

    rotateRing(ringId: number, steps: number): void {
        const ring = this.content.rings[ringId];
        const newPosition = (this.currentState.ringPositions[ringId] + steps) % ring.letters.length;
        this.currentState.ringPositions[ringId] = newPosition;
    }

    encryptLetter(letter: string): string | null {
        const ringId = this.findLetterRing(letter);
        if (ringId === -1) return null;
        const letterPosition = this.getLetterPositionInRing(ringId, letter);
        if (letterPosition === -1) return null;
        const stepsToRotate = this.calculateStepsToRotate(ringId, letterPosition);
        const initialPosition = this.currentState.ringPositions[ringId];
        // Save current state for undo
        const prevState: RingCipherSolutionState = JSON.parse(JSON.stringify(this.currentState));
        this.undoStack.push(prevState);
        this.redoStack = [];
        // Rotate the ring
        this.rotateRing(ringId, stepsToRotate);
        const finalPosition = this.currentState.ringPositions[ringId];
        const code = `${ringId + 1}${stepsToRotate}`;
        // Record the step
        const step = {
            letter: letter.toUpperCase(),
            ringId: ringId + 1,
            initialPosition,
            stepsToRotate,
            finalPosition,
            code,
        };
        this.currentState.encryptedMessage.push([ringId + 1, stepsToRotate]);
        return code;
    }

    getCurrentState(): RingCipherSolutionState {
        return this.currentState;
    }

    getContent(): RingCipherContent {
        return this.content;
    }

    // IAttempt implementation
    setAttemptData(duration: number, isDraft: boolean = true): void {
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