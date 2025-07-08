"use client";

import { useState } from "react";
import { Shape, ShapeContainer } from "@/components/features/question/cfg/shared/shape";

export function RuleModalCreate({
  availableObjects,
  onClose,
  onAddRule,
}: {
  availableObjects: { id: number; type: string; icon: string }[];
  onClose: () => void;
  onAddRule: (beforeObjects: any[], afterObjects: any[]) => void;
}) {
  const [beforeObjects, setBeforeObjects] = useState<
    { id: number; type: string; icon: string }[]
  >([]);
  const [afterObjects, setAfterObjects] = useState<
    { id: number; type: string; icon: string }[]
  >([]);

  const handleAddObject = (side: string, objectType: string) => {
    const newObject = availableObjects.find((obj) => obj.type === objectType);
    if (!newObject) {
      console.error("Object type not found:", objectType);
      return;
    }

    const objectToAdd = {
      id: Date.now() + Math.random(), // Ensure unique ID
      type: newObject.type,
      icon: newObject.icon,
    };

    if (side === "before") {
      setBeforeObjects([...beforeObjects, objectToAdd]);
    } else {
      setAfterObjects([...afterObjects, objectToAdd]);
    }
  };

  const handleRemoveObject = (side: string, index: number) => {
    if (side === "before") {
      const newObjects = [...beforeObjects];
      newObjects.splice(index, 1);
      setBeforeObjects(newObjects);
    } else {
      const newObjects = [...afterObjects];
      newObjects.splice(index, 1);
      setAfterObjects(newObjects);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Add Production Rule</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Before (From)</h3>
            <div className="flex flex-wrap mb-4 min-h-16 p-2 border rounded-md">
              {beforeObjects.map((obj, idx) => (
                <ShapeContainer
                  key={obj.id}
                  className="m-1 cursor-pointer hover:opacity-75 transition-opacity relative group"
                  onClick={() => handleRemoveObject("before", idx)}
                >
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
                  <Shape type={obj.type} size="md" />
                </ShapeContainer>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableObjects.map((obj) => (
                <ShapeContainer
                  key={obj.id}
                  className="bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleAddObject("before", obj.type)}
                >
                  <Shape type={obj.type} size="md" />
                </ShapeContainer>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">After (To)</h3>
            <div className="flex flex-wrap mb-4 min-h-16 p-2 border rounded-md">
              {afterObjects.map((obj, idx) => (
                <ShapeContainer
                  key={obj.id}
                  className="m-1 cursor-pointer hover:opacity-75 transition-opacity relative group"
                  onClick={() => handleRemoveObject("after", idx)}
                >
                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 rounded transition-opacity"></div>
                  <Shape type={obj.type} size="md" />
                </ShapeContainer>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableObjects.map((obj) => (
                <ShapeContainer
                  key={obj.id}
                  className="bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleAddObject("after", obj.type)}
                >
                  <Shape type={obj.type} size="md" />
                </ShapeContainer>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onAddRule(beforeObjects, afterObjects)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded"
            disabled={beforeObjects.length === 0 || afterObjects.length === 0}
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}
