import { useCallback, useState, useEffect } from 'react';
import { CipherCreateModel } from '@/models/cipher-n/cipher-n.create.model';

interface UseCipherNCreatorProps {
  question: CipherCreateModel | null;
  markAsChanged: () => void;
}

interface PolygonOption {
  value: number;
  name: string;
}

interface AlphabetValidation {
  isValid: boolean;
  missingLetters: string[];
  duplicateLetters: string[];
  extraLetters: string[];
}

const POLYGON_OPTIONS: PolygonOption[] = [
  { value: 4, name: 'square' },
  { value: 5, name: 'pentagon' },
  { value: 6, name: 'hexagon' },
  { value: 7, name: 'heptagon' },
  { value: 8, name: 'octagon' },
  { value: 9, name: 'nonagon' },
  { value: 10, name: 'decagon' }
];

export const useCipherNCreator = ({
  question,
  markAsChanged
}: UseCipherNCreatorProps) => {
  // Local state
  const [vertexLetters, setVertexLetters] = useState<string[]>([]);
  const [plaintext, setPlaintext] = useState('');
  const [prompt, setPrompt] = useState('');
  const [alphabetValidation, setAlphabetValidation] =
    useState<AlphabetValidation>({
      isValid: false,
      missingLetters: [],
      duplicateLetters: [],
      extraLetters: []
    });
  const [configUpdateTrigger, setConfigUpdateTrigger] = useState(0);

  // Update validation state
  const updateAlphabetValidation = useCallback(() => {
    if (question) {
      const validation = question.validateAlphabet();
      setAlphabetValidation(validation);
    }
  }, [question]);

  // Load existing data when question changes
  useEffect(() => {
    if (question) {
      const content = question.getContent();
      setPlaintext(content.question?.plaintext || '');
      setPrompt(content.question?.prompt || '');
      setVertexLetters(content.vertices?.map((vertex) => vertex.letters) || []);
    }
  }, [question]);

  // Update alphabet validation when vertices change
  useEffect(() => {
    updateAlphabetValidation();
  }, [vertexLetters, question, updateAlphabetValidation]);

  // Handle vertex count change
  const handleVertexCountChange = useCallback(
    (count: number) => {
      if (!question) return;

      const polygonOption = POLYGON_OPTIONS.find((opt) => opt.value === count);
      question.setConfig({
        vertexCount: count,
        polygonName: polygonOption?.name || 'polygon'
      });

      // Collect all existing letters from all vertices
      const allLetters = vertexLetters
        .join('')
        .split('')
        .filter((l) => l.trim() !== '');

      // If reducing, trim excess letters
      if (allLetters.length > 0) {
        // Shuffle to randomize which letters are kept if reducing
        for (let i = allLetters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
        }
        // Only keep as many as needed (optional: or keep all and distribute)
      }

      // Distribute letters evenly across new vertices
      const newVertices = Array.from({ length: count }, (_, index) => ({
        pos: index,
        letters: ''
      }));
      allLetters.forEach((letter, idx) => {
        const vIdx = idx % count;
        newVertices[vIdx].letters += letter;
      });

      question.setVertices(newVertices);
      markAsChanged();

      // Update local state
      setVertexLetters(newVertices.map((v) => v.letters));
    },
    [question, markAsChanged, vertexLetters]
  );

  // Handle vertex letters change
  const handleVertexLettersChange = useCallback(
    (vertexIndex: number, letters: string) => {
      if (!question) return;

      const updatedVertices = question.vertices.map((vertex, index) =>
        index === vertexIndex
          ? { ...vertex, letters: letters.toUpperCase() }
          : vertex
      );

      question.setVertices(updatedVertices);
      markAsChanged();

      // Update local state
      const newVertexLetters = [...vertexLetters];
      newVertexLetters[vertexIndex] = letters.toUpperCase();
      setVertexLetters(newVertexLetters);
    },
    [question, markAsChanged, vertexLetters]
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

  // Handle config change
  const handleConfigChange = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!question) return;

      question.setConfig({ [key]: value });
      markAsChanged();

      // Force re-render by updating state trigger
      setConfigUpdateTrigger((prev) => prev + 1);
    },
    [question, markAsChanged]
  );

  // Shuffle letters across vertices
  const handleShuffle = useCallback(() => {
    if (!question) return;

    // Always use the full alphabet for shuffling
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Shuffle the alphabet
    for (let i = alphabet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alphabet[i], alphabet[j]] = [alphabet[j], alphabet[i]];
    }

    const count = question.config.vertexCount;
    const newVertices = Array.from({ length: count }, (_, index) => ({
      pos: index,
      letters: ''
    }));
    alphabet.forEach((letter, idx) => {
      const vIdx = idx % count;
      newVertices[vIdx].letters += letter;
    });

    question.setVertices(newVertices);
    markAsChanged();

    // Update local state immediately
    setVertexLetters(newVertices.map((v) => v.letters));
    setConfigUpdateTrigger((prev) => prev + 1);
    updateAlphabetValidation();
  }, [question, markAsChanged, updateAlphabetValidation]);

  // Check if content is valid for submission
  const isContentValid = useCallback(() => {
    return question?.validateForSubmission() || false;
  }, [question]);

  // Check if vertices are valid
  const isVerticesValid = useCallback(() => {
    return question?.validateVertices() || false;
  }, [question]);

  // Get current data - trigger re-render when config changes
  const config = question?.config;
  const vertices = question?.vertices || [];

  // Use configUpdateTrigger to ensure config changes are reflected
  useEffect(() => {
    // This effect runs when configUpdateTrigger changes, ensuring re-render
  }, [configUpdateTrigger]);

  return {
    // State
    vertexLetters,
    plaintext,
    prompt,
    vertices,
    config,
    alphabetValidation,

    // Constants
    polygonOptions: POLYGON_OPTIONS,

    // Computed
    isContentValid: isContentValid(),
    isVerticesValid: isVerticesValid(),

    // Actions
    handleVertexCountChange,
    handleVertexLettersChange,
    handleQuestionChange,
    handleConfigChange,
    handleShuffle
  };
};
