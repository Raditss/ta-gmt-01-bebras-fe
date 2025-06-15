"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { RulesSection } from '@/components/cfg-create-question/rule-section';
import { RuleModal } from '@/components/cfg-create-question/rule-modal';
import { StateCreationPopup } from '@/components/cfg-create-question/state-creation-popup';
import { State, Rule } from '@/model/cfg/create-question/model';
import { CfgCreateQuestion } from '@/model/cfg/create-question/model';
import { useCreation } from '@/hooks/useCreation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageNavigationGuard } from '@/hooks/usePageNavigationGuard';
import { CreationSubmissionModal } from './submission-modal';
import { BaseCreatorProps, CreatorWrapper } from './base-creator';
import { CreationData } from '@/services/creationService';
import { StateDisplay } from '@/components/cfg-solve/state-display';
import { useAuth } from '@/lib/auth';

// Available shapes for creating rules and states
const availableShapes = [
  { id: 1, type: 'circle', icon: '⚪' },
  { id: 2, type: 'triangle', icon: '△' },
  { id: 3, type: 'square', icon: '⬜' },
  { id: 4, type: 'star', icon: '⭐' },
  { id: 5, type: 'hexagon', icon: '⬡' }
];

// Type for shape objects (compatible with State interface)
interface ShapeObject {
  id: number;
  type: string;
  [key: string]: unknown;
}

// Helper function to create question instance (moved outside component to prevent re-creation)
const createQuestionInstance = (data: CreationData): CfgCreateQuestion => {
  try {
    console.log('Creating CFG question instance with data:', data);
    
    // Ensure all required fields have valid values
    const safeData = {
      title: data.title || 'Untitled Question',
      description: data.description || '',
      difficulty: data.difficulty || 'Easy',
      category: data.category || 'Context-Free Grammar',
      points: data.points || 100,
      estimatedTime: data.estimatedTime || 30,
      author: data.author || 'Unknown',
      questionId: data.questionId || `temp-${Date.now()}`,
      creatorId: data.creatorId || 'temp-user'
    };
    
    const instance = new CfgCreateQuestion(
      safeData.title,
      safeData.description,
      safeData.difficulty as 'Easy' | 'Medium' | 'Hard',
      safeData.category,
      safeData.points,
      safeData.estimatedTime,
      safeData.author,
      safeData.questionId,
      safeData.creatorId
    );
    
    console.log('CFG question instance created successfully');
    return instance;
  } catch (error) {
    console.error('Error creating CFG question instance:', error);
    console.error('Data that caused error:', data);
    throw error;
  }
};

