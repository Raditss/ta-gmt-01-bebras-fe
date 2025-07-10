import { creationService } from '@/lib/services/creation.service';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Question } from '@/types/question.type';
import { ICreateQuestion } from '@/models/interfaces/create-question.model';
import { Dayjs } from 'dayjs';

type CreateQuestionConstructionModel<
  CreateQuestionModel extends ICreateQuestion
> = new (question: Question) => CreateQuestionModel;

export const useCreateQuestion = <CreateQuestionModel extends ICreateQuestion>(
  _question: Question,
  createQuestionModel: CreateQuestionConstructionModel<CreateQuestionModel>
) => {
  const question = useMemo(
    () => new createQuestionModel({ ..._question }),
    [_question]
  );
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<Dayjs | null>(null);
  const shouldSaveCreation = useRef(true);

  const saveDraft = useCallback(async (): Promise<void> => {
    try {
      console.log('Saving draft...', question);
      if (!question.validateContent()) throw new Error('Invalid question data');

      const updatedCreationData = await creationService.updateCreateQuestion(
        question.draft.id,
        {
          questionTypeId: question.draft.questionTypeId,
          title: question.draft.title,
          content: question.contentToString(),
          isPublished: false,
          points: question.draft.points,
          estimatedTime: question.draft.estimatedTime
        }
      );

      setLastSavedDraft(updatedCreationData.updatedAt);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('❌ HOOK - Failed to save draft:', err);
      setError('Failed to save draft');
    }
  }, [question]);

  const submitCreation = useCallback(async (): Promise<void> => {
    try {
      if (!question.validateContent()) throw new Error('Invalid question data');

      const updatedCreationData = await creationService.updateCreateQuestion(
        question.draft.id,
        {
          questionTypeId: question.draft.questionTypeId,
          title: question.draft.title,
          content: question.contentToString(),
          isPublished: true,
          points: question.draft.points,
          estimatedTime: question.draft.estimatedTime
        }
      );

      setLastSavedDraft(updatedCreationData.updatedAt);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to submit creation:', err);
      shouldSaveCreation.current = true; // Re-enable auto-save on error
      throw err;
    }
  }, [question]);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  return {
    question,
    error,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged
  };
};
