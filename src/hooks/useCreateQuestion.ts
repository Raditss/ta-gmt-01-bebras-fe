import {QuestionTypeEnum} from "@/types/question-type.type";
import {ICreateQuestion} from "@/models/interfaces/create-question.model";
import {creationService} from "@/lib/services/creation.service";
import {useParams, useRouter} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {QuestionCreation} from "@/types/question.type";

export interface CreationHookParams {
  questionId: string;
  questionType: QuestionTypeEnum;
  initialData?: {
    title: string;
    points: number;
    estimatedTime: number;
  };
  createQuestionInstance: (data: QuestionCreation) => ICreateQuestion;
}

/*
* 1. id new di problem hapus aja karena dia create dari form dlu jadi gaperlu lagi
* 2. jadi kirim dulu datanya ke server terus baru redirect ke edit page pake id yang didapet
* 3. karena gitu jadinya content-nya kosongan aja
* */

type CreateQuestionConstructionModel<CreateQuestionModel extends ICreateQuestion> = new (
  questionTypeId: number,
  id?: number | number,
) => CreateQuestionModel;

export const useCreateQuestion = <CreateQuestionModel extends ICreateQuestion>(
  id: string,
  questionTypeId: number,
  createQuestionModel: CreateQuestionConstructionModel<CreateQuestionModel>,
//     {
//   questionId,
//   questionType,
//   initialData,
//   createQuestionInstance,
// }: CreationHookParams
) => {
  const router = useRouter();
  const params = useParams();
  const [question, setQuestion] = useState<CreateQuestionModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<Date | null>(null);

  const shouldSaveCreation = useRef(true);
  const isNewQuestion = id === "new";

  useEffect(() => {
    const initializeCreation = async () => {
      try {
        setLoading(true);
        setError(null);

        let creationData: QuestionCreation;

        if (isNewQuestion) {
          creationData = {
            id:
          }
        } else {
          try {
            const questionData = await creationService.getCreationData(id);
            creationData = {
              id: questionData.id,
              questionTypeId: questionData.questionType.id,
              title: questionData.title,
              content: questionData.content,
              isPublished: questionData.isPublished,
              points: questionData.points,
              estimatedTime: questionData.estimatedTime,
              lastModified: questionData.updatedAt,
            }
          } catch (err) {
            console.error("Failed to load existing creation:", err);
            setLoading(false);
            return;
          }
        }

        const q = new createQuestionModel()

        try {
          if (creationData.questionId) {
            questionInstance.id = creationData.questionId;
          }
          if (creationData.creatorId) {
            questionInstance.creatorId = creationData.creatorId;
          }
          questionInstance.title = creationData.title || "Untitled Question";
          questionInstance.description = creationData.description || "";
          questionInstance.category = creationData.category || "General";
          questionInstance.points = creationData.points || 100;
          questionInstance.estimatedTime = creationData.estimatedTime || 30;
          questionInstance.author = creationData.author || "Unknown";
          questionInstance.isDraft = creationData.isPublished !== false;
        } catch (metaError) {
          console.error("Failed to set question metadata:", metaError);
          setError("Failed to initialize question metadata");
          setLoading(false);
          return;
        }

        // Populate from content if available
        if (creationData.content && creationData.content !== "{}") {
          try {
            questionInstance.populateFromContentString(creationData.content);
          } catch (contentError) {
            console.warn(
              "Failed to populate content, starting fresh:",
              contentError
            );
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
        console.error("Failed to initialize creation:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load creation"
        );
      } finally {
        setLoading(false);
      }
    };

    // Only initialize if we have required data
    if (id && questionType) {
      initializeCreation();
    } else {
      setLoading(false);
      setError("Missing required data for question creation");
    }
  }, [
    id,
    questionType,
    user,
    initialData,
    createQuestionInstance,
    isNewQuestion,
  ]);

  const createCreationData = useCallback((): QuestionCreation => {
    if (!question) {
      throw new Error("Question not available");
    }

    // Safely get question data with fallbacks
    const questionId = question.id;

    if (!creatorId) {
      throw new Error("User ID is not available");
    }

    const finalQuestionId = questionId || `temp-${Date.now()}`;
    const contentString = question.contentToString() || "{}";

    // Check if content is meaningful (not just empty arrays)
    let hasContent = false;
    try {
      const parsedContent = JSON.parse(contentString);
      if (parsedContent && typeof parsedContent === "object") {
        // For CFG questions, check if there are rules, start state, or end state
        if (questionType === QuestionTypeEnum.CFG) {
          hasContent =
            (parsedContent.rules && parsedContent.rules.length > 0) ||
            (parsedContent.startState && parsedContent.startState.length > 0) ||
            (parsedContent.endState && parsedContent.endState.length > 0) ||
            (parsedContent.steps && parsedContent.steps.length > 0);
        } else {
          // For other question types, assume any non-empty object has content
          hasContent = Object.keys(parsedContent).length > 0;
        }
      }
    } catch (error) {
      console.warn("Failed to parse content for validation:", error);
      hasContent = contentString !== "{}";
    }

    const data = {
      questionId: finalQuestionId,
      creatorId: creatorId.toString(),
      title: question.title || "Untitled Question",
      description: question.description || "",
      category: question.category || "General",
      points: question.points || 100,
      estimatedTime: question.estimatedTime || 30,
      author: question.author || "Unknown",
      questionType,
      content: contentString,
      isDraft: question.isDraft !== false, // Default to true if undefined
      lastModified: new Date(),
      hasContent, // Add this for validation
    };

    return data;
  }, [question, questionType]);

  const saveDraftInternal = useCallback(async (): Promise<void> => {
    if (!question || saving) {
      return;
    }

    try {
      setSaving(true);
      const creationData = createCreationData();

      const updatedCreationData = await creationService.saveDraft(creationData);

      if (creationData.questionId !== updatedCreationData.questionId) {
        const newQuestionId = updatedCreationData.questionId;
        question.id = newQuestionId;

        const newUrl = `/add-problem/create/${questionType}/${newQuestionId}`;

        // Add a small delay to ensure state updates complete before Nav
        setTimeout(() => {
          router.push(newUrl);
        }, 100);
      }

      const now = new Date();
      setLastSavedDraft(now);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("❌ HOOK - Failed to save draft:", err);
      setError("Failed to save draft");
    } finally {
      setSaving(false);
    }
  }, [question, saving, createCreationData, questionType, router]);

  // Note: Removed auto-save timer - only save on Nav/leave like solve page

  const saveDraft = useCallback(async (): Promise<void> => {
    await saveDraftInternal();
  }, [saveDraftInternal]);

  const submitCreation = useCallback(async (): Promise<void> => {
    if (!question) {
      throw new Error("Question not available");
    }

    try {
      setSaving(true);
      shouldSaveCreation.current = false; // Prevent auto-save on exit

      // Set as published
      question.isDraft = false;

      const creationData = createCreationData();

      const updatedCreationData = await creationService.submitCreation(
        creationData
      );

      // Update question ID if it was newly created (temp ID was replaced)
      if (creationData.questionId !== updatedCreationData.questionId) {
        const newQuestionId = updatedCreationData.questionId;
        question.id = newQuestionId;

        // For submit, redirect to the problems page or success page instead of edit mode
        const newUrl = `/add-problem/create/${questionType}/${newQuestionId}`;
        router.push(newUrl);
      }

      // Mark as published
      question.isDraft = false;

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Failed to submit creation:", err);
      shouldSaveCreation.current = true; // Re-enable auto-save on error
      throw err;
    } finally {
      setSaving(false);
    }
  }, [question, createCreationData, questionType, router]);

  const markAsChanged = useCallback(() => {
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
    markAsChanged,
  };
};