export default function CfgCreator({ questionId, initialData }: BaseCreatorProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // IMPORTANT: All hooks must be called at the top level to avoid React error #310
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Always call useCreation hook - never conditionally
  const {
    question,
    loading,
    saving,
    error: creationError,
    hasUnsavedChanges,
    lastSavedDraft,
    saveDraft,
    submitCreation,
    markAsChanged
  } = useCreation({
    questionId,
    questionType: 'cfg',
    initialData,
    createQuestionInstance
  });

  // ALL hooks must be called at the top level - move navigation guard here
  const {
    showDialog: showNavigationDialog,
    onSaveAndLeave: handleSaveAndLeave,
    onLeaveWithoutSaving: handleLeaveWithoutSaving,
    onStayOnPage: handleStayOnPage,
    setShowDialog,
  } = usePageNavigationGuard({
    hasUnsavedChanges,
    onSave: saveDraft
  });

  // ALL useState hooks at top level
  const [rules, setRules] = useState<Rule[]>([]);
  const [startState, setStartState] = useState<State[]>([]);
  const [endState, setEndState] = useState<State[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showStateCreationPopup, setShowStateCreationPopup] = useState(false);
  const [stateCreationMode, setStateCreationMode] = useState<'start' | 'end' | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  
  // ALL useEffect hooks at top level
  // Sync local state with question model
  useEffect(() => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) {
      return;
    }
    
    setRules(cfgQuestion.rules || []);
    setStartState(cfgQuestion.startState || []);
    setEndState(cfgQuestion.endState || []);
  }, [question]);

  // Auto-hide save confirmation
  useEffect(() => {
    if (showSaveConfirmation) {
      const timer = setTimeout(() => setShowSaveConfirmation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveConfirmation]);

  // Initialize end state with start state when entering end state mode
  useEffect(() => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (stateCreationMode === 'end' && endState.length === 0 && startState.length > 0) {
      const initialEndState = [...startState];
      setEndState(initialEndState);
      if (cfgQuestion) {
        cfgQuestion.setInitialEndState(initialEndState);
        markAsChanged();
      }
    }
     }, [stateCreationMode, endState.length, startState, question, markAsChanged]);

  // ALL useCallback hooks at top level to avoid React error #310
  // Add a new transformation rule
  const handleAddRule = useCallback((beforeObjects: ShapeObject[], afterObjects: ShapeObject[]) => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    
    const newRuleId = nanoid();
    const newRule = { id: newRuleId, before: beforeObjects, after: afterObjects };
    const updatedRules = [...rules, newRule];
    
    console.log('🔄 CFG CREATOR - Adding rule:', newRule);
    cfgQuestion.setRules(updatedRules);
    setRules(updatedRules);
    setShowRuleModal(false);
    
    console.log('🔄 CFG CREATOR - Content after rule added:', cfgQuestion.contentToString());
    markAsChanged();
  }, [question, rules, markAsChanged]);

  const handleDeleteRule = useCallback((ruleId: string) => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    cfgQuestion.setRules(updatedRules);
    setRules(updatedRules);
    
    // Reset end state when rules change
    if (endState.length > 0) {
      const newEndState = [...startState];
      cfgQuestion.setEndState(newEndState);
      setEndState(newEndState);
    }
    
    markAsChanged();
  }, [question, rules, startState, endState, markAsChanged]);

  const setStartStateAndSync = useCallback((newState: State[]) => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    
    console.log('🔄 CFG CREATOR - Setting start state:', newState);
    cfgQuestion.setStartState(newState);
    setStartState(newState);
    
    // Reset end state when start state changes
    if (endState.length > 0) {
      const newEndState = [...newState];
      cfgQuestion.setEndState(newEndState);
      setEndState(newEndState);
    }
    
    console.log('🔄 CFG CREATOR - Content after start state change:', cfgQuestion.contentToString());
    markAsChanged();
  }, [question, endState, markAsChanged]);

  const setEndStateAndSync = useCallback((newState: State[]) => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    
    cfgQuestion.setEndState(newState);
    setEndState(newState);
    markAsChanged();
  }, [question, markAsChanged]);

  // Handles undoing the last step by replaying remaining steps from initial state
  const handleUndo = useCallback(() => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    const lastStep = cfgQuestion.popStep();
    if (lastStep) {
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      cfgQuestion.setEndState(newEndState); // Sync to question model
      setEndState(newEndState);
      markAsChanged();
    }
  }, [question, markAsChanged]);

  // Handles redoing the last undone step by replaying all steps including the redone one
  const handleRedo = useCallback(() => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    const step = cfgQuestion.redoStep();
    if (step) {
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      cfgQuestion.setEndState(newEndState); // Sync to question model
      setEndState(newEndState);
      markAsChanged();
    }
  }, [question, markAsChanged]);

  // Reset entire question state
  const handleReset = useCallback(() => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion) return;
    
    cfgQuestion.resetSteps();
    cfgQuestion.setRules([]);
    cfgQuestion.setStartState([]);
    cfgQuestion.setEndState([]);
    
    setRules([]);
    setStartState([]);
    setEndState([]);
    markAsChanged();
  }, [question, markAsChanged]);

  // Applies a rule to selected objects in the end state
  const applyRuleToEndState = useCallback((selectedIndices: number[], ruleToApply: { id: string; after: ShapeObject[]; }) => {
    const cfgQuestion = question as CfgCreateQuestion | null;
    if (!cfgQuestion || !ruleToApply || selectedIndices.length === 0) return;

    // Validate that the rule has proper 'after' objects
    if (!ruleToApply.after || !Array.isArray(ruleToApply.after)) {
      console.error('Rule has invalid after array:', ruleToApply);
      return;
    }

    // Validate that all 'after' objects have required properties
    const invalidObjects = ruleToApply.after.filter(obj => !obj || typeof obj.type !== 'string');
    if (invalidObjects.length > 0) {
      console.error('Rule contains invalid after objects:', invalidObjects);
      return;
    }

    const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
    const startIdx = sortedIndices[0];
    const endIdx = sortedIndices[sortedIndices.length - 1];
    const currentEndState = [...endState];

    // Add unique IDs to new objects and ensure they have all required properties
    const afterWithIds = ruleToApply.after.map(obj => {
      const newObj: ShapeObject = {
        id: Date.now() + Math.random(),
        type: obj.type
      };
      
      // Preserve any other properties like icon if they exist
      if (obj.icon) {
        newObj.icon = obj.icon;
      }
      
      return newObj;
    });

    // Replace selected objects with rule's output
    currentEndState.splice(startIdx, endIdx - startIdx + 1, ...afterWithIds);

    // Validate the new end state before setting it
    const validatedEndState = currentEndState.filter(obj => obj && typeof obj === 'object' && obj.type);
    
    if (validatedEndState.length !== currentEndState.length) {
      console.warn('Some invalid objects were filtered out from end state');
    }

    // Update the question model with the new end state
    cfgQuestion.setEndState(validatedEndState);
    
    // Record step for undo/redo
    cfgQuestion.pushStep({ 
      ruleId: ruleToApply.id, 
      index: startIdx,
      replacedCount: selectedIndices.length,
      endState: validatedEndState
    });

    setEndState(validatedEndState);
    markAsChanged();
  }, [question, endState, markAsChanged]);

  // Handle manual save
  const handleManualSave = useCallback(async () => {
    try {
      console.log('💾 CFG CREATOR - Manual save triggered');
      if (cfgQuestion) {
        console.log('💾 CFG CREATOR - Current content before save:', cfgQuestion.contentToString());
        console.log('💾 CFG CREATOR - Current state:', {
          rulesCount: cfgQuestion.rules?.length || 0,
          startStateCount: cfgQuestion.startState?.length || 0,
          endStateCount: cfgQuestion.endState?.length || 0,
          stepsCount: cfgQuestion.getSteps()?.length || 0
        });
      }
      
      await saveDraft();
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [saveDraft, cfgQuestion]);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (!question || !startState.length) return;
    setShowSubmissionModal(true);
  }, [question, startState.length]);

  const handleConfirmSubmit = useCallback(async () => {
    if (!question) return;
    
    try {
      await submitCreation();
      router.push('/add-problem'); // Redirect after successful submission
    } catch (error) {
      console.error('Failed to submit creation:', error);
      setShowSubmissionModal(false);
    }
  }, [question, submitCreation, router]);

  const getQuestionData = useCallback(() => {
    if (!question) return null;
    
    return {
      title: question.getTitle(),
      description: question.getDescription(),
      difficulty: question.getDifficulty(),
      category: question.getCategory(),
      points: question.getPoints(),
      estimatedTime: question.getEstimatedTime(),
      author: question.getAuthor()
    };
  }, [question]);
   
  // Type-safe CFG question accessor
  const cfgQuestion = question as CfgCreateQuestion | null;

  // Handle loading states AFTER hooks are called
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state AFTER hooks are called
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg mb-4">Authentication required to create questions</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CreatorWrapper
      loading={loading}
      error={creationError}
      hasUnsavedChanges={hasUnsavedChanges}
      showNavigationDialog={showNavigationDialog}
      onSaveAndLeave={handleSaveAndLeave}
      onLeaveWithoutSaving={handleLeaveWithoutSaving}
      onStayOnPage={handleStayOnPage}
      onSetShowDialog={setShowDialog}
    >
      {question ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {questionId === 'new' ? 'Create New CFG Question' : 'Edit CFG Question'}
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

          {/* Guidance for empty questions */}
          {rules.length === 0 && startState.length === 0 && (
            <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Getting Started:</strong> To create a CFG question, you need to:
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Add transformation rules using the "Add Rule" button below</li>
                  <li>Create a start state with initial objects</li>
                  <li>Define the target end state</li>
                </ol>
                Your question will be saved automatically as you add content.
              </AlertDescription>
            </Alert>
          )}

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
          
          {/* State displays using shared component */}
          {(startState.length > 0 || endState.length > 0) && (
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {startState.length > 0 && (
                  <StateDisplay 
                    title="Start State"
                    state={startState}
                    containerClassName="bg-white"
                  />
                )}
                
                {endState.length > 0 && (
                  <StateDisplay 
                    title="End State"
                    state={endState}
                    containerClassName="bg-white"
                  />
                )}
              </div>
            </div>
          )}

          {/* Submit and Reset buttons */}
          {startState.length > 0 && (
            <div className="mt-8 flex justify-center gap-8">
              <button 
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full"
              >
                Submit Question
              </button>
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full"
              >
                Reset
              </button>
            </div>
          )}

          {/* Rule creation modal */}
          {showRuleModal && (
            <RuleModal 
              availableObjects={availableShapes}
              onClose={() => setShowRuleModal(false)}
              onAddRule={handleAddRule}
            />
          )}
          
          {/* State creation/editing popup */}
          {showStateCreationPopup && (
            <StateCreationPopup 
              mode={stateCreationMode}
              availableObjects={availableShapes}
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

          {/* Submission Modal */}
          <CreationSubmissionModal
            isOpen={showSubmissionModal}
            isConfirming={!saving}
            questionData={getQuestionData()}
            onConfirm={handleConfirmSubmit}
            onCancel={() => setShowSubmissionModal(false)}
            onClose={() => {
              setShowSubmissionModal(false);
              router.push('/add-problem');
            }}
          />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No question data available</p>
        </div>
      )}
    </CreatorWrapper>
  );
} 