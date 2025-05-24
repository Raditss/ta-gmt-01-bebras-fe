"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/components/cfg-create-question/header';
import { RulesSection } from '@/components/cfg-create-question/rule-section';
import { RuleModal } from '@/components/cfg-create-question/rule-modal';
import { StateCreationPopup } from '@/components/cfg-create-question/state-creation-popup';
import { useParams } from 'next/navigation';
import { CfgCreateQuestion, State, Rule } from '@/model/cfg-create-question/model';
import { nanoid } from 'nanoid';

// Main application component
export default function SolvePage() {
  const params = useParams();
  const id = params?.id as string;

  const [cfgQuestion] = useState(() => new CfgCreateQuestion("Untitled Question", id));

  // Fixed applyRuleToEndState to properly replace selected items with rule's "after" objects
  const applyRuleToEndState = (selectedIndices: number[], ruleToApply: { id: string; after: any[]; }) => {
    if (ruleToApply && selectedIndices.length > 0) {
      const sortedIndices = [...selectedIndices].sort((a, b) => a - b);
      const startIdx = sortedIndices[0];
      const endIdx = sortedIndices[sortedIndices.length - 1];
      const currentEndState = [...endState];

      // Only generate new ids for the objects, not for the rule
      const afterWithIds = ruleToApply.after.map(obj => ({
        ...obj,
        id: Date.now() + Math.random()
      }));

      currentEndState.splice(startIdx, endIdx - startIdx + 1, ...afterWithIds);

      // Use the rule's id as passed in
      cfgQuestion.pushStep({ 
        ruleId: ruleToApply.id, 
        index: startIdx,
        replacedCount: selectedIndices.length
      });

      setEndState(currentEndState);
    }
  };

  const [rules, setRules] = useState(cfgQuestion.rules);
  const [startState, setStartState] = useState(cfgQuestion.startState);
  const [endState, setEndState] = useState(cfgQuestion.endState);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showStateCreationPopup, setShowStateCreationPopup] = useState(false);
  const [stateCreationMode, setStateCreationMode] = useState<'start' | 'end' | null>(null);
  
  // Available objects for the game (these would be your predefined objects)
  const availableObjects = [
    { id: 1, type: 'circle', icon: '⚪' },
    { id: 2, type: 'triangle', icon: '△' }
  ];
  
  const handleAddRule = (beforeObjects: any, afterObjects: any) => {
    // Use nanoid for unique rule IDs
    const newRuleId = nanoid();
    setRules([...rules, { id: newRuleId, before: beforeObjects, after: afterObjects }]);
    setShowRuleModal(false);
  };
  
  const handleSubmit = () => {
    // Prepare data for API submission
    const questionData = {
      id, // include the id here
      rules,
      startState,
      endState
    };
    
    console.log('Question data ready for submission:', questionData);
    // Here you would send the data to your API
    alert('Ready to submit question data!');
  };

  // Set rules
  const setRulesAndSync = (newRules: Rule[]) => {
    cfgQuestion.setRules(newRules);
    setRules([...cfgQuestion.rules]);
  };

  // Set start state
  const setStartStateAndSync = (newState: State[]) => {
    cfgQuestion.setStartState(newState);
    setStartState([...cfgQuestion.startState]);
  };

  // Set end state
  const setEndStateAndSync = (newState: State[]) => {
    // Only sync to model, don't interfere with step tracking
    setEndState([...newState]);
  };

  const handleUndo = () => {
    const lastStep = cfgQuestion.popStep();
    if (lastStep) {
      // Replay all remaining steps from initial state to get the state before the last step
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      setEndState(newEndState);
      console.log('Undo - remaining steps:', cfgQuestion.getSteps().length);
    }
  };

  const handleRedo = () => {
    const step = cfgQuestion.redoStep();
    if (step) {
      // Replay all steps (now including the re-added step) from initial state
      const newEndState = cfgQuestion.replayStepsFromInitialEndState();
      setEndState(newEndState);
      console.log('Redo - current steps:', cfgQuestion.getSteps().length);
    }
  };

  // Reset everything to initial state
  const handleReset = () => {
    cfgQuestion.resetSteps();
    setRulesAndSync([]);
    setStartStateAndSync([]);
    setEndStateAndSync([]);
  };
  
  // Initialize end state with start state when switching to end state mode
  useEffect(() => {
    if (stateCreationMode === 'end' && endState.length === 0) {
      const initialEndState = [...startState];
      setEndState(initialEndState);
      // Set the initial end state in the model for proper undo/redo functionality
      cfgQuestion.setInitialEndState(initialEndState);
    }
  }, [stateCreationMode]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .clip-triangle {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setRules([...cfgQuestion.rules]);
    setStartState([...cfgQuestion.startState]);
    setEndState([...cfgQuestion.endState]);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        {/* Rules Section */}
        <RulesSection 
          rules={rules} 
          onAddRule={() => setShowRuleModal(true)} 
        />
        
        {/* State Creation Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {startState.length === 0 ? (
            <button 
              onClick={() => {
                setShowStateCreationPopup(true);
                setStateCreationMode('start');
              }}
              className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold py-3 px-6 rounded-full"
            >
              Create Start State
            </button>
          ) : endState.length === 0 ? (
            <button 
              onClick={() => {
                setShowStateCreationPopup(true);
                setStateCreationMode('end');
              }}
              className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold py-3 px-6 rounded-full"
            >
              Create End State
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 px-8 rounded-full"
            >
              Submit
            </button>
          )}
          <button
            onClick={handleReset}
            className="bg-red-200 hover:bg-red-300 text-black font-bold py-2 px-4 rounded-full"
          >
            Reset
          </button>
        </div>
        
        {/* State Display */}
        {(startState.length > 0 || endState.length > 0) && (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-8">
              {startState.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Start State</h2>
                  <div className="bg-white p-4 rounded-md shadow-md min-h-32 flex items-center justify-center">
                    <div className="flex">
                      {startState.map((obj, idx) => (
                        <div key={idx} className="w-16 h-16 mx-2 flex items-center justify-center">
                          {obj.type === 'circle' ? (
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 clip-triangle"></div>
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
                    <div className="flex">
                      {endState.map((obj, idx) => (
                        <div key={idx} className="w-16 h-16 mx-2 flex items-center justify-center">
                          {obj.type === 'circle' ? (
                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 clip-triangle"></div>
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
      </div>
      
      {/* Modals */}
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