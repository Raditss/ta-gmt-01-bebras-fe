import { useEffect } from "react";

// Rules Section Component
export function RulesSection({ rules, onAddRule }: { rules: { id: string; before: any[]; after: any[] }[]; onAddRule: () => void }) {
  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className="grid grid-cols-2 border-b">
        <div className="p-4 text-center font-medium border-r">Before</div>
        <div className="p-4 text-center font-medium">After</div>
      </div>
      
      {rules.map(rule => (
        <div key={rule.id} className="grid grid-cols-2 border-b">
          <div className="p-6 flex justify-center items-center border-r">
            {rule.before.map((obj, idx) => (
              <div key={idx} className="w-16 h-16 mx-2 flex items-center justify-center">
                {obj.type === 'circle' ? (
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                ) : (
                  <div className="w-12 h-12 bg-gray-300 clip-triangle"></div>
                )}
              </div>
            ))}
          </div>
          <div className="p-6 flex justify-center items-center">
            {rule.after.map((obj, idx) => (
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