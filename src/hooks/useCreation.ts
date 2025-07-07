import {QuestionTypeEnum} from "@/types/question-type.type";
import {ICreateQuestion} from "@/models/interfaces/create-question";
import {CreationData, creationService} from "@/lib/services/creation.service";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "@/hooks/useAuth";

export interface CreationHookParams {
  questionId: string;
  questionType: QuestionTypeEnum;
  initialData?: {
    title: string;
    description: string;
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
  createQuestionInstance,
}: CreationHookParams) => {
  const { user } = useAuth();
  const router = useRouter();
  const [question, setQuestion] = useState<ICreateQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedDraft, setLastSavedDraft] = useState<Date | null>(null);

  const shouldSaveCreation = useRef(true);
  const isNewQuestion = questionId === "new";

  // Initialize creation session
  useEffect(() => {
    const initializeCreation = async () => {
      // Allow initialization without user for preview, but will need user for saving
      if (!user?.id) {
        console.log(
          "User not authenticated - creating question for preview mode"
        );
      }

      try {
        setLoading(true);
        setError(null);

        let creationData: CreationData;

        if (isNewQuestion) {
          // Creating a new question - don't make backend calls yet
          const defaultData = {
            title: "Untitled Question",
            description: "",
            category:
              questionType === QuestionTypeEnum.CFG ? "Context-Free Grammar" : "General",
            points: 100,
            estimatedTime: 30,
            author: user?.name || "Anonymous",
          };

          const dataToUse = initialData || defaultData;

          if (!user?.id) {
            setError("Please log in to create questions");
            setLoading(false);
            return;
          }

          // For new questions, create a temporary local instance
          // Backend creation will happen when user saves draft or submits
          creationData = {
            questionId: `temp-${Date.now()}`,
            creatorId: user.id.toString(),
            ...dataToUse,
            questionType,
            content: "{}",
            isPublished: true,
            lastModified: new Date(),
          };
        } else {
          try {
            creationData = await creationService.getCreationData(questionId);
          } catch (err) {
            console.error("Failed to load existing creation:", err);

            // Handle specific error for submitted questions
            if (
              err instanceof Error &&
              err.message === "QUESTION_ALREADY_SUBMITTED"
            ) {
              setError(
                "This question has already been submitted and cannot be changed."
              );
            } else {
              setError(`Failed to load question with ID: ${questionId}`);
            }
            setLoading(false);
            return;
          }
        }

        let questionInstance;
        try {
          questionInstance = createQuestionInstance(creationData);
        } catch (createError) {
          console.error("Failed to create question instance:", createError);
          setLoading(false);
          return;
        }

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
    if (questionId && questionType) {
      initializeCreation();
    } else {
      setLoading(false);
      setError("Missing required data for question creation");
    }
  }, [
    questionId,
    questionType,
    user,
    initialData,
    createQuestionInstance,
    isNewQuestion,
  ]);

  const createCreationData = useCallback((): CreationData => {
    if (!question) {
      throw new Error("Question not available");
    }

    if (!user?.id) {
      throw new Error("User not authenticated - cannot save");
    }

    // Safely get question data with fallbacks
    const questionId = question.id;
    const creatorId = user.id;

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
        if (questionType === "cfg") {
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
  }, [question, user, questionType]);

  const saveDraftInternal = useCallback(async (): Promise<void> => {
    if (!question || saving) {
      return;
    }

    if (!user?.id) {
      setError("Please log in to save your work");
      return;
    }

    try {
      setSaving(true);
      const creationData = createCreationData();

      const updatedCreationData = await creationService.saveDraft(creationData);

      // Update question ID if it was newly created (temp ID was replaced)
      console.log("🔍 CHECKING REDIRECTION:", {
        oldId: creationData.questionId,
        newId: updatedCreationData.questionId,
        shouldRedirect:
          creationData.questionId !== updatedCreationData.questionId,
      });

      if (creationData.questionId !== updatedCreationData.questionId) {
        const newQuestionId = updatedCreationData.questionId;
        question.id = newQuestionId;

        // Log the created question ID for easy access
        console.log("📝 QUESTION CREATED - ID:", newQuestionId);
        console.log(
          "🔗 Direct URL: http://localhost:3100/add-problem/create/cfg/" +
            newQuestionId
        );

        // Redirect to the new question ID URL to switch from "new" to "edit" mode
        const newUrl = `/add-problem/create/${questionType}/${newQuestionId}`;
        console.log("🔄 REDIRECTING to:", newUrl);

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
  }, [question, user, saving, createCreationData, questionType, router]);

  // Note: Removed auto-save timer - only save on Nav/leave like solve page

  // Handle beforeunload event for draft protection
  useEffect(() => {
    if (!shouldSaveCreation.current) return;

    const saveCreationOnExit = async () => {
      if (!question || !hasUnsavedChanges || !user?.id) return;

      console.log("Saving creation on exit...");
      const creationData = createCreationData();
      creationService.saveDraft(creationData);
      console.log("Draft saved on exit");
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!question || !user?.id || !hasUnsavedChanges) return;

      console.log("Before unload - saving draft...");
      e.preventDefault();
      e.returnValue = "";

      const creationData = createCreationData();
      creationService.saveDraft(creationData);
      console.log("Draft saved before unload");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save creation on unmount only if not submitting
      if (question && user?.id && shouldSaveCreation.current) {
        saveCreationOnExit();
      }
    };
  }, [question, user, hasUnsavedChanges, createCreationData]);

  const saveDraft = useCallback(async (): Promise<void> => {
    console.log("Manual save draft triggered");
    await saveDraftInternal();
  }, [saveDraftInternal]);

  const submitCreation = useCallback(async (): Promise<void> => {
    if (!question) {
      throw new Error("Question not available");
    }

    if (!user?.id) {
      throw new Error("User not authenticated - cannot submit");
    }

    try {
      console.log("Starting creation submission...");
      setSaving(true);
      shouldSaveCreation.current = false; // Prevent auto-save on exit

      // Set as published
      question.isDraft = false;

      const creationData = createCreationData();

      console.log("Submitting creation with data:", creationData);
      const updatedCreationData = await creationService.submitCreation(
        creationData
      );

      // Update question ID if it was newly created (temp ID was replaced)
      if (creationData.questionId !== updatedCreationData.questionId) {
        const newQuestionId = updatedCreationData.questionId;
        console.log(
          "Updating question ID from",
          creationData.questionId,
          "to:",
          newQuestionId
        );
        question.id = newQuestionId;

        // For submit, redirect to the problems page or success page instead of edit mode
        const newUrl = `/add-problem/create/${questionType}/${newQuestionId}`;
        console.log("🔄 SUBMIT REDIRECT to:", newUrl);
        router.push(newUrl);
      }

      // Mark as published
      question.isDraft = false;

      setHasUnsavedChanges(false);
      console.log("Creation submitted successfully");
    } catch (err) {
      console.error("Failed to submit creation:", err);
      shouldSaveCreation.current = true; // Re-enable auto-save on error
      throw err;
    } finally {
      setSaving(false);
    }
  }, [question, user, createCreationData, questionType, router]);

  const markAsChanged = useCallback(() => {
    console.log("Marking creation as changed");
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
