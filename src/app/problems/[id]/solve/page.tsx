"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Question } from '@/model/cfg/question/model';
import { State, Rule } from '@/model/cfg/create-question/model';
import { StateDrawer } from '@/components/cfg-solve/state-drawer';
import { RulesTable } from '@/components/cfg-shared/rules-table';
import { MainNavbar } from '@/components/main-navbar';

// TODO: Replace with actual API call
const mockQuestionData = {
  startState: [
    { id: 1, type: 'circle' },
    { id: 2, type: 'triangle' },
    { id: 3, type: 'square' },
    { id: 4, type: 'triangle' },
    { id: 5, type: 'triangle' },
    { id: 6, type: 'circle' },
  ],
  endState: [
    { id: 1, type: 'star' },
    { id: 2, type: 'hexagon' },
    { id: 3, type: 'star' },
  ],
  rules: [
    {
      id: 'rule1',
      before: [{ type: 'triangle' }, { type: 'square' }, { type: 'triangle' }],
      after: [{ type: 'hexagon' }]
    },
    {
      id: 'rule2',
      before: [{ type: 'circle' }, { type: 'triangle' }],
      after: [{ type: 'star' }]
    },
    {
      id: 'rule3',
      before: [{ type: 'circle' }],
      after: [{ type: 'star' }]
    },
    {
      id: 'rule4',
      before: [{ type: 'triangle' }, { type: 'circle' }],
      after: [{ type: 'star' }]
    }
  ],
  steps: []
};

export default function SolvePage() {
  const params = useParams();
  const id = params?.id as string;

  // Initialize question with mock data
  const [question] = useState(() => {
    const q = new Question(id, "Question Title", false, 300);
    q.populateQuestionFromString(JSON.stringify(mockQuestionData));
    return q;
  });

  const [currentState, setCurrentState] = useState<State[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<Rule[]>([]);

  // Load initial state from question
  useEffect(() => {
    setCurrentState(question.getCurrentState());
  }, [question]);

  // Update applicable rules when selection changes
  useEffect(() => {
    if (selectedIndices.length > 0) {
      const selectedTypes = selectedIndices.map(index => currentState[index].type);
      const rules = question.getAvailableRules();
      
      // Find rules where the "before" part matches selected objects
      const matchingRules = rules.filter(rule => {
        if (rule.before.length !== selectedTypes.length) return false;
        return rule.before.every((obj, i) => obj.type === selectedTypes[i]);
      });
      
      setApplicableRules(matchingRules);
    } else {
      setApplicableRules([]);
    }
  }, [selectedIndices, currentState]);

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
    if (selectedIndices.length === 0) return;

    const success = question.applyRule(rule.id, selectedIndices[0], selectedIndices.length);
    if (success) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  };

  const handleUndo = () => {
    if (question.undo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  };

  const handleRedo = () => {
    if (question.redo()) {
      setCurrentState(question.getCurrentState());
      setSelectedIndices([]);
    }
  };

  const handleReset = () => {
    question.resetToInitialState();
    setCurrentState(question.getCurrentState());
    setSelectedIndices([]);
  };

  const handleSubmit = () => {
    const isCorrect = question.checkAnswer();
    if (isCorrect) {
      alert('Congratulations! Your solution is correct!');
    } else {
      alert('Sorry, your solution is not correct. Please try again.');
    }
  };

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