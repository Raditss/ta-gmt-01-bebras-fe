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
          // Creating a new question - don't make backend calls yet
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

          if (!user?.id) {
            setError('Please log in to create questions');
            setLoading(false);
            return;
          }

          // For new questions, create a temporary local instance
          // Backend creation will happen when user saves draft or submits
          console.log('🆕 CREATING NEW QUESTION - Using temporary ID, no backend call');
          creationData = {
            questionId: `temp-${Date.now()}`,
            creatorId: user.id.toString(),
            ...dataToUse,
            questionType,
            content: '{}',
            isDraft: true,
            lastModified: new Date()
          };
        } else {
          // Loading existing creation
          console.log('📖 LOADING EXISTING QUESTION - ID:', questionId);
          try {
            creationData = await creationService.getCreationData(questionId);
            console.log('📖 LOADED CREATION DATA:', {
              questionId: creationData.questionId,
              title: creationData.title,
              contentLength: creationData.content?.length || 0,
              content: creationData.content,
              isDraft: creationData.isDraft
            });
          } catch (err) {
            console.error('❌ Failed to load existing creation:', err);
            
            // Handle specific error for submitted questions
            if (err instanceof Error && err.message === 'QUESTION_ALREADY_SUBMITTED') {
              setError('This question has already been submitted and cannot be changed.');
            } else {
              setError(`Failed to load question with ID: ${questionId}`);
            }
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
          if (creationData.questionId) {
            questionInstance.setId(creationData.questionId);
          }
          if (creationData.creatorId) {
            questionInstance.setCreatorId(creationData.creatorId);
          }
          questionInstance.setTitle(creationData.title || 'Untitled Question');
          questionInstance.setDescription(creationData.description || '');
          questionInstance.setDifficulty(creationData.difficulty || 'Easy');
          questionInstance.setCategory(creationData.category || 'General');
          questionInstance.setPoints(creationData.points || 100);
          questionInstance.setEstimatedTime(creationData.estimatedTime || 30);
          questionInstance.setAuthor(creationData.author || 'Unknown');
          questionInstance.setIsDraft(creationData.isDraft !== false);
        } catch (metaError) {
          console.error('Failed to set question metadata:', metaError);
          setError('Failed to initialize question metadata');
          setLoading(false);
          return;
        }
        
        // Populate from content if available
        console.log('🔄 POPULATING CONTENT - Checking content:', {
          hasContent: !!creationData.content,
          contentLength: creationData.content?.length || 0,
          content: creationData.content,
          isEmptyObject: creationData.content === '{}',
          shouldPopulate: creationData.content && creationData.content !== '{}'
        });
        
        if (creationData.content && creationData.content !== '{}') {
          try {
            console.log('🔄 POPULATING CONTENT - Calling populateFromContentString with:', creationData.content);
            questionInstance.populateFromContentString(creationData.content);
            console.log('✅ CONTENT POPULATED - Successfully populated question content');
          } catch (contentError) {
            console.error('❌ CONTENT POPULATION FAILED:', contentError);
            console.warn('Failed to populate content, starting fresh:', contentError);
            // Don't fail the entire initialization if content parsing fails
            // Just log the error and continue with empty content
          }
        } else {
          console.log('ℹ️ NO CONTENT TO POPULATE - Starting with empty content');
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

    // Safely get question data with fallbacks
    const questionId = question.getId();
    const creatorId = user.id;
    
    console.log('📋 CREATE DATA - Getting question data:', {
      questionId: questionId,
      hasQuestionId: !!questionId,
      questionIdType: typeof questionId,
      creatorId: creatorId
    });
    
    if (!creatorId) {
      throw new Error('User ID is not available');
    }

    const finalQuestionId = questionId || `temp-${Date.now()}`;
    const contentString = question.contentToString() || '{}';
    
    // Check if content is meaningful (not just empty arrays)
    let hasContent = false;
    try {
      const parsedContent = JSON.parse(contentString);
      if (parsedContent && typeof parsedContent === 'object') {
        // For CFG questions, check if there are rules, start state, or end state
        if (questionType === 'cfg') {
          hasContent = (
            (parsedContent.rules && parsedContent.rules.length > 0) ||
            (parsedContent.startState && parsedContent.startState.length > 0) ||
            (parsedContent.endState && parsedContent.endState.length > 0) ||
            (parsedContent.steps && parsedContent.steps.length > 0)
          );
        } else {
          // For other question types, assume any non-empty object has content
          hasContent = Object.keys(parsedContent).length > 0;
        }
      }
    } catch (error) {
      console.warn('Failed to parse content for validation:', error);
      hasContent = contentString !== '{}';
    }
    
    console.log('📋 CONTENT VALIDATION:', {
      contentString,
      hasContent,
      questionType
    });

    const data = {
      questionId: finalQuestionId,
      creatorId: creatorId.toString(),
      title: question.getTitle() || 'Untitled Question',
      description: question.getDescription() || '',
      difficulty: question.getDifficulty() || 'Easy',
      category: question.getCategory() || 'General',
      points: question.getPoints() || 100,
      estimatedTime: question.getEstimatedTime() || 30,
      author: question.getAuthor() || 'Unknown',
      questionType,
      content: contentString,
      isDraft: question.getIsDraft() !== false, // Default to true if undefined
      lastModified: new Date(),
      hasContent // Add this for validation
    };
    
    console.log('📋 CREATE DATA - Final creation data:', {
      questionId: data.questionId,
      title: data.title,
      isTemp: data.questionId.startsWith('temp-'),
      hasContent: hasContent
    });
    
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
      
      console.log('🚀 HOOK - Starting save draft process with data:', {
        questionId: creationData.questionId,
        title: creationData.title,
        currentQuestionId: question?.getId(),
        hasContent: creationData.hasContent
      });
      
      // Warn about empty content but still allow saving
      if (!creationData.hasContent) {
        console.warn('⚠️ SAVING EMPTY QUESTION - Question has no meaningful content yet');
      }
      
      const updatedCreationData = await creationService.saveDraft(creationData);
      
      console.log('🔄 HOOK - Received updated creation data:', {
        originalId: creationData.questionId,
        updatedId: updatedCreationData.questionId,
        changed: creationData.questionId !== updatedCreationData.questionId
      });
      
      // Update question ID if it was newly created (temp ID was replaced)
      if (creationData.questionId !== updatedCreationData.questionId) {
        console.log('🔄 HOOK - Updating question ID in model:', {
          from: creationData.questionId,
          to: updatedCreationData.questionId,
          questionBefore: question?.getId()
        });
        
        question.setId(updatedCreationData.questionId);
        
        console.log('✅ HOOK - Question ID updated in model:', {
          newQuestionId: question?.getId()
        });
      } else {
        console.log('ℹ️ HOOK - No ID change needed, keeping:', creationData.questionId);
      }
      
      const now = new Date();
      setLastSavedDraft(now);
      setHasUnsavedChanges(false);
      console.log('✅ HOOK - Draft saved successfully at:', now);
    } catch (err) {
      console.error('❌ HOOK - Failed to save draft:', err);
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
      const updatedCreationData = await creationService.submitCreation(creationData);
      
      // Update question ID if it was newly created (temp ID was replaced)
      if (creationData.questionId !== updatedCreationData.questionId) {
        console.log('Updating question ID from', creationData.questionId, 'to:', updatedCreationData.questionId);
        question.setId(updatedCreationData.questionId);
      }
      
      // Mark as published
      question.setIsDraft(false);
      
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