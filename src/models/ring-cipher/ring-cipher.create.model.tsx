import { ICreateQuestion } from '../interfaces/create-question.model';
import { Question } from '@/types/question.type';

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
  question: {
    task: string;
    plaintext: string;
    prompt: string;
  };
}

export class RingCipherCreateModel extends ICreateQuestion {
  private content: RingCipherContent;

  constructor(draft: Question) {
    super(draft);
    this.content = {
      problemType: 'ring_cipher',
      config: {
        ringCount: 3,
        markerPosition: 0
      },
      rings: [
        { id: 1, letters: ['A', 'E', 'I', 'O', 'U', 'Y'], currentPosition: 0 },
        {
          id: 2,
          letters: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
          currentPosition: 0
        },
        {
          id: 3,
          letters: ['N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'],
          currentPosition: 0
        }
      ],
      question: {
        task: 'encrypt',
        plaintext: '',
        prompt: ''
      }
    };
    this.populateFromContentString(this.draft.content);
  }

  get rings(): RingCipherRing[] {
    return this.content.rings;
  }

  set rings(value: RingCipherRing[]) {
    this.content.rings = value;
  }

  get config(): RingCipherConfig {
    return this.content.config;
  }

  get question(): RingCipherContent['question'] {
    return this.content.question;
  }

  toJson(): string {
    return JSON.stringify(this.content);
  }

  populateFromContentString(content: string | RingCipherContent): void {
    try {
      let parsed: RingCipherContent;

      // Handle both string and object content
      if (typeof content === 'string') {
        if (content && content.trim() !== '' && content !== '{}') {
          parsed = JSON.parse(content) as RingCipherContent;
        } else {
          return; // Keep default values
        }
      } else if (typeof content === 'object' && content !== null) {
        parsed = content as RingCipherContent;
      } else {
        return; // Keep default values
      }

      // Preserve existing data, only use defaults when data is truly missing
      this.content = {
        problemType: parsed.problemType ?? 'ring_cipher',
        config: {
          ringCount: parsed.config?.ringCount ?? 3,
          markerPosition: parsed.config?.markerPosition ?? 0
        },
        rings: parsed.rings ?? [
          {
            id: 1,
            letters: ['A', 'E', 'I', 'O', 'U', 'Y'],
            currentPosition: 0
          },
          {
            id: 2,
            letters: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
            currentPosition: 0
          },
          {
            id: 3,
            letters: ['N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'],
            currentPosition: 0
          }
        ],
        question: {
          task: parsed.question?.task ?? 'encrypt',
          plaintext: parsed.question?.plaintext ?? '',
          prompt: parsed.question?.prompt ?? ''
        }
      };
    } catch (error) {
      console.error('Error parsing Ring Cipher creation content:', error);
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
      this.content.rings &&
      this.content.rings.length > 0 &&
      this.content.rings.every((ring) => ring.letters.length > 0)
    );
  }

  // Separate method for final submission validation
  validateForSubmission(): boolean {
    return (
      this.hasRequiredContent() &&
      this.validateRings().isValid &&
      this.content.question.prompt.trim().length > 0
    );
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
      this.content.rings[ringIndex].letters = letters.map((l) =>
        l.toUpperCase()
      );
    }
  }

  setQuestion(plaintext: string, prompt: string): void {
    this.content.question = {
      task: 'encrypt',
      plaintext,
      prompt
    };
  }

  validateRings(): {
    isValid: boolean;
    missingLetters: string[];
    duplicateLetters: string[];
    extraLetters: string[];
  } {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const allLetters = this.content.rings.flatMap((ring) => ring.letters);
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
    const ringCount = this.content.rings.length;

    // Collect all existing letters from all rings
    const allLetters = this.content.rings
      .flatMap((ring) => ring.letters)
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

    // Clear existing letters
    this.content.rings.forEach((ring) => (ring.letters = []));

    // Redistribute shuffled letters evenly across rings
    allLetters.forEach((letter, index) => {
      const ringIndex = index % ringCount;
      this.content.rings[ringIndex].letters.push(letter);
    });
  }

  getContent(): RingCipherContent {
    return this.content;
  }
}
