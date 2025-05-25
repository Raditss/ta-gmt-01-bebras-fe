import { Rule, State, Step } from "../cfg/create-question/model";

export interface QuestionSetup {
    startState: State[];
    endState: State[];
    rules: Rule[];
    steps: Step[];
}

export abstract class IQuestion {
    private id: string
    private title: string
    private isGenerated: boolean
    private duration: number
    private startTime: Date

    constructor(id: string, title: string, isGenerated: boolean, duration: number, startTime: Date) {
        this.id = id
        this.title = title
        this.isGenerated = isGenerated
        this.duration = duration
        this.startTime = startTime
    }

    abstract populateQuestionFromString(questionString: string): void

    abstract checkAnswer(): boolean

    abstract questionToString(): string
}