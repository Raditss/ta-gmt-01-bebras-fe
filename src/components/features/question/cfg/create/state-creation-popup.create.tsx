import { Shape, ShapeContainer } from "@/components/features/question/cfg/shared/shape";
import { State } from "@/models/cfg/cfg.create.model";
import { useEffect, useState } from "react";

// State Creation Popup Component
export function StateCreationPopupCreate({
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
  onClose,
}: {
  mode: "start" | "end" | null;
  availableObjects: { id: number; type: string; icon: string }[];
  rules: {
    id: string;
    before: { type: string }[];
    after: { type: string }[];
  }[];
  startState: { id: number; type: string }[];
  endState: { id: number; type: string }[];
  setStartState: (state: State[]) => void;
  setEndState: (state: State[]) => void;
  applyRuleToEndState: (
    selectedIndices: any[],
    ruleToApply: { id: string; after: any }
  ) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClose: () => void;
}) {
  const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<
    { id: string; before: { type: string }[]; after: { type: string }[] }[]
  >([]);

  // For start state creation
  const addObjectToStartState = (obj: { type: string; id?: number }) => {
    setStartState([...startState, { ...obj, id: obj.id ?? Date.now() }]);
  };

  const removeFromStartState = (index: number) => {
    const newState = [...startState];
    newState.splice(index, 1);
    setStartState(newState);
  };

  // Check which rules can be applied to currently selected objects
  useEffect(() => {
    if (mode === "end" && selectedObjects.length > 0) {
      // Validate indices and get the actual objects from the indices
      const validSelectedObjects = selectedObjects.filter(
        (index) =>
          index >= 0 &&
          index < endState.length &&
          endState[index] &&
          endState[index].type
      );

      if (validSelectedObjects.length === 0) {
        setApplicableRules([]);
        return;
      }

      const selectedObjectTypes = validSelectedObjects.map(
        (index) => endState[index].type
      );

      // Find rules where the "before" part matches the selected objects
      const matchingRules = rules.filter((rule) => {
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
    if (mode !== "end") return;
    if (selectedObjects.includes(index)) {
      // If already selected, deselect it
      setSelectedObjects(selectedObjects.filter((i) => i !== index));
    } else {
      // Check if this selection is valid (must be in sequence)
      if (
        selectedObjects.length === 0 ||
        Math.abs(index - selectedObjects[selectedObjects.length - 1]) === 1 ||
        Math.abs(index - selectedObjects[0]) === 1
      ) {
        // Make sure all selections are consecutive
        const allIndices = [...selectedObjects, index].sort((a, b) => a - b);
        if (
          allIndices[allIndices.length - 1] - allIndices[0] ===
          allIndices.length - 1
        ) {
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
    rules.forEach((rule: { before: { type: any }[] }) => {
      rule.before.forEach((obj: { type: any }) => {
        if (!uniqueBeforeObjects.some((item) => item.type === obj.type)) {
          uniqueBeforeObjects.push(obj);
        }
      });
    });

    return uniqueBeforeObjects.length > 0
      ? uniqueBeforeObjects
      : availableObjects;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-400 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "start" ? "Create Start State" : "Create End State"}
        </h2>

        {/* Undo/Redo/Reset Buttons */}
        {mode === "end" && (
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

        <div className="bg-white p-6 rounded-md shadow-md mb-6">
          <div className="flex flex-wrap justify-center gap-2 min-h-[8rem] max-h-[24rem] overflow-y-auto p-4">
            {mode === "start"
              ? startState
                  .filter((obj) => obj && obj.type)
                  .map((obj, idx) => {
                    // Find the original index in the unfiltered array
                    const originalIdx = startState.findIndex(
                      (item) => item === obj
                    );
                    return (
                      <ShapeContainer
                        key={obj.id || idx}
                        className="cursor-pointer hover:opacity-75 transition-opacity relative group"
                        onClick={() => removeFromStartState(originalIdx)}
                      >
                        <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
                        <Shape type={obj.type} size="md" />
                      </ShapeContainer>
                    );
                  })
              : endState
                  .filter((obj) => obj && obj.type)
                  .map((obj, idx) => {
                    // Find the original index in the unfiltered array
                    const originalIdx = endState.findIndex(
                      (item) => item === obj
                    );
                    return (
                      <ShapeContainer
                        key={obj.id || idx}
                        className={`cursor-pointer ${
                          selectedObjects.includes(originalIdx)
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        onClick={() => toggleObjectSelection(originalIdx)}
                      >
                        <Shape type={obj.type} size="md" />
                      </ShapeContainer>
                    );
                  })}
          </div>
        </div>

        {mode === "start" ? (
          <div className="text-center mb-4">
            <h3 className="font-medium mb-2">Available Objects</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {availableObjects.map((obj, idx) => (
                <ShapeContainer
                  key={idx}
                  className="bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                  onClick={() => addObjectToStartState(obj)}
                >
                  <Shape type={obj.type} size="md" />
                </ShapeContainer>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mb-4">
            <h3 className="font-medium mb-2">
              Available Rules for Selected Objects
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {applicableRules.length > 0 ? (
                applicableRules.map((rule, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyRuleToEndState(selectedObjects, rule)}
                    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2"
                  >
                    <div className="flex flex-wrap gap-1 max-w-[8rem]">
                      {rule.before
                        .filter((obj) => obj && obj.type)
                        .map((obj, idx) => (
                          <ShapeContainer key={idx}>
                            <Shape type={obj.type} size="sm" />
                          </ShapeContainer>
                        ))}
                    </div>
                    <span>→</span>
                    <div className="flex flex-wrap gap-1 max-w-[8rem]">
                      {rule.after
                        .filter((obj) => obj && obj.type)
                        .map((obj, idx) => (
                          <ShapeContainer key={idx}>
                            <Shape type={obj.type} size="sm" />
                          </ShapeContainer>
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
