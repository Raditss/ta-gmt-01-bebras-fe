import { creationService } from '@/lib/services/creation.service';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Question } from '@/types/question.type';
import { ICreateQuestion } from '@/models/interfaces/create-question.model';
import { toLocalDate } from '@/utils/formatting/date.format';

type CreateQuestionConstructionModel<
  CreateQuestionModel extends ICreateQuestion
> = new (question: Question) => CreateQuestionModel;

export const useCreateQuestion = <CreateQuestionModel extends ICreateQuestion>(
  _question: Question,
  createQuestionModel: CreateQuestionConstructionModel<CreateQuestionModel>
) => {
  const question = useMemo(
    () => new createQuestionModel({ ..._question }),
    [_question, createQuestionModel]
  );

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<string | null>(null);

  useEffect(() => {
    if (!question.draft.isPublished && question.draft.content !== '{}') {
      setLastSavedDraft(toLocalDate(question.draft.updatedAt));
    }
  }, [question]);

  const saveDraft = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      if (!question.validateContent()) {
        throw new Error('Invalid question data');
      }

      const contentToSave = question.toJson();

      const updatedCreationData = await creationService.updateCreateQuestion(
        question.draft.id,
        {
          questionTypeId: question.draft.questionTypeId,
          title: question.draft.title,
          content: contentToSave,
          isPublished: false,
          points: question.draft.points,
          estimatedTime: question.draft.estimatedTime
        }
      );
      setLastSavedDraft(toLocalDate(updatedCreationData.updatedAt));
      setHasUnsavedChanges(false);
    } catch (_err) {
      setError('Failed to save draft');
      console.error('Save draft error:', _err);
    } finally {
      setIsLoading(false);
    }
  }, [question]);

  const submitCreation = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      if (!question.validateContent()) {
        throw new Error('Invalid question data');
      }

      await creationService.updateCreateQuestion(question.draft.id, {
        questionTypeId: question.draft.questionTypeId,
        title: question.draft.title,
        content: question.toJson(),
        isPublished: true,
        points: question.draft.points,
        estimatedTime: question.draft.estimatedTime
      });

      setHasUnsavedChanges(false);
    } catch (_err) {
      setError('Failed to submit creation');
      console.error('Submit creation error:', _err);
    } finally {
      setIsLoading(false);
    }
  }, [question]);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    question,
    error,
    isLoading,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged,
    clearError
  };
};
