import { IQuestion, IAttempt, AttemptData } from "../../interfaces/question";
import { QuestionType } from "@/constants/questionTypes";

interface RingCipherRing {
    id: number;
    letters: string[];
    currentPosition: number; // Current rotation position (0 = first letter at marker)
}

interface RingCipherConfig {
    ringCount: number;
    markerPosition: number; // Always at 12 o'clock (position 0)
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
        encrypted: string;
        steps: Array<{
            letter: string;
            ringId: number;
            initialPosition: number;
            stepsToRotate: number;
            finalPosition: number;
            code: string;
        }>;
    };
}

export class RingCipherQuestion extends IQuestion implements IAttempt {
    private content: RingCipherContent;
    private currentState: {
        ringPositions: number[]; // Current position of each ring
        encryptedMessage: string;
        steps: Array<{
            letter: string;
            ringId: number;
            initialPosition: number;
            stepsToRotate: number;
            finalPosition: number;
            code: string;
        }>;
    };
    private history: Array<typeof this.currentState>;
    private historyIndex: number;
    private userId: string | undefined;
    private attemptDuration: number;
    private attemptStatus: 'paused' | 'completed';

    constructor(id: string, title: string, isGenerated: boolean, duration: number, startTime: Date) {
        super(id, title, isGenerated, 'ring-cipher', duration, startTime);
        this.history = [];
        this.historyIndex = -1;
        this.attemptDuration = 0;
        this.attemptStatus = 'paused';
        this.content = {
            problemType: '',
            config: {
                ringCount: 3,
                markerPosition: 0
            },
            rings: [],
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
            ringPositions: [],
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

    private resetToInitialState(): void {
        // All rings start with their first letter at the marker (position 0)
        this.currentState = {
            ringPositions: this.content.rings.map(() => 0),
            encryptedMessage: "",
            steps: []
        };
        this.history = [JSON.parse(JSON.stringify(this.currentState))];
        this.historyIndex = 0;
    }

    getCurrentState() {
        return this.currentState;
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
        
        // Calculate clockwise steps needed
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
            code
        };
        
        this.currentState.steps.push(step);
        
        return code;
    }

    // Navigation methods
    goBack(): boolean {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentState = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            return true;
        }
        return false;
    }

    goForward(): boolean {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.currentState = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            return true;
        }
        return false;
    }

    reset(): void {
        this.resetToInitialState();
    }

    saveState(): void {
        // Remove any future history when saving a new state
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(this.currentState)));
        this.historyIndex = this.history.length - 1;
    }

    // IAttempt implementation
    setAttemptData(userId: string, duration: number, status: 'paused' | 'completed'): void {
        this.userId = userId;
        this.attemptDuration = duration;
        this.attemptStatus = status;
    }

    getAttemptData(): AttemptData {
        return {
            userId: this.userId || '',
            questionId: this.id,
            duration: this.attemptDuration,
            status: this.attemptStatus,
            answer: this.currentState.encryptedMessage,
            steps: this.currentState.steps
        };
    }

    getContent() {
        return this.content;
    }
} 