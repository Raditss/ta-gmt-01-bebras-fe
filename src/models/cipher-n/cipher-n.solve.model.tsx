import { QuestionTypeEnum } from '@/types/question-type.type';
import { IAttempt, IQuestion } from '@/models/interfaces/question.model';
import { QuestionAttemptData } from '@/types/question-attempt.type';

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

}

interface CipherNAnswer {
  currentVertex: number;
  encryptedMessage: [number, number][];
}

export class CipherNSolveModel extends IQuestion implements IAttempt {
  private content: CipherContent;
  private answer: CipherNAnswer;
  private undoStack: CipherNAnswer[];
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.CIPHER_N);
    this.content = {
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
    };
    this.answer = {
      currentVertex: 0,
      encryptedMessage: []
    };
    this.undoStack = [];
    this.attemptDuration = 0;
    this.attemptIsDraft = true;
  }

  populateQuestionFromString(questionString: string): void {
    this.content = JSON.parse(questionString);
    this.resetToInitialState();
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;
    this.answer = this.undoStack.pop()!;
    return true;
  }


  resetToInitialState(): void {
    this.answer = {
      currentVertex: this.content.config.startingVertex,
      encryptedMessage: []
    };
    this.undoStack = [];
  }

  // Encryption helpers
  private findVertexWithLetter(letter: string): number {
    return this.content.vertices.findIndex((vertex) =>
      vertex.letters.includes(letter.toUpperCase())
    );
  }

  private getLetterPosition(vertex: number, letter: string): number {
    return (
      this.content.vertices[vertex].letters.indexOf(letter.toUpperCase()) + 1
    );
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
    const rotation = this.calculateRotation(
      this.answer.currentVertex,
      targetVertex
    );
    const position = this.getLetterPosition(targetVertex, letter);
    // Save current state for undo
    const prevState: CipherNAnswer = {
      currentVertex: this.answer.currentVertex,
      encryptedMessage: [...this.answer.encryptedMessage]
    };
    this.undoStack.push(prevState);
    // Update state
    this.answer = {
      currentVertex: targetVertex,
      encryptedMessage: [
        ...this.answer.encryptedMessage,
        [rotation, position]
      ]
    };
    return [rotation, position];
  }

  getAnswer(): CipherNAnswer {
    return this.answer;
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
      questionId: this.id,
      duration: this.attemptDuration,
      isDraft: this.attemptIsDraft,
      answer: this.toJSON()
    };
  }

  toJSON(): string {
    return JSON.stringify(this.answer);
  }

  loadAnswer(json: string): void {
    const answer = JSON.parse(json) as CipherNAnswer;
    this.answer.currentVertex = answer.currentVertex || this.content.config.startingVertex;
    this.answer.encryptedMessage = answer.encryptedMessage || [];
  }
}
