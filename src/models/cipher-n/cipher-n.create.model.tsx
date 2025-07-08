import { ICreateQuestion } from "../interfaces/create-question.model";

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

export class CreateCipherQuestion extends ICreateQuestion {
    private content: CipherContent;

    constructor(
        title: string,
        description: string = '',
        difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy',
        category: string = '',
        points: number = 0,
        estimatedTime: number = 0,
        author: string = '',
        id?: string,
        creatorId?: string
    ) {
        super(title, description, difficulty, category, points, estimatedTime, author, id, creatorId);
        this.content = {
            problemType: 'polygon_cipher',
            config: {
                vertexCount: 8,
                polygonName: 'octagon',
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
                task: 'encrypt',
                plaintext: '',
                prompt: ''
            },
            answer: {
                encrypted: '',
                steps: []
            }
        };
    }

    contentToString(): string {
        return JSON.stringify(this.content);
    }

    populateFromContentString(contentString: string): void {
        this.content = JSON.parse(contentString);
    }

    // Helper methods for content manipulation
    setVertices(vertices: CipherVertex[]): void {
        this.content.vertices = vertices;
    }

    setInstructions(instructions: string[]): void {
        this.content.instructions = instructions;
    }

    setExample(plaintext: string, encrypted: string, explanation: string): void {
        this.content.example = {
            plaintext,
            encrypted,
            explanation
        };
    }

    setQuestion(plaintext: string, prompt: string): void {
        this.content.question = {
            task: 'encrypt',
            plaintext,
            prompt
        };
    }

    setAnswer(encrypted: string, steps: CipherContent['answer']['steps']): void {
        this.content.answer = {
            encrypted,
            steps
        };
    }

    getContent(): CipherContent {
        return this.content;
    }
}