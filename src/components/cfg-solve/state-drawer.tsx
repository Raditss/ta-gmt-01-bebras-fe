import { useState } from 'react';
import { State, Rule } from '@/model/cfg/create-question/model';
import { StateDisplay } from './state-display';

interface StateDrawerProps {
  targetState: State[];
  currentState: State[];
  selectedIndices: number[];
  applicableRules: Rule[];
  onObjectClick: (index: number) => void;
  onApplyRule: (rule: Rule) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSubmit: () => Promise<void>;
}

export function StateDrawer({
  targetState,
  currentState,
  selectedIndices,
  applicableRules,
  onObjectClick,
  onApplyRule,
  onUndo,
  onRedo,
  onReset,
  onSubmit,
}: StateDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Drawer Content */}
      <div 
        className={`bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '60vh' }}
      >
        <div className="container mx-auto px-4 py-6 h-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Target State */}
            <StateDisplay
              title="Target State"
              state={targetState}
              containerClassName="bg-yellow-50"
            />
            
            {/* Current State with Undo/Redo */}
            <div className="space-y-4">
              <StateDisplay
                title="Current State"
                state={currentState}
                isInteractive={true}
                selectedIndices={selectedIndices}
                onObjectClick={onObjectClick}
                containerClassName="bg-blue-50 border-2 border-blue-200"
              />
              <div className="flex justify-center gap-4">
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
            </div>
          </div>

          {/* Applicable Rules */}
          {applicableRules.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Applicable Rules</h2>
              <div className="flex flex-wrap gap-4">
                {applicableRules.map((rule, idx) => (
                  <button
                    key={idx}
                    onClick={() => onApplyRule(rule)}
                    className="p-4 bg-green-50 hover:bg-green-100 rounded-md flex items-center space-x-2 border border-green-200"
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white shadow-lg p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-full"
        >
          <span>{isOpen ? 'Hide States' : 'Show States'}</span>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 