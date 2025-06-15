import { useState, useEffect, useCallback } from 'react';
import { CfgCreateQuestion, State, Rule } from '@/model/cfg/create-question/model';
import { fetchCfgQuestion, createCfgQuestion, updateCfgQuestion, saveDraft } from '@/lib/api/cfg-questions';

export const useCfgQuestion = (id?: string) => {
  const [question, setQuestion] = useState<CfgCreateQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<Date | null>(null);

  // Load question data
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        setLoading(true);
        setError(null);

        let questionData;
        if (id && id !== 'new') {
          // Fetch existing question
          questionData = await fetchCfgQuestion(id);
        } else {
          // Create new question
          questionData = await createCfgQuestion('Untitled Question', true);
        }

        // Initialize CfgCreateQuestion with the data
        const cfgQuestion = new CfgCreateQuestion(questionData.title);
        cfgQuestion.setRules(questionData.rules);
        cfgQuestion.setStartState(questionData.startState);
        cfgQuestion.setInitialEndState(questionData.endState);
        
        setQuestion(cfgQuestion);
        setHasUnsavedChanges(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [id]);

  // Auto-save draft when there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges || !question || !id || saving) return;

    const draftTimeout = setTimeout(async () => {
      try {
        setSaving(true);
        const draftData = {
          title: question.getTitle(),
          rules: question.rules,
          startState: question.startState,
          endState: question.endState,
          steps: question.getSteps(),
          isDraft: true
        };

        await saveDraft(id, draftData);
        setLastSavedDraft(new Date());
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error('Failed to save draft:', err);
      } finally {
        setSaving(false);
      }
    }, 2000); // Auto-save after 2 seconds of no changes

    return () => clearTimeout(draftTimeout);
  }, [hasUnsavedChanges, question, id, saving]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const updateQuestionData = async (updates: Partial<{
    title: string;
    rules: Rule[];
    startState: State[];
    endState: State[];
  }>) => {
    if (!question) return;

    try {
      setSaving(true);
      setError(null);

      // Create updated question instance
      const updatedQuestion = new CfgCreateQuestion(
        updates.title || question.getTitle()
      );

      if (updates.rules) {
        updatedQuestion.setRules(updates.rules);
      } else {
        updatedQuestion.setRules(question.rules);
      }

      if (updates.startState) {
        updatedQuestion.setStartState(updates.startState);
      } else {
        updatedQuestion.setStartState(question.startState);
      }

      if (updates.endState) {
        updatedQuestion.setInitialEndState(updates.endState);
      } else {
        updatedQuestion.setInitialEndState(question.endState);
      }

      setQuestion(updatedQuestion);
      setHasUnsavedChanges(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const saveDraftManually = useCallback(async () => {
    if (!question || !id || saving) return;

    try {
      setSaving(true);
      const draftData = {
        title: question.getTitle(),
        rules: question.rules,
        startState: question.startState,
        endState: question.endState,
        steps: question.getSteps(),
        isDraft: true
      };

      await saveDraft(id, draftData);
      setLastSavedDraft(new Date());
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  }, [question, id, saving]);

  return {
    question,
    loading,
    saving,
    error,
    hasUnsavedChanges,
    lastSavedDraft,
    updateQuestion: updateQuestionData,
    saveDraft: saveDraftManually
  };
}; 