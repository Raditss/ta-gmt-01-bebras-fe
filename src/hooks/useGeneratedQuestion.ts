import { useCallback, useEffect, useState } from 'react';
import { IQuestion } from '@/models/interfaces/question.model';
import { QuestionTypeEnum } from '@/types/question-type.type';
import { questionsApi } from '@/lib/api/questions.api';

type GeneratedQuestionConstructionModel<
  GeneratedQuestionModel extends IQuestion
> = new (id: number) => GeneratedQuestionModel;

export const useGeneratedQuestion = <GeneratedQuestionModel extends IQuestion>(
  type: QuestionTypeEnum,
  generatedQuestionModel: GeneratedQuestionConstructionModel<GeneratedQuestionModel>
) => {
  const [question, setQuestion] = useState<GeneratedQuestionModel | null>(null);
  const [questionContent, setQuestionContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFromStorage = useCallback(() => {
    try {
      const storedQuestion = sessionStorage.getItem('generatedQuestion');
      if (!storedQuestion) {
        throw new Error('No generated question found in storage');
      }

      const questionData = JSON.parse(storedQuestion);
      console.log('📖 Loading generated question from storage:', questionData);

      // Create question instance
      const q = new generatedQuestionModel(0); // Generated questions use ID 0

      // Store original question content for API submission
      // Handle content that might already be a string (from backend) or an object
      const contentString = typeof questionData.content === 'string' 
        ? questionData.content 
        : JSON.stringify(questionData.content);
      
      setQuestionContent(contentString);

      // Populate question with generated content
      q.populateQuestionFromString(contentString);

      setQuestion(q);
      setError(null);

      console.log('✅ Generated question loaded successfully');
      return true;
    } catch (err) {
      console.error('❌ Error loading generated question:', err);
      setError(
        `Failed to load generated question: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      return false;
    }
  }, [generatedQuestionModel]);

  const generateNew = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎲 Generating new question for type:', type);

      // Generate new question
      const generatedQuestion = await questionsApi.generateQuestion(type);
      console.log('📝 Generated question received:', generatedQuestion);

      // Store in sessionStorage
      sessionStorage.setItem(
        'generatedQuestion',
        JSON.stringify(generatedQuestion)
      );

      // Load the newly generated question
      const loaded = loadFromStorage();
      if (!loaded) {
        throw new Error('Failed to load newly generated question');
      }
    } catch (err) {
      console.error('❌ Error generating question:', err);
      setError(
        `Failed to generate question: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  }, [type, loadFromStorage]);

  useEffect(() => {
    const initializeQuestion = async () => {
      setLoading(true);

      // Try to load from storage first
      const loaded = loadFromStorage();

      if (!loaded) {
        // If no stored question, generate a new one
        await generateNew();
      } else {
        setLoading(false);
      }
    };

    initializeQuestion();
  }, [loadFromStorage, generateNew]);

  const regenerate = useCallback(async () => {
    // Clear storage and generate new question
    sessionStorage.removeItem('generatedQuestion');
    await generateNew();
  }, [generateNew]);

  return {
    question,
    questionContent, // Original question content for API submission
    loading,
    error,
    regenerate // Function to generate a new question
  };
};
