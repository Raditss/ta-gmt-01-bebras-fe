import { QuestionType } from "@/constants/questionTypes";
import { Rule, State, Step } from "../cfg/create-question/model";

export interface QuestionSetup {
    startState: State[];
    endState: State[];
    rules: Rule[];
    steps: Step[];
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