import { useCallback, useState, useEffect } from 'react';
import { RingCipherCreateModel } from '@/models/ring-cipher/ring-cipher.create.model';

interface UseRingCipherCreatorProps {
  question: RingCipherCreateModel | null;
  markAsChanged: () => void;
}

interface RingValidation {
  isValid: boolean;
  missingLetters: string[];
  duplicateLetters: string[];
  extraLetters: string[];
}

export const useRingCipherCreator = ({
  question,
  markAsChanged
}: UseRingCipherCreatorProps) => {
  // Local state
  const [ringLetters, setRingLetters] = useState<string[]>([]);
  const [plaintext, setPlaintext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [validation, setValidation] = useState<RingValidation>({
    isValid: false,
    missingLetters: [],
    duplicateLetters: [],
    extraLetters: []
  });

  // Load existing data when question changes
  useEffect(() => {
    if (question) {
      const content = question.getContent();
      setPlaintext(content.question?.plaintext || '');
      setPrompt(content.question?.prompt || '');
      setRingLetters(content.rings?.map((ring) => ring.letters.join('')) || []);
      updateValidation();
    }
  }, [question]);

  // Update validation when ring letters change
  useEffect(() => {
    updateValidation();
  }, [ringLetters, question]);

  // Update validation state
  const updateValidation = useCallback(() => {
    if (question) {
      const validationResult = question.validateRings();
      setValidation(validationResult);
    }
  }, [question]);

  // Handle ring count change
  const handleRingCountChange = useCallback(
    (count: number) => {
      if (!question) return;

      // Collect all existing letters from all rings
      let allLetters = ringLetters
        .join('')
        .split('')
        .filter((l) => l.trim() !== '');
      // Ensure all alphabet letters are present
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const uniqueLetters = new Set(allLetters.map((l) => l.toUpperCase()));
      alphabet.forEach((l) => uniqueLetters.add(l));
      allLetters = Array.from(uniqueLetters);

      // Shuffle to randomize which letters are kept if reducing
      if (allLetters.length > 0) {
        for (let i = allLetters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
        }
      }

      // Set new ring count in the model
      question.setRingCount(count);

      // Distribute letters evenly across new rings
      const newRingLetters = Array.from({ length: count }, () => '');
      allLetters.forEach((letter, idx) => {
        const rIdx = idx % count;
        newRingLetters[rIdx] += letter;
      });
      // Update model with new letters
      newRingLetters.forEach((letters, idx) => {
        question.setRingLetters(idx, letters.split(''));
      });

      markAsChanged();
      setRingLetters(newRingLetters);
    },
    [question, markAsChanged, ringLetters]
  );

  // Handle ring letters change
  const handleRingLettersChange = useCallback(
    (ringIndex: number, letters: string) => {
      if (!question) return;

      const letterArray = letters
        .toUpperCase()
        .split('')
        .filter((l) => /[A-Z]/.test(l));
      question.setRingLetters(ringIndex, letterArray);
      markAsChanged();

      // Update local state
      const newRingLetters = [...ringLetters];
      newRingLetters[ringIndex] = letters.toUpperCase();
      setRingLetters(newRingLetters);
    },
    [question, markAsChanged, ringLetters]
  );

  // Handle question content change
  const handleQuestionChange = useCallback(
    (newPlaintext: string, newPrompt: string) => {
      if (!question) return;

      question.setQuestion(newPlaintext, newPrompt);
      markAsChanged();
      setPlaintext(newPlaintext);
      setPrompt(newPrompt);
    },
    [question, markAsChanged]
  );

  // Shuffle letters across rings
  const handleShuffle = useCallback(() => {
    if (!question) return;

    // Always use the full alphabet for shuffling
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Shuffle the alphabet
    for (let i = alphabet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
    }

    const count = question.rings.length;
    const newRingLetters = Array.from({ length: count }, () => '');
    alphabet.forEach((letter, idx) => {
      const rIdx = idx % count;
      newRingLetters[rIdx] += letter;
    });
    newRingLetters.forEach((letters, idx) => {
      question.setRingLetters(idx, letters.split(''));
    });

    markAsChanged();
    setRingLetters(newRingLetters);
    updateValidation();
  }, [question, markAsChanged, updateValidation]);

  // Check if content is valid for submission
  const isContentValid = useCallback(() => {
    return question?.validateForSubmission() || false;
  }, [question]);

  // Get rings data
  const rings = question?.rings || [];

  return {
    // State
    ringLetters,
    plaintext,
    prompt,
    rings,
    validation,

    // Computed
    isContentValid: isContentValid(),

    // Actions
    handleRingCountChange,
    handleRingLettersChange,
    handleQuestionChange,
    handleShuffle
  };
};
