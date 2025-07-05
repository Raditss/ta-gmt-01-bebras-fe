"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { State, Rule } from "@/model/cfg/create-question/model";
import { StateDrawer } from "@/components/cfg-solve/state-drawer";
import { RulesTable } from "@/components/cfg-shared/rules-table";
import { questionService } from "@/services/questionService";
import { useAuth } from "@/lib/auth";
import { useQuestionAttempt } from "@/hooks/useQuestionAttempt";
import { BaseSolverProps, SolverWrapper } from "./base-solver";
import { useDuration } from "@/hooks/useDuration";
import { SubmissionModal } from "./submission-modal";
import { Clock } from "lucide-react";

export default function CfgSolver({ questionId }: BaseSolverProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Setup hooks for question functionality
  const { question, loading, error, currentDuration } =
    useQuestionAttempt(questionId);
  const { formattedDuration, getCurrentDuration } = useDuration(
    currentDuration()
  );

  // Update local state when question is loaded
  useEffect(() => {
    if (question) {
      setCurrentState(question.getCurrentState());
    }
  }, [question]);

  // Update applicable rules when selection changes
  useEffect(() => {
    if (!question || selectedIndices.length === 0) {
      setApplicableRules([]);
      return;
    }

    const selectedTypes = selectedIndices.map(
      (index) => currentState[index].type
    );
    const rules = question.getAvailableRules();

    // Find rules where the "before" part matches selected objects
    const matchingRules = rules.filter((rule) => {
      if (rule.before.length !== selectedTypes.length) return false;
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });

    setApplicableRules(matchingRules);
  }, [selectedIndices, currentState, question]);

  // Handle clicking on objects in the current state
  const handleObjectClick = useCallback(
    (index: number) => {
      if (selectedIndices.includes(index)) {
        setSelectedIndices(selectedIndices.filter((i) => i !== index));
      } else {
        // Ensure selections are consecutive
        if (
          selectedIndices.length === 0 ||
          Math.abs(index - selectedIndices[selectedIndices.length - 1]) === 1 ||
          Math.abs(index - selectedIndices[0]) === 1
        ) {
          const allIndices = [...selectedIndices, index].sort((a, b) => a - b);
          if (
            allIndices[allIndices.length - 1] - allIndices[0] ===
            allIndices.length - 1
          ) {
            setSelectedIndices(allIndices);
          }
        }
      }
    },
    [selectedIndices]
  );

  // Apply selected rule to current state
  const handleApplyRule = useCallback(
    (rule: Rule) => {
      if (!question || selectedIndices.length === 0) return;

      const success = question.applyRule(
        rule.id,
        selectedIndices[0],
        selectedIndices.length
      );
      if (success) {
        setCurrentState(question.getCurrentState());
        setSelectedIndices([]);
      }
    },
    [question, selectedIndices]
  );

  // Handle undo operation
  const handleUndo = useCallback(() => {
    if (!question) return;
    if (question.undo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  }, [question]);

  // Handle redo operation
  const handleRedo = useCallback(() => {
    if (!question) return;
    if (question.redo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  }, [question]);

  // Handle reset operation
  const handleReset = useCallback(() => {
    if (!question) return;
    question.resetToInitialState();
    setCurrentState(question.getCurrentState());
    setSelectedIndices([]);
  }, [question]);

  // Handle submitting the attempt
  const handleSubmit = async () => {
    if (!question) return;
    setIsSubmitting(true);
  };

  const handleConfirmSubmit = async () => {
    if (!question || !user?.id) return;

    try {
      // Calculate duration
      const duration = getCurrentDuration();

      // Set attempt data and submit
      question.setAttemptData(String(user.id), duration, "completed");
      const result = await questionService.submitAttempt(question.getAttemptData());

      console.log('🚨 DEBUG: Submit result from backend:', result);

      // Use the backend response for scoring
      setSubmissionResult({
        isCorrect: result.isCorrect,
        points: result.points, // Use scoreEarned from backend
        streak: 1, // Simple streak for now
        timeTaken: duration,
        explanation: result.scoringDetails?.explanation || '',
        newTotalScore: result.scoringDetails?.newTotalScore || 0,
        questionsCompleted: result.scoringDetails?.questionsCompleted || 0,
      });
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  const handleModalClose = () => {
    setIsSubmitting(false);
    setSubmissionResult(null);
    router.push("/problems");
  };

  return (
    <SolverWrapper loading={loading} error={error}>
      {question && (
        <>
          {/* Duration display */}
          <div className="fixed top-20 right-4 bg-white rounded-lg shadow-md p-3 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formattedDuration}</span>
          </div>

          {/* Display all available transformation rules */}
          <div className="mb-20">
            <h2 className="text-xl font-bold mb-4">Available Rules</h2>
            <RulesTable rules={question.getAvailableRules()} />
          </div>

          {/* Interactive state manipulation drawer */}
          <StateDrawer
            targetState={question.getQuestionSetup().endState}
            currentState={currentState}
            selectedIndices={selectedIndices}
            applicableRules={applicableRules}
            onObjectClick={handleObjectClick}
            onApplyRule={handleApplyRule}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />

          {/* Submission Modal */}
          <SubmissionModal
            isOpen={isSubmitting || !!submissionResult}
            isConfirming={isSubmitting && !submissionResult}
            result={submissionResult}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setIsSubmitting(false)}
            onClose={handleModalClose}
          />
        </>
      )}
    </SolverWrapper>
  );
}
