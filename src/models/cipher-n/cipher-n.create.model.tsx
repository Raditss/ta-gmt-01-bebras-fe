import { ICreateQuestion } from '../interfaces/create-question.model';
import { Question } from '@/types/question.type';

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
  question: {
    task: string;
    plaintext: string;
    prompt: string;
  };
}

export class CipherCreateModel extends ICreateQuestion {
  private content: CipherContent;

  constructor(draft: Question) {
    super(draft);
    this.content = {
      problemType: 'polygon_cipher',
      config: {
        vertexCount: 8,
        polygonName: 'octagon',
        startingVertex: 0,
        isClockwise: true
      },
      vertices: [],
      question: {
        task: 'encrypt',
        plaintext: '',
        prompt: ''
      }
    };
    this.populateFromContentString(this.draft.content);
  }

  get vertices(): CipherVertex[] {
    return this.content.vertices;
  }

  set vertices(value: CipherVertex[]) {
    this.content.vertices = value;
  }

  get config(): CipherConfig {
    return this.content.config;
  }

  get question(): CipherContent['question'] {
    return this.content.question;
  }

  toJson(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(content: string | CipherContent): void {
    try {
      let parsed: CipherContent;

      // Handle both string and object content
      if (typeof content === 'string') {
        if (content && content.trim() !== '' && content !== '{}') {
          parsed = JSON.parse(content) as CipherContent;
        } else {
          return; // Keep default values
        }
      } else if (typeof content === 'object' && content !== null) {
        parsed = content as CipherContent;
      } else {
        return; // Keep default values
      }

      // Preserve existing data, only use defaults when data is truly missing
      this.content = {
        problemType: parsed.problemType ?? 'polygon_cipher',
        config: {
          vertexCount: parsed.config?.vertexCount ?? 8,
          polygonName: parsed.config?.polygonName ?? 'octagon',
          startingVertex: parsed.config?.startingVertex ?? 0,
          isClockwise: parsed.config?.isClockwise ?? true
        },
        vertices: parsed.vertices ?? [],
        question: {
          task: parsed.question?.task ?? 'encrypt',
          plaintext: parsed.question?.plaintext ?? '',
          prompt: parsed.question?.prompt ?? ''
        }
      };
    } catch (error) {
      console.error('Error parsing Cipher-N creation content:', error);
      // Keep default values from constructor if parsing fails
    }
  }

  validateContent(): boolean {
    // Allow saving drafts with minimal content
    // Only require basic structure to exist
    return true;
  }

  hasRequiredContent(): boolean {
    return (
      this.content.vertices &&
      this.content.vertices.length > 0 &&
      this.content.vertices.every((vertex) => vertex.letters.trim().length > 0)
    );
  }

  // Separate method for final submission validation
  validateForSubmission(): boolean {
    return (
      this.hasRequiredContent() &&
      this.validateVertices() &&
      this.content.question.prompt.trim().length > 0 &&
      this.validateAlphabet().isValid
    );
  }

  setVertices(vertices: CipherVertex[]): void {
    this.content.vertices = vertices;
  }

  setQuestion(plaintext: string, prompt: string): void {
    this.content.question = {
      task: 'encrypt',
      plaintext,
      prompt
    };
  }

  setConfig(config: Partial<CipherConfig>): void {
    this.content.config = { ...this.content.config, ...config };
  }

  validateVertices(): boolean {
    if (!this.content.vertices || this.content.vertices.length === 0) {
      return false;
    }

    // Check if all vertices have letters
    const hasAllLetters = this.content.vertices.every(
      (vertex) => vertex.letters && vertex.letters.trim().length > 0
    );

    // Check if vertex count matches config
    const countMatches =
      this.content.vertices.length === this.content.config.vertexCount;

    return hasAllLetters && countMatches;
  }

  validateAlphabet(): {
    isValid: boolean;
    missingLetters: string[];
    duplicateLetters: string[];
    extraLetters: string[];
  } {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const allLetters = this.content.vertices.flatMap((vertex) =>
      vertex.letters.split('')
    );
    const uniqueLetters = [...new Set(allLetters)];

    const missingLetters = alphabet.filter(
      (letter) => !uniqueLetters.includes(letter)
    );
    const extraLetters = uniqueLetters.filter(
      (letter) => !alphabet.includes(letter)
    );

    // Find duplicates
    const letterCounts: { [key: string]: number } = {};
    allLetters.forEach((letter) => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    const duplicateLetters = Object.keys(letterCounts).filter(
      (letter) => letterCounts[letter] > 1
    );

    return {
      isValid:
        missingLetters.length === 0 &&
        duplicateLetters.length === 0 &&
        extraLetters.length === 0,
      missingLetters,
      duplicateLetters,
      extraLetters
    };
  }

  shuffleLetters(): void {
    const vertexCount = this.content.config.vertexCount;

    // Collect all existing letters from all vertices
    const allLetters = this.content.vertices
      .flatMap((vertex) => vertex.letters.split(''))
      .filter((letter) => letter.trim() !== '');

    // If no letters exist, use the full alphabet
    if (allLetters.length === 0) {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      allLetters.push(...alphabet);
    }

    // Shuffle the letters randomly
    for (let i = allLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
    }

    // Create new vertices
    const newVertices = Array.from({ length: vertexCount }, (_, index) => ({
      pos: index,
      letters: ''
    }));

    // Redistribute shuffled letters evenly across vertices
    allLetters.forEach((letter, index) => {
      const vertexIndex = index % vertexCount;
      newVertices[vertexIndex].letters += letter;
    });

    this.content.vertices = newVertices;
  }

  getContent(): CipherContent {
    return this.content;
  }
}
