import { ICreateQuestion } from "../interfaces/create-question.model";
import {Question} from "@/types/question.type";

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

export class RingCipherCreateModel extends ICreateQuestion {
    private content: RingCipherContent;

    constructor(
      _question: Question
    ) {
        super(_question);
        this.content = {
            problemType: 'ring_cipher',
            config: {
                ringCount: 3,
                markerPosition: 0
            },
            rings: [
                { id: 1, letters: ['A', 'E', 'I', 'O', 'U', 'Y'], currentPosition: 0 },
                { id: 2, letters: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'], currentPosition: 0 },
                { id: 3, letters: ['N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'], currentPosition: 0 }
            ],
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

    getQuestionType(): string {
        return 'ring-cipher';
    }

    setRingCount(count: number): void {
        this.content.config.ringCount = count;
        
        // Adjust rings array to match count
        while (this.content.rings.length > count) {
            this.content.rings.pop();
        }
        while (this.content.rings.length < count) {
            const newId = this.content.rings.length + 1;
            this.content.rings.push({
                id: newId,
                letters: [],
                currentPosition: 0
            });
        }
    }

    setRingLetters(ringIndex: number, letters: string[]): void {
        if (ringIndex >= 0 && ringIndex < this.content.rings.length) {
            this.content.rings[ringIndex].letters = letters.map(l => l.toUpperCase());
        }
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

    setAnswer(encrypted: string, steps: RingCipherContent['answer']['steps']): void {
        this.content.answer = {
            encrypted,
            steps
        };
    }

    // Helper methods for encryption logic
    findLetterRing(letter: string): number {
        return this.content.rings.findIndex(ring => 
            ring.letters.includes(letter.toUpperCase())
        );
    }

    getLetterPositionInRing(ringId: number, letter: string): number {
        const ring = this.content.rings[ringId];
        return ring ? ring.letters.indexOf(letter.toUpperCase()) : -1;
    }

    encryptMessage(plaintext: string): {
        encrypted: string;
        steps: Array<{
            letter: string;
            ringId: number;
            initialPosition: number;
            stepsToRotate: number;
            finalPosition: number;
            code: string;
        }>;
    } {
        // Initialize ring positions (all start at 0)
        const ringPositions = this.content.rings.map(() => 0);
        const steps: any[] = [];
        const codes: string[] = [];

        for (const char of plaintext.toUpperCase()) {
            if (char.match(/[A-Z]/)) {
                const ringIndex = this.findLetterRing(char);
                if (ringIndex !== -1) {
                    const letterPosition = this.getLetterPositionInRing(ringIndex, char);
                    const initialPosition = ringPositions[ringIndex];
                    
                    // Calculate steps needed to rotate ring clockwise to bring letter to marker
                    const ring = this.content.rings[ringIndex];
                    const stepsToRotate = (letterPosition - initialPosition + ring.letters.length) % ring.letters.length;
                    
                    // Update ring position
                    ringPositions[ringIndex] = letterPosition;
                    
                    const code = `${ringIndex + 1}${stepsToRotate}`;
                    codes.push(code);
                    
                    steps.push({
                        letter: char,
                        ringId: ringIndex + 1,
                        initialPosition,
                        stepsToRotate,
                        finalPosition: letterPosition,
                        code
                    });
                }
            }
        }

        return {
            encrypted: codes.join('-'),
            steps
        };
    }

    // Validation methods
    validateRings(): {
        isValid: boolean;
        missingLetters: string[];
        duplicateLetters: string[];
        extraLetters: string[];
    } {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const allLetters = this.content.rings.flatMap(ring => ring.letters);
        const uniqueLetters = [...new Set(allLetters)];
        
        const missingLetters = alphabet.filter(letter => !uniqueLetters.includes(letter));
        const extraLetters = uniqueLetters.filter(letter => !alphabet.includes(letter));
        
        // Find duplicates
        const letterCounts: { [key: string]: number } = {};
        allLetters.forEach(letter => {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        });
        const duplicateLetters = Object.keys(letterCounts).filter(letter => letterCounts[letter] > 1);
        
        return {
            isValid: missingLetters.length === 0 && duplicateLetters.length === 0 && extraLetters.length === 0,
            missingLetters,
            duplicateLetters,
            extraLetters
        };
    }

    autoDistributeAlphabet(): void {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const ringCount = this.content.rings.length;
        
        // Clear existing letters
        this.content.rings.forEach(ring => ring.letters = []);
        
        // Distribute letters evenly
        alphabet.forEach((letter, index) => {
            const ringIndex = index % ringCount;
            this.content.rings[ringIndex].letters.push(letter);
        });
    }

    getContent(): RingCipherContent {
        return this.content;
    }

    // TODO
    hasRequiredContent(): boolean {
        return false;
    }

    // TODO
    validateContent(): boolean {
        return false;
    }
} 