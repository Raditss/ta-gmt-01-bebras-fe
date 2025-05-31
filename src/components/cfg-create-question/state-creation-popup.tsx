import { State } from "@/model/cfg-create-question/model";
import { useState, useEffect } from "react";

// State Creation Popup Component
export function StateCreationPopup({ 
  mode, 
  availableObjects, 
  rules, 
  startState, 
  endState,
  setStartState, 
  setEndState, 
  applyRuleToEndState,
  onUndo,
  onRedo,
  onClose 
}: { 
  mode: 'start' | 'end' | null; 
  availableObjects: { id: number; type: string; icon: string }[]; 
  rules: { id: string; before: { type: string }[]; after: { type: string }[] }[]; 
  startState: { id: number; type: string }[]; 
  endState: { id: number; type: string }[]; 
  setStartState: ((state: State[]) => void);
  setEndState: ((state: State[]) => void);
  applyRuleToEndState: (selectedIndices: any[], ruleToApply: { id: string; after: any; }) => void; 
  onUndo: () => void;
  onRedo: () => void;
  onClose: () => void; 
}) {
  const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<{ id: string; before: { type: string }[]; after: { type: string }[] }[]>([]);
  
  // For start state creation
  const addObjectToStartState = (obj: { type: string; id?: number; }) => {
    setStartState([...startState, { ...obj, id: obj.id ?? Date.now() }]);
  };

  const removeFromStartState = (index: number) => {
    const newState = [...startState];
    newState.splice(index, 1);
    setStartState(newState);
  };
  
  // Check which rules can be applied to currently selected objects
  useEffect(() => {
    if (mode === 'end' && selectedObjects.length > 0) {
      // Get the actual objects from the indices
      const selectedObjectTypes = selectedObjects.map(index => endState[index].type);
      
      // Find rules where the "before" part matches the selected objects
      const matchingRules = rules.filter(rule => {
        if (rule.before.length !== selectedObjectTypes.length) return false;
        
        // Check if the types match in sequence
        for (let i = 0; i < rule.before.length; i++) {
          if (rule.before[i].type !== selectedObjectTypes[i]) return false;
        }
        
        return true;
      });
      
      setApplicableRules(matchingRules);
    }
  }, [selectedObjects, endState, rules, mode]);

  useEffect(() => {
    // Clear selection after undo/redo or any endState change
    setSelectedObjects([]);
  }, [endState]);
  
  // Handle selection of objects in end state
  const toggleObjectSelection = (index: number) => {
    if (mode !== 'end') return;
    if (selectedObjects.includes(index)) {
      // If already selected, deselect it
      setSelectedObjects(selectedObjects.filter(i => i !== index));
    } else {
      // Check if this selection is valid (must be in sequence)
      if (
        selectedObjects.length === 0 ||
        Math.abs(index - selectedObjects[selectedObjects.length - 1]) === 1 ||
        Math.abs(index - selectedObjects[0]) === 1
      ) {
        // Make sure all selections are consecutive
        const allIndices = [...selectedObjects, index].sort((a, b) => a - b);
        if (allIndices[allIndices.length - 1] - allIndices[0] === allIndices.length - 1) {
          setSelectedObjects(allIndices);
        }
      }
    }
  };
  
  // Get available objects based on mode
  const getAvailableObjectsForStart = () => {
    if (rules.length === 0) return availableObjects;
    
    // Extract unique object types from the "before" part of rules
    const uniqueBeforeObjects: any[] = [];
    rules.forEach((rule: { before: { type: any; }[]; }) => {
      rule.before.forEach((obj: { type: any; }) => {
        if (!uniqueBeforeObjects.some(item => item.type === obj.type)) {
          uniqueBeforeObjects.push(obj);
        }
      });
    });
    
    return uniqueBeforeObjects.length > 0 ? uniqueBeforeObjects : availableObjects;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-400 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'start' ? 'Create Start State' : 'Create End State'}
        </h2>

        {/* Undo/Redo/Reset Buttons */}
        {mode === 'end' && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={onUndo}
              className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
            >
              Undo
            </button>
            <button
              onClick={onRedo}
              className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-full"
            >
              Redo
            </button>
          </div>
        )}

        <div>
          <div className="bg-white p-6 rounded-md shadow-md mb-6">
            <div className="flex flex-wrap justify-center gap-2 min-h-[8rem] max-h-[24rem] overflow-y-auto p-4">
              {mode === 'start' ? startState.map((obj, idx) => (
                <div 
                  key={idx} 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-75 transition-opacity relative group"
                  onClick={() => removeFromStartState(idx)}
                >
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
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
              )) : endState.map((obj, idx) => (
                <div 
                  key={idx} 
                  className={`w-12 h-12 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                    selectedObjects.includes(idx) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleObjectSelection(idx)}
                >
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
          
          {mode === 'start' ? (
            <div className="text-center mb-4">
              <h3 className="font-medium mb-2">Available Objects</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {availableObjects.map((obj, idx) => (
                  <button 
                    key={idx}
                    onClick={() => addObjectToStartState(obj)}
                    className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300"
                  >
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
                  </button>
                ))}
              </div>
            </div>
          ) : selectedObjects.length > 0 && (
            <div className="text-center mb-4">
              <h3 className="font-medium mb-2">Available Rules</h3>
              <div className="flex flex-wrap justify-center gap-4 max-h-[16rem] overflow-y-auto p-4">
                {applicableRules.length > 0 ? (
                  applicableRules.map((rule, idx) => (
                    <button 
                      key={idx}
                      onClick={() => {
                        applyRuleToEndState(selectedObjects, {
                          after: rule.after,
                          id: rule.id
                        });
                        setSelectedObjects([]);
                      }}
                      className="p-4 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center space-x-2"
                    >
                      <div className="flex flex-wrap gap-1 max-w-[8rem]">
                        {rule.before.map((obj, idx) => (
                          <div key={idx} className="w-8 h-8">
                            {obj.type === 'circle' ? (
                              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                            ) : obj.type === 'triangle' ? (
                              <div className="w-6 h-6 bg-gray-400 clip-triangle"></div>
                            ) : obj.type === 'square' ? (
                              <div className="w-6 h-6 bg-gray-400"></div>
                            ) : obj.type === 'star' ? (
                              <div className="w-6 h-6 bg-gray-400 clip-star"></div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-400 clip-hexagon"></div>
                            )}
                          </div>
                        ))}
                      </div>
                      <span>→</span>
                      <div className="flex flex-wrap gap-1 max-w-[8rem]">
                        {rule.after.map((obj, idx) => (
                          <div key={idx} className="w-8 h-8">
                            {obj.type === 'circle' ? (
                              <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                            ) : obj.type === 'triangle' ? (
                              <div className="w-6 h-6 bg-gray-400 clip-triangle"></div>
                            ) : obj.type === 'square' ? (
                              <div className="w-6 h-6 bg-gray-400"></div>
                            ) : obj.type === 'star' ? (
                              <div className="w-6 h-6 bg-gray-400 clip-star"></div>
                            ) : (
                              <div className="w-6 h-6 bg-gray-400 clip-hexagon"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </button>
                  ))
                ) : (
                  <p>No matching rules for selected objects</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-full"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}