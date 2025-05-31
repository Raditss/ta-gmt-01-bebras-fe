"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { RulesSection } from '@/components/cfg-create-question/rule-section';
import { RuleModal } from '@/components/cfg-create-question/rule-modal';
import { StateCreationPopup } from '@/components/cfg-create-question/state-creation-popup';
import { useParams, useRouter } from 'next/navigation';
import { State, Rule } from '@/model/cfg/create-question/model';
import { nanoid } from 'nanoid';
import { MainNavbar } from '@/components/main-navbar';
import { useCfgQuestion } from '@/hooks/useCfgQuestion';
import { NavigationProtection } from '@/components/navigation-protection';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationAlertDialog } from '@/components/ui/navigation-alert-dialog';

export default function CfgCreateProblemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNewQuestion = id === 'new';
  const pendingNavigation = useRef<string | null>(null);

  const {
    question,
    loading,
    saving,
    error: questionError,
    hasUnsavedChanges,
    lastSavedDraft,
    updateQuestion,
    saveDraft
  } = useCfgQuestion(isNewQuestion ? undefined : id);

  const [rules, setRules] = useState<Rule[]>([]);
  const [startState, setStartState] = useState<State[]>([]);
  const [endState, setEndState] = useState<State[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showStateCreationPopup, setShowStateCreationPopup] = useState(false);
  const [stateCreationMode, setStateCreationMode] = useState<'start' | 'end' | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  
  const availableObjects = [
    { id: 1, type: 'circle', icon: '⚪' },
    { id: 2, type: 'triangle', icon: '△' },
    { id: 3, type: 'square', icon: '⬜' },
    { id: 4, type: 'star', icon: '⭐' },
    { id: 5, type: 'hexagon', icon: '⬡' }
  ];
  
  const handleAddRule = (beforeObjects: any, afterObjects: any) => {
    const newRuleId = nanoid();
    const newRule = { id: newRuleId, before: beforeObjects, after: afterObjects };
    const updatedRules = [...rules, newRule];
    setRulesAndSync(updatedRules);
    setShowRuleModal(false);
  };
  
  const handleSubmit = () => {
    const questionData = {
      id,
      rules,
      startState,
      endState
    };
    
    console.log('Question data ready for submission:', questionData);
    alert('Ready to submit question data!');
  };

  const setRulesAndSync = (newRules: Rule[]) => {
    if (question) {
      updateQuestion({ rules: newRules });
      setRules(newRules);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRulesAndSync(updatedRules);
    
    // If we have an end state, we need to reset it to match the start state
    // since the rules have changed
    if (endState.length > 0) {
      const newEndState = [...startState];
      setEndState(newEndState);
      updateQuestion({ endState: newEndState });
    }
  };

  // Update start state and propagate changes to end state if it exists
  const setStartStateAndSync = (newState: State[]) => {
    if (question) {
      updateQuestion({ startState: newState });
      setStartState(newState);
      
      // If we have an end state, we need to reset it to match the new start state
      if (endState.length > 0) {
        setEndState([...newState]);
        updateQuestion({ endState: [...newState] });
      }
    }
  };

  const setEndStateAndSync = (newState: State[]) => {
    if (question) {
      updateQuestion({ endState: newState });
      setEndState(newState);
    }
  };

  // Initialize states from question when it loads
  useEffect(() => {
    if (question) {
      setRules(question.rules);
      setStartState(question.startState);
      setEndState(question.endState);
    }
  }, [question]);

  // Applies a rule to selected objects in the end state, replacing them with the rule's "after" objects
  const applyRuleToEndState = (selectedIndices: number[], ruleToApply: { id: string; after: any[]; }) => {
    if (!question || !ruleToApply || selectedIndices.length === 0) return;

    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const startIdx = sortedIndices[0];
    const endIdx = sortedIndices[sortedIndices.length - 1];
    const currentEndState = [...endState];

    const afterWithIds = ruleToApply.after.map(obj => ({
      ...obj,
      id: Date.now() + Math.random()
    }));

    currentEndState.splice(startIdx, endIdx - startIdx + 1, ...afterWithIds);

    question.pushStep({ 
      ruleId: ruleToApply.id, 
      index: startIdx,
      replacedCount: selectedIndices.length,
      endState: currentEndState
    });

    setEndState(currentEndState);
  };

  // Handles undoing the last step by replaying remaining steps from initial state
  const handleUndo = () => {
    if (!question) return;
    const lastStep = question.popStep();
    if (lastStep) {
      const newEndState = question.replayStepsFromInitialEndState();
      setEndState(newEndState);
      console.log('Undo - remaining steps:', question.getSteps().length);
    }
  };

  // Handles redoing the last undone step by replaying all steps including the redone one
  const handleRedo = () => {
    if (!question) return;
    const step = question.redoStep();
    if (step) {
      const newEndState = question.replayStepsFromInitialEndState();
      setEndState(newEndState);
      console.log('Redo - current steps:', question.getSteps().length);
    }
  };

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
      updateQuestion({ endState: initialEndState });
    }
  }, [stateCreationMode]);

  // Handle navigation attempts
  const handleBeforeNavigate = useCallback(async () => {
    if (hasUnsavedChanges) {
      setShowNavigationDialog(true);
      return false; // Prevent navigation until user makes a choice
    }
    return true;
  }, [hasUnsavedChanges]);

  // Handle save and navigate
  const handleSaveAndLeave = useCallback(async () => {
    await saveDraft();
    setShowNavigationDialog(false);
    if (pendingNavigation.current) {
      router.push(pendingNavigation.current);
      pendingNavigation.current = null;
    }
  }, [saveDraft, router]);

  // Handle leave without saving
  const handleLeaveWithoutSaving = useCallback(() => {
    setShowNavigationDialog(false);
    if (pendingNavigation.current) {
      router.push(pendingNavigation.current);
      pendingNavigation.current = null;
    }
  }, [router]);

  // Handle staying on page
  const handleStayOnPage = useCallback(() => {
    setShowNavigationDialog(false);
    pendingNavigation.current = null;
  }, []);

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

  // Auto-hide save confirmation
  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => setShowSaveConfirmation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

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
      <NavigationProtection
        when={hasUnsavedChanges}
        onBeforeNavigate={handleBeforeNavigate}
      />
      
      <NavigationAlertDialog
        open={showNavigationDialog}
        onOpenChange={setShowNavigationDialog}
        onSaveAndLeave={handleSaveAndLeave}
        onLeaveWithoutSaving={handleLeaveWithoutSaving}
        onCancel={handleStayOnPage}
      />
      
      <MainNavbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isNewQuestion ? 'Create New CFG Question' : 'Edit CFG Question'}
          </h1>
          
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

        <RulesSection 
          rules={rules} 
          onAddRule={() => setShowRuleModal(true)}
          onDeleteRule={handleDeleteRule}
        />
        
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
        
        {(startState.length > 0 || endState.length > 0) && (
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
        )}

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
      
      {showRuleModal && (
        <RuleModal 
          availableObjects={availableObjects}
          onClose={() => setShowRuleModal(false)}
          onAddRule={handleAddRule}
        />
      )}
      
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