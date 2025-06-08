import { QuestionType } from "@/constants/questionTypes";

export interface AttemptData {
    questionId: string;
    userId: string;
    duration: number;
    status: 'paused' | 'completed';
    solution: string;
}

export interface IAttempt {
    setAttemptData(userId: string, duration: number, status: 'paused' | 'completed'): void;
    getAttemptData(): AttemptData;
    toJSON(): string;
    loadSolution(json: string): void;
}

export abstract class IQuestion {
    private id: string
    private type: QuestionType
    private title: string
    private isGenerated: boolean
    private duration: number
    private startTime: Date

    constructor(id: string, title: string, isGenerated: boolean, questionType: QuestionType, duration: number, startTime: Date) {
        this.id = id
        this.type = questionType
        this.title = title
        this.isGenerated = isGenerated
        this.duration = duration
        this.startTime = startTime
    }

    abstract populateQuestionFromString(questionString: string): void

    abstract checkAnswer(): boolean

    abstract questionToString(): string

    abstract undo(): boolean

    abstract redo(): boolean

    abstract resetToInitialState(): void

    getId() {
        return this.id
    }

    getTitle() {
        return this.title
    }

    getIsGenerated() {
        return this.isGenerated
    }

    getDuration() {
        return this.duration
    }

    getStartTime() {
        return this.startTime
    }

    getQuestionType() {
        return this.type
    }
}