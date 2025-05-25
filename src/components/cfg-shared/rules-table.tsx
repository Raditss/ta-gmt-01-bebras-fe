import { Rule } from "@/model/cfg/create-question/model";

interface RulesTableProps {
  rules: Rule[];
  showActions?: boolean;
  onDeleteRule?: (ruleId: string) => void;
}

export function RulesTable({ rules, showActions = false, onDeleteRule }: RulesTableProps) {
  const RuleShape = ({ type }: { type: string }) => (
    <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
      {type === 'circle' ? (
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      ) : type === 'triangle' ? (
        <div className="w-10 h-10 bg-gray-300 clip-triangle"></div>
      ) : type === 'square' ? (
        <div className="w-10 h-10 bg-gray-300"></div>
      ) : type === 'star' ? (
        <div className="w-10 h-10 bg-gray-300 clip-star"></div>
      ) : (
        <div className="w-10 h-10 bg-gray-300 clip-hexagon"></div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className={`grid ${showActions ? 'grid-cols-[1fr,1fr,auto]' : 'grid-cols-2'} border-b`}>
        <div className="p-4 text-center font-medium border-r">Before</div>
        <div className={`p-4 text-center font-medium ${showActions ? 'border-r' : ''}`}>After</div>
        {showActions && <div className="p-4 text-center font-medium w-24">Action</div>}
      </div>
      
      {rules.map(rule => (
        <div key={rule.id} className={`grid ${showActions ? 'grid-cols-[1fr,1fr,auto]' : 'grid-cols-2'} border-b`}>
          <div className="p-6 flex justify-center items-center border-r">
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {rule.before.map((obj, idx) => (
                <RuleShape key={idx} type={obj.type} />
              ))}
            </div>
          </div>
          <div className={`p-6 flex justify-center items-center ${showActions ? 'border-r' : ''}`}>
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {rule.after.map((obj, idx) => (
                <RuleShape key={idx} type={obj.type} />
              ))}
            </div>
          </div>
          {showActions && (
            <div className="p-6 flex justify-center items-center w-24">
              <button
                onClick={() => onDeleteRule?.(rule.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 