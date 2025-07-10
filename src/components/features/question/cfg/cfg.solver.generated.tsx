'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CfgSolveModel } from '@/models/cfg/cfg.solve.model';
import { Rule, State } from '@/models/cfg/cfg.create.model';
import { StateDrawerSolve } from '@/components/features/question/cfg/solve/state-drawer.solve';
import { RulesTableShared } from '@/components/features/question/cfg/shared/rules-table.shared';
import { questionService } from '@/lib/services/question.service';
import {
  GeneratedSolverProps,
  GeneratedSolverWrapper
} from '@/components/features/bases/base.solver.generated';
import {
  SubmissionModalSolver,
  SubmissionResult
} from '@/components/features/question/submission-modal.solver';
import { questionsApi } from '@/lib/api';

export default function GeneratedCfgSolver({ type }: GeneratedSolverProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<CfgSolveModel | null>(null);
  const [questionContent, setQuestionContent] = useState<string>(''); // Store original question content
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  // Load generated question from storage or generate new one
  useEffect(() => {
    const loadGeneratedQuestion = async () => {
      try {
        // First try to get the stored generated question
        const storedQuestion = sessionStorage.getItem('generatedQuestion');

        let data;
        if (storedQuestion) {
          // Use the stored question and clear it
          data = JSON.parse(storedQuestion);
          sessionStorage.removeItem('generatedQuestion');
        } else {
          // Fallback: generate a new question if none stored
          data = await questionsApi.generateQuestion(type);
        }

        const q = new CfgSolveModel(data.id);
        q.populateQuestionFromString(data.content);
        setQuestion(q);
        setQuestionContent(data.content); // Store the original content
        setCurrentState(q.getCurrentState());
      } catch (err) {
        console.error('Error loading generated question:', err);
        setError('Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    loadGeneratedQuestion();
  }, [type]);

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
  const handleObjectClick = (index: number) => {
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
  };

  // Apply selected rule to current state
  const handleApplyRule = (rule: Rule) => {
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
  };

  const handleUndo = () => {
    if (question?.undo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  };

  const handleRedo = () => {
    if (question?.redo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  };

  const handleReset = () => {
    if (!question) return;
    question.resetToInitialState();
    setCurrentState(question.getCurrentState());
    setSelectedIndices([]);
  };

  const handleSubmit = async () => {
    if (!question) return;
    setIsSubmitting(true);
  };

  const handleConfirmSubmit = async () => {
    if (!question) return;

    try {
      // Call the check endpoint with the new format
      const response = await questionService.checkGeneratedAnswer({
        type: question.questionType,
        questionContent: questionContent,
        answer: JSON.stringify(question.toJSON())
      });

      setSubmissionResult({
        isCorrect: response.isCorrect
      });
    } catch (_err) {
      setError('Failed to check your answer. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsSubmitting(false);
    setSubmissionResult(null);
    router.push('/problems');
  };

  return (
    <GeneratedSolverWrapper loading={loading} error={error} type={type}>
      {question && (
        <>
          {/* Display all available transformation rules */}
          <div className="mb-20">
            <h2 className="text-xl font-bold mb-4">Available Rules</h2>
            <RulesTableShared rules={question.getAvailableRules()} />
          </div>

          {/* Interactive state manipulation drawer */}
          <StateDrawerSolve
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
          <SubmissionModalSolver
            isOpen={isSubmitting || !!submissionResult}
            isConfirming={isSubmitting && !submissionResult}
            result={submissionResult}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setIsSubmitting(false)}
            onClose={handleModalClose}
          />
        </>
      )}
    </GeneratedSolverWrapper>
  );
}
