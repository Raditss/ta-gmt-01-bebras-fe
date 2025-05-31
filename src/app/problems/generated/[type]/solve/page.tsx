"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Question } from '@/model/cfg/question/model';
import { State, Rule } from '@/model/cfg/create-question/model';
import { StateDrawer } from '@/components/cfg-solve/state-drawer';
import { RulesTable } from '@/components/cfg-shared/rules-table';
import { MainNavbar } from '@/components/main-navbar';
import { questionService } from '@/services/questionService';
import { QuestionType, QUESTION_TYPES } from '@/constants/questionTypes';

export default function GeneratedSolvePage() {
  const params = useParams();
  const type = params?.type as QuestionType;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);

  // Fetch generated question on mount
  useEffect(() => {
    const fetchGeneratedQuestion = async () => {
      try {
        const data = await questionService.generateQuestion(type);
        const q = new Question(data.id, data.title, data.type, true, data.duration);
        q.populateQuestionFromString(JSON.stringify(data.content));
        setQuestion(q);
        setCurrentState(q.getCurrentState());
      } catch (err) {
        setError('Failed to generate question');
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedQuestion();
  }, [type]);

  // Update applicable rules when selection changes
  useEffect(() => {
    if (!question || selectedIndices.length === 0) {
      setApplicableRules([]);
      return;
    }

    const selectedTypes = selectedIndices.map(index => currentState[index].type);
    const rules = question.getAvailableRules();
    
    // Find rules where the "before" part matches selected objects
    const matchingRules = rules.filter(rule => {
      if (rule.before.length !== selectedTypes.length) return false;
      return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
    });
    
    setApplicableRules(matchingRules);
  }, [selectedIndices, currentState, question]);

  // Handle clicking on objects in the current state
  const handleObjectClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      // Ensure selections are consecutive
      if (
        selectedIndices.length === 0 ||
        Math.abs(index - selectedIndices[selectedIndices.length - 1]) === 1 ||
        Math.abs(index - selectedIndices[0]) === 1
      ) {
        const allIndices = [...selectedIndices, index].sort((a, b) => a - b);
        if (allIndices[allIndices.length - 1] - allIndices[0] === allIndices.length - 1) {
          setSelectedIndices(allIndices);
        }
      }
    }
  };

  // Apply selected rule to current state
  const handleApplyRule = (rule: Rule) => {
    if (!question || selectedIndices.length === 0) return;

    const success = question.applyRule(rule.id, selectedIndices[0], selectedIndices.length);
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

  const handleSubmit = () => {
    if (!question) return;
    const isCorrect = question.checkAnswer();
    if (isCorrect) {
      alert('Congratulations! Your solution is correct!');
    } else {
      alert('Sorry, your solution is not correct. Please try again.');
    }
  };

  // Handle leaving confirmation for generated questions
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = "You will lose your progress if you leave. Are you sure?";
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading {type} question...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !question) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg text-red-600">{error || 'Failed to load question'}</p>
        </div>
      </div>
    );
  }

  // For now, only CFG questions are implemented
  if (type !== 'cfg') {
    const questionTypeInfo = QUESTION_TYPES.find(qt => qt.type === type);
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">{questionTypeInfo?.title || type.toUpperCase()} questions are coming soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <MainNavbar />

      <main className="flex-1 container mx-auto px-4 py-6">
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
      </main>
    </div>
  );
} 