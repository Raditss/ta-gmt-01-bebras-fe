import {
  Shape,
  ShapeContainer
} from '@/components/features/question/cfg/shared/shape';
import { State } from '@/models/cfg/cfg.create.model';
import { useEffect, useState } from 'react';

// State Creation Popup Component
export function StateCreationPopupCreate({
  mode,
  availableObjects,
  rules,
  startState,
  endState,
  setStartState,
  setEndState: _setEndState,
  applyRuleToEndState,
  onUndo,
  onRedo,
  onClose
}: {
  mode: 'start' | 'end' | null;
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
    selectedIndices: number[],
    ruleToApply: {
      id: string;
      before: { type: string }[];
      after: { type: string }[];
    }
  ) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClose: () => void;
}) {
  const [selectedObjects, setSelectedObjects] = useState<number[]>([]);
  const [applicableRules, setApplicableRules] = useState<
    { id: string; before: { type: string }[]; after: { type: string }[] }[]
  >([]);

  // Local state for start state creation (don't save until "Done" is clicked)
  const [localStartState, setLocalStartState] = useState<State[]>(startState);

  // For start state creation
  const addObjectToStartState = (obj: { type: string; id?: number }) => {
    setLocalStartState([
      ...localStartState,
      { ...obj, id: obj.id ?? Date.now() }
    ]);
  };

  const removeFromStartState = (index: number) => {
    const newState = [...localStartState];
    newState.splice(index, 1);
    setLocalStartState(newState);
  };

  // Check which rules can be applied to currently selected objects
  useEffect(() => {
    if (mode === 'end' && selectedObjects.length > 0) {
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
    if (mode !== 'end') return;
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

  // Get available objects based on mode (unused but kept for potential future use)
  const _getAvailableObjectsForStart = () => {
    if (rules.length === 0) return availableObjects;

    // Extract unique object types from the "before" part of rules
    const uniqueBeforeObjects: { type: string }[] = [];
    rules.forEach((rule: { before: { type: string }[] }) => {
      rule.before.forEach((obj: { type: string }) => {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto border shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
          {mode === 'start' ? 'Buat Keadaan Awal' : 'Buat Keadaan Akhir'}
        </h2>

        {/* Undo/Redo/Reset Buttons */}
        {mode === 'end' && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={onUndo}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-md transition-colors"
            >
              Urungkan
            </button>
            <button
              onClick={onRedo}
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-md transition-colors"
            >
              Ulangi
            </button>
          </div>
        )}

        <div className="bg-background border rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-wrap justify-center gap-3 min-h-[10rem] max-h-[20rem] overflow-y-auto p-4">
            {mode === 'start'
              ? localStartState
                  .filter((obj) => obj && obj.type)
                  .map((obj, idx) => {
                    // Find the original index in the unfiltered array
                    const originalIdx = localStartState.findIndex(
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
                            ? 'ring-2 ring-blue-500'
                            : ''
                        }`}
                        onClick={() => toggleObjectSelection(originalIdx)}
                      >
                        <Shape type={obj.type} size="md" />
                      </ShapeContainer>
                    );
                  })}
          </div>
        </div>

        {mode === 'start' ? (
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-4 text-foreground">
              Objek yang Tersedia
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {availableObjects.map((obj, idx) => (
                <div
                  key={idx}
                  className="bg-secondary hover:bg-secondary/80 rounded-lg cursor-pointer transition-colors p-3 flex items-center justify-center"
                  onClick={() => addObjectToStartState(obj)}
                >
                  <Shape type={obj.type} size="md" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <h3 className="font-semibold mb-4 text-foreground">
              Aturan yang Tersedia untuk Objek yang Dipilih
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {applicableRules.length > 0 ? (
                applicableRules.map((rule, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyRuleToEndState(selectedObjects, rule)}
                    className="p-4 bg-secondary hover:bg-secondary/80 rounded-lg flex items-center space-x-3 transition-colors border"
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
                    <span className="text-foreground font-medium">→</span>
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
                <p className="text-muted-foreground">
                  Tidak ada aturan yang cocok untuk objek yang dipilih
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              if (mode === 'start') {
                // Save the local start state when Done is clicked
                setStartState(localStartState);
              }
              onClose();
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
