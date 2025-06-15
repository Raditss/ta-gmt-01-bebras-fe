import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { creationService, CreationData } from '@/services/creationService';
import { ICreateQuestion } from '@/model/interfaces/create-question';
import { QuestionType } from '@/constants/questionTypes';

export interface CreationHookParams {
  questionId: string;
  questionType: QuestionType;
  initialData?: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    points: number;
    estimatedTime: number;
    author: string;
  };
  createQuestionInstance: (data: CreationData) => ICreateQuestion;
}

export const useCreation = ({
  questionId,
  questionType,
  initialData,
  createQuestionInstance
}: CreationHookParams) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState<ICreateQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<Date | null>(null);
  
  const shouldSaveCreation = useRef(true);
  const isNewQuestion = questionId === 'new';

  // Initialize creation session
  useEffect(() => {
    const initializeCreation = async () => {
      // Allow initialization without user for preview, but will need user for saving
      if (!user?.id) {
        console.log('User not authenticated - creating question for preview mode');
      }

      try {
        setLoading(true);
        setError(null);

        let creationData: CreationData;

        if (isNewQuestion) {
          // Creating a new question
          // Use provided initial data or default values for fresh questions
          const defaultData = {
            title: 'Untitled Question',
            description: '',
            difficulty: 'Easy' as const,
            category: questionType === 'cfg' ? 'Context-Free Grammar' : 'General',
            points: 100,
            estimatedTime: 30,
            author: user?.name || 'Anonymous'
          };

          const dataToUse = initialData || defaultData;

          creationData = await creationService.createQuestion(
            user?.id?.toString() || 'temp-user',
            questionType,
            dataToUse
          );
        } else {
          // Loading existing creation
          try {
            creationData = await creationService.getCreationData(questionId);
          } catch (err) {
            console.error('Failed to load existing creation:', err);
            setError(`Failed to load question with ID: ${questionId}`);
            setLoading(false);
            return;
          }
        }

        // Create question instance
        let questionInstance;
        try {
          questionInstance = createQuestionInstance(creationData);
        } catch (createError) {
          console.error('Failed to create question instance:', createError);
          setError('Failed to create question instance');
          setLoading(false);
          return;
        }
        
        // Set metadata from creation data
        try {
          questionInstance.setId(creationData.questionId);
          questionInstance.setCreatorId(creationData.creatorId);
          questionInstance.setTitle(creationData.title);
          questionInstance.setDescription(creationData.description);
          questionInstance.setDifficulty(creationData.difficulty);
          questionInstance.setCategory(creationData.category);
          questionInstance.setPoints(creationData.points);
          questionInstance.setEstimatedTime(creationData.estimatedTime);
          questionInstance.setAuthor(creationData.author);
          questionInstance.setIsDraft(creationData.isDraft);
        } catch (metaError) {
          console.error('Failed to set question metadata:', metaError);
          setError('Failed to initialize question metadata');
          setLoading(false);
          return;
        }
        
        // Populate from content if available
        if (creationData.content && creationData.content !== '{}') {
          try {
            questionInstance.populateFromContentString(creationData.content);
          } catch (contentError) {
            console.warn('Failed to populate content, starting fresh:', contentError);
            // Don't fail the entire initialization if content parsing fails
            // Just log the error and continue with empty content
          }
        }

        setQuestion(questionInstance);
        
        // New questions start with unsaved changes, existing ones don't
        const hasChanges = isNewQuestion;
        setHasUnsavedChanges(hasChanges);
        
        if (creationData.lastModified) {
          const lastModified = new Date(creationData.lastModified);
          setLastSavedDraft(lastModified);
        }
      } catch (err) {
        console.error('Failed to initialize creation:', err);
        setError(err instanceof Error ? err.message : 'Failed to load creation');
      } finally {
        setLoading(false);
      }
    };

    // Only initialize if we have required data
    if (questionId && questionType) {
      initializeCreation();
    } else {
      setLoading(false);
      setError('Missing required data for question creation');
    }
  }, [questionId, questionType, user, initialData, createQuestionInstance, isNewQuestion]);

  const createCreationData = useCallback((): CreationData => {
    if (!question) {
      throw new Error('Question not available');
    }

    if (!user?.id) {
      throw new Error('User not authenticated - cannot save');
    }

    const data = {
      questionId: question.getId() || `temp-${Date.now()}`,
      creatorId: user.id.toString(),
      title: question.getTitle(),
      description: question.getDescription(),
      difficulty: question.getDifficulty(),
      category: question.getCategory(),
      points: question.getPoints(),
      estimatedTime: question.getEstimatedTime(),
      author: question.getAuthor(),
      questionType,
      content: question.contentToString(),
      isDraft: question.getIsDraft(),
      lastModified: new Date()
    };
    
    return data;
  }, [question, user, questionType]);

  const saveDraftInternal = useCallback(async (): Promise<void> => {
    if (!question || saving) {
      return;
    }

    if (!user?.id) {
      setError('Please log in to save your work');
      return;
    }

    try {
      setSaving(true);
      const creationData = createCreationData();
      
      console.log('Saving draft with data:', creationData);
      // TODO: Replace with actual backend call
      // await fetch('/api/questions/drafts', { method: 'POST', body: JSON.stringify(creationData) });
      await creationService.saveDraft(creationData);
      
      // Update question ID if it was newly created
      if (!question.getId() && creationData.questionId) {
        console.log('Updating question ID from temp to:', creationData.questionId);
        question.setId(creationData.questionId);
      }
      
      const now = new Date();
      setLastSavedDraft(now);
      setHasUnsavedChanges(false);
      console.log('Draft saved successfully at:', now);
    } catch (err) {
      console.error('Failed to save draft:', err);
      setError('Failed to save draft');
    } finally {
      setSaving(false);
    }
  }, [question, user, saving, createCreationData]);

  // Note: Removed auto-save timer - only save on navigation/leave like solve page

  // Handle beforeunload event for draft protection
  useEffect(() => {
    if (!shouldSaveCreation.current) return;

    const saveCreationOnExit = async () => {
      if (!question || !hasUnsavedChanges || !user?.id) return;

      console.log('Saving creation on exit...');
      const creationData = createCreationData();
      creationService.saveDraftSync(creationData);
      console.log('Draft saved on exit');
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!question || !user?.id || !hasUnsavedChanges) return;

      console.log('Before unload - saving draft...');
      e.preventDefault();
      e.returnValue = '';
      
      const creationData = createCreationData();
      creationService.saveDraftSync(creationData);
      console.log('Draft saved before unload');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save creation on unmount only if not submitting
      if (question && user?.id && shouldSaveCreation.current) {
        saveCreationOnExit();
      }
    };
  }, [question, user, hasUnsavedChanges, createCreationData]);

  const saveDraft = useCallback(async (): Promise<void> => {
    console.log('Manual save draft triggered');
    await saveDraftInternal();
  }, [saveDraftInternal]);

  const submitCreation = useCallback(async (): Promise<void> => {
    if (!question) {
      throw new Error('Question not available');
    }

    if (!user?.id) {
      throw new Error('User not authenticated - cannot submit');
    }

    try {
      console.log('Starting creation submission...');
      setSaving(true);
      shouldSaveCreation.current = false; // Prevent auto-save on exit

      // Set as published
      question.setIsDraft(false);
      
      const creationData = createCreationData();
      
      console.log('Submitting creation with data:', creationData);
      // TODO: Replace with actual backend call
      // await fetch('/api/questions', { method: 'POST', body: JSON.stringify(creationData) });
      await creationService.submitCreation(creationData);
      
      setHasUnsavedChanges(false);
      console.log('Creation submitted successfully');
    } catch (err) {
      console.error('Failed to submit creation:', err);
      shouldSaveCreation.current = true; // Re-enable auto-save on error
      throw err;
    } finally {
      setSaving(false);
    }
  }, [question, user, createCreationData]);

  const markAsChanged = useCallback(() => {
    console.log('Marking creation as changed');
    setHasUnsavedChanges(true);
  }, []);

  return {
    question,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged
  };
}; 