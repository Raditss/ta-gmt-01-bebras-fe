"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { RulesSection } from '@/components/cfg-create-question/rule-section';
import { RuleModal } from '@/components/cfg-create-question/rule-modal';
import { StateCreationPopup } from '@/components/cfg-create-question/state-creation-popup';
import { State, Rule } from '@/model/cfg/create-question/model';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useCfgQuestion } from '@/hooks/useCfgQuestion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationAlertDialog } from '@/components/ui/navigation-alert-dialog';
import { MainNavbar } from '@/components/main-navbar';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';

export default function CfgCreateProblemPage() {
  const router = useRouter();

  const {
    question,
    loading,
    saving,
    error: questionError,
    hasUnsavedChanges,
    lastSavedDraft,
    updateQuestion,
    saveDraft
  } = useCfgQuestion(undefined); // Create new question

  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog,
    handleNavigationAttempt
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft
  });

  const [rules, setRules] = useState<Rule[]>([]);
  const [startState, setStartState] = useState<State[]>([]);
  const [endState, setEndState] = useState<State[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showStateCreationPopup, setShowStateCreationPopup] = useState(false);
  const [stateCreationMode, setStateCreationMode] = useState<'start' | 'end' | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Available shapes for creating rules and states
  const availableObjects = [
    { id: 1, type: 'circle', icon: '⚪' },
    { id: 2, type: 'triangle', icon: '△' },
    { id: 3, type: 'square', icon: '⬜' },
    { id: 4, type: 'star', icon: '⭐' },
    { id: 5, type: 'hexagon', icon: '⬡' }
  ];
  
  // Add a new transformation rule
  const handleAddRule = (beforeObjects: any, afterObjects: any) => {
    const newRuleId = nanoid();
    const newRule = { id: newRuleId, before: beforeObjects, after: afterObjects };
    const updatedRules = [...rules, newRule];
    setRulesAndSync(updatedRules);
    setShowRuleModal(false);
  };
  
  const handleSubmit = () => {
    const questionData = {
      rules,
      startState,
      endState
    };
    
    console.log('Question data ready for submission:', questionData);
    alert('Ready to submit question data!');
  };

  // Handle manual save
  const handleManualSave = useCallback(async () => {
    try {
      await saveDraft();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [saveDraft]);

  // Update question when rules or states change
  const setRulesAndSync = useCallback((newRules: Rule[]) => {
    if (!question) return;
    updateQuestion({ rules: newRules });
    setRules(newRules);
  }, [question, updateQuestion]);

  const handleDeleteRule = useCallback((ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRulesAndSync(updatedRules);
    
    // Reset end state when rules change
    if (endState.length > 0) {
      const newEndState = [...startState];
      setEndState(newEndState);
      updateQuestion({ endState: newEndState });
    }
  }, [rules, startState, endState, setRulesAndSync, updateQuestion]);

  const setStartStateAndSync = useCallback((newState: State[]) => {
    if (!question) return;
    updateQuestion({ startState: newState });
    setStartState(newState);
    
    // Reset end state when start state changes
    if (endState.length > 0) {
      setEndState([...newState]);
      updateQuestion({ endState: [...newState] });
    }
  }, [question, updateQuestion, endState]);

  const setEndStateAndSync = useCallback((newState: State[]) => {
    if (!question) return;
    updateQuestion({ endState: newState });
    setEndState(newState);
  }, [question, updateQuestion]);

  // Handles undoing the last step by replaying remaining steps from initial state
  const handleUndo = () => {
    if (!question) return;
    const lastStep = question.popStep();
    if (lastStep) {
      const newEndState = question.replayStepsFromInitialEndState();
      setEndState(newEndState);
    }
  };

  // Handles redoing the last undone step by replaying all steps including the redone one
  const handleRedo = () => {
    if (!question) return;
    const step = question.redoStep();
    if (step) {
      const newEndState = question.replayStepsFromInitialEndState();
      setEndState(newEndState);
    }
  };

  // Reset entire question state
  const handleReset = () => {
    if (!question) return;
    question.resetSteps();
    setRulesAndSync([]);
    setStartStateAndSync([]);
    setEndStateAndSync([]);
  };
  
  // Initialize end state with start state when entering end state mode
  useEffect(() => {
    if (stateCreationMode === 'end' && endState.length === 0) {
      const initialEndState = [...startState];
      setEndState(initialEndState);
      if (question) {
        question.setInitialEndState(initialEndState);
      }
    }
  }, [stateCreationMode]);

  // Add required CSS for shape rendering
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .clip-triangle {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      }
      .clip-star {
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      }
      .clip-hexagon {
        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      }
      .hover\\:bg-gray-300:hover {
        background-color: rgb(209, 213, 219);
      }
      .transition-colors {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Initialize state from model
  useEffect(() => {
    if (!question) return;
    setRules([...question.rules]);
    setStartState([...question.startState]);
    setEndState([...question.endState]);
  }, [question]);

  // Auto-hide save confirmation
  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => setShowSaveConfirmation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  // Applies a rule to selected objects in the end state
  const applyRuleToEndState = (selectedIndices: number[], ruleToApply: { id: string; after: any[]; }) => {
    if (!question || !ruleToApply || selectedIndices.length === 0) return;

    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const startIdx = sortedIndices[0];
    const endIdx = sortedIndices[sortedIndices.length - 1];
    const currentEndState = [...endState];

    // Add unique IDs to new objects
    const afterWithIds = ruleToApply.after.map(obj => ({
      ...obj,
      id: Date.now() + Math.random()
    }));

    // Replace selected objects with rule's output
    currentEndState.splice(startIdx, endIdx - startIdx + 1, ...afterWithIds);

    // Record step for undo/redo
    question.pushStep({ 
      ruleId: ruleToApply.id, 
      index: startIdx,
      replacedCount: selectedIndices.length,
      endState: currentEndState
    });

    setEndState(currentEndState);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (questionError || !question) {
    return (
      <div className="min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-red-600">
            {questionError || 'Failed to load question'}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <NavigationAlertDialog
        open={showNavigationDialog}
        onOpenChange={setShowDialog}
        onSaveAndLeave={handleSaveAndLeave}
        onLeaveWithoutSaving={handleLeaveWithoutSaving}
        onCancel={handleStayOnPage}
      />
      
      <MainNavbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New CFG Question</h1>
          
          <Button
            onClick={handleManualSave}
            disabled={saving || !hasUnsavedChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>

        {saving && (
          <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Saving draft...</AlertDescription>
          </Alert>
        )}
        
        {showSaveConfirmation && (
          <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Draft saved successfully!
            </AlertDescription>
          </Alert>
        )}
        
        {lastSavedDraft && !showSaveConfirmation && (
          <Alert className="mb-4 bg-gray-50 text-gray-800 border-gray-200">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Last saved at {lastSavedDraft.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Rules creation and management */}
        <RulesSection 
          rules={rules} 
          onAddRule={() => setShowRuleModal(true)}
          onDeleteRule={handleDeleteRule}
        />
        
        {/* State creation buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => {
              setShowStateCreationPopup(true);
              setStateCreationMode('start');
            }}
            className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold py-3 px-6 rounded-full"
          >
            {startState.length === 0 ? 'Create Start State' : 'Edit Start State'}
          </button>
          
          {startState.length > 0 && (
            <button 
              onClick={() => {
                setShowStateCreationPopup(true);
                setStateCreationMode('end');
              }}
              className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold py-3 px-6 rounded-full"
            >
              {endState.length === 0 ? 'Create End State' : 'Edit End State'}
            </button>
          )}
        </div>
        
        {/* State displays */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {startState.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Start State</h2>
                <div className="bg-white p-4 rounded-md shadow-md min-h-32 flex items-center justify-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-full">
                    {startState.map((obj, idx) => (
                      <div key={idx} className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        {obj.type === 'circle' ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        ) : obj.type === 'triangle' ? (
                          <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
                        ) : obj.type === 'square' ? (
                          <div className="w-10 h-10 bg-gray-300"></div>
                        ) : obj.type === 'star' ? (
                          <div className="w-10 h-10 bg-gray-300 clip-star"></div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 clip-hexagon"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {endState.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">End State</h2>
                <div className="bg-white p-4 rounded-md shadow-md min-h-32 flex items-center justify-center">
                  <div className="flex flex-wrap justify-center gap-2 max-w-full">
                    {endState.map((obj, idx) => (
                      <div key={idx} className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        {obj.type === 'circle' ? (
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        ) : obj.type === 'triangle' ? (
                          <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
                        ) : obj.type === 'square' ? (
                          <div className="w-10 h-10 bg-gray-300"></div>
                        ) : obj.type === 'star' ? (
                          <div className="w-10 h-10 bg-gray-300 clip-star"></div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 clip-hexagon"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit and Reset buttons */}
        {startState.length > 0 && (
          <div className="mt-8 flex justify-center gap-8">
            <button 
              onClick={handleSubmit}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
      {/* Rule creation modal */}
      {showRuleModal && (
        <RuleModal 
          availableObjects={availableObjects}
          onClose={() => setShowRuleModal(false)}
          onAddRule={handleAddRule}
        />
      )}
      
      {/* State creation/editing popup */}
      {showStateCreationPopup && (
        <StateCreationPopup 
          mode={stateCreationMode}
          availableObjects={availableObjects}
          rules={rules}
          startState={startState}
          endState={endState}
          setStartState={setStartStateAndSync}
          setEndState={setEndStateAndSync}
          applyRuleToEndState={applyRuleToEndState}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClose={() => setShowStateCreationPopup(false)}
        />
      )}
    </div>
  );
}