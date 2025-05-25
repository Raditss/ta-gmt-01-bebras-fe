import { useEffect } from "react";

// Rules Section Component
export function RulesSection({ rules, onAddRule, onDeleteRule }: { 
  rules: { id: string; before: any[]; after: any[] }[]; 
  onAddRule: () => void;
  onDeleteRule: (ruleId: string) => void;
}) {
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className="grid grid-cols-[1fr,1fr,auto] border-b">
        <div className="p-4 text-center font-medium border-r">Before</div>
        <div className="p-4 text-center font-medium border-r">After</div>
        <div className="p-4 text-center font-medium w-24">Action</div>
      </div>
      
      {rules.map(rule => (
        <div key={rule.id} className="grid grid-cols-[1fr,1fr,auto] border-b">
          <div className="p-6 flex justify-center items-center border-r">
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {rule.before.map((obj, idx) => (
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
          <div className="p-6 flex justify-center items-center border-r">
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {rule.after.map((obj, idx) => (
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
          <div className="p-6 flex justify-center items-center w-24">
            <button
              onClick={() => onDeleteRule(rule.id)}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      <div className="p-4 flex justify-center">
        <button 
          onClick={onAddRule}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full"
        >
          + Add Rule
        </button>
      </div>
    </div>
  );
}