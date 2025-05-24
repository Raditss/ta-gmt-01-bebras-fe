import { useState } from "react";

// Rule Modal Component
export function RuleModal({ availableObjects, onClose, onAddRule }: { availableObjects: { id: number; type: string; icon: string }[]; onClose: () => void; onAddRule: (beforeObjects: any[], afterObjects: any[]) => void }) {
  const [beforeObjects, setBeforeObjects] = useState<{ id: number; type?: string; icon?: string }[]>([]);
  const [afterObjects, setAfterObjects] = useState<{ id: number; type?: string; icon?: string }[]>([]);
  
  const handleAddObject = (side: string, objectType: string) => {
    const newObject = availableObjects.find(obj => obj.type === objectType);
    if (side === 'before') {
      setBeforeObjects([...beforeObjects, { ...newObject, id: Date.now() }]);
    } else {
      setAfterObjects([...afterObjects, { ...newObject, id: Date.now() }]);
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
              {beforeObjects.map(obj => (
                <div key={obj.id} className="w-12 h-12 m-1 flex items-center justify-center">
                  {obj.type === 'circle' ? (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              {availableObjects.map(obj => (
                <button 
                  key={obj.id}
                  onClick={() => handleAddObject('before', obj.type)}
                  className="p-2 bg-gray-200 rounded-md"
                >
                  {obj.type === 'circle' ? '⚪' : '△'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">After (To)</h3>
            <div className="flex flex-wrap mb-4 min-h-16 p-2 border rounded-md">
              {afterObjects.map(obj => (
                <div key={obj.id} className="w-12 h-12 m-1 flex items-center justify-center">
                  {obj.type === 'circle' ? (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              {availableObjects.map(obj => (
                <button 
                  key={obj.id}
                  onClick={() => handleAddObject('after', obj.type)}
                  className="p-2 bg-gray-200 rounded-md"
                >
                  {obj.type === 'circle' ? '⚪' : '△'}
                </button>
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