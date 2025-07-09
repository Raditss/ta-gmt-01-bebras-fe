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
}

interface RingCipherAnswer {
  ringPositions: number[];
  encryptedMessage: [number, number][];
}

export class RingCipherSolveModel extends IQuestion implements IAttempt {
  private content: RingCipherContent;
  private answer: RingCipherAnswer;
  // answer.ringPositions always contains the current position of every ring.
  // Each ring can be in a different state than the start, and this is preserved after each encryption.
  private undoStack: RingCipherAnswer[];
  private attemptDuration: number;
  private attemptIsDraft: boolean;

  constructor(id: number) {
    super(id, QuestionTypeEnum.RING_CIPHER);
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
    };
    this.answer = {
      ringPositions: [],
      encryptedMessage: [],
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
    // Initialize all ring positions to 0 (start), one entry per ring
    this.answer = {
      ringPositions: this.content.rings.map(() => 0),
      encryptedMessage: [],
    };
    this.undoStack = [];
  }

  // Encryption helpers
  private findLetterRing(letter: string): number {
    return this.content.rings.findIndex((ring) =>
      ring.letters.includes(letter.toUpperCase())
    );
  }

  private getLetterPositionInRing(ringId: number, letter: string): number {
    const ring = this.content.rings[ringId];
    return ring ? ring.letters.indexOf(letter.toUpperCase()) : -1;
  }

  private calculateStepsToRotate(ringId: number, letterPosition: number): number {
    const currentPosition = this.answer.ringPositions[ringId];
    const targetPosition = letterPosition;
    const ring = this.content.rings[ringId];
    const ringSize = ring.letters.length;
    return (targetPosition - currentPosition + ringSize) % ringSize;
  }

  private rotateRing(ringId: number, steps: number): void {
    // Only update the position of the specific ring, others remain unchanged
    const ring = this.content.rings[ringId];
    const newPosition = (this.answer.ringPositions[ringId] + steps) % ring.letters.length;
    this.answer.ringPositions[ringId] = newPosition;
  }

  encryptLetter(letter: string): [number, number] | null {
    const ringId = this.findLetterRing(letter);
    if (ringId === -1) return null;
    const letterPosition = this.getLetterPositionInRing(ringId, letter);
    if (letterPosition === -1) return null;
    const stepsToRotate = this.calculateStepsToRotate(ringId, letterPosition);
    // Save current state for undo
    const prevState: RingCipherAnswer = {
      ringPositions: [...this.answer.ringPositions],
      encryptedMessage: [...this.answer.encryptedMessage],
    };
    this.undoStack.push(prevState);
    // Rotate the ring
    this.rotateRing(ringId, stepsToRotate);
    // Record the step
    this.answer.encryptedMessage.push([ringId + 1, stepsToRotate]);
    return [ringId + 1, stepsToRotate];
  }

  getAnswer(): RingCipherAnswer {
    return this.answer;
  }

  getContent(): RingCipherContent {
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
      answer: this.toJSON(),
    };
  }

  toJSON(): string {
    return JSON.stringify(this.answer);
  }

  loadAnswer(json: string): void {
    const answer = JSON.parse(json) as RingCipherAnswer;
    // Restore all ring positions, or default to all 0 if missing
    this.answer.ringPositions = answer.ringPositions && answer.ringPositions.length === this.content.rings.length
      ? answer.ringPositions
      : this.content.rings.map(() => 0);
    this.answer.encryptedMessage = answer.encryptedMessage || [];
  }
} 