import { Shape, ShapeContainer } from "@/components/features/cfg/shared/shape";
import { Rule } from "@/models/cfg/cfg.create.model";

("use client");

interface RuleDisplayProps {
  allRules: Rule[];
  applicableRules: Rule[];
  onApplyRule: (rule: Rule) => void;
}

const RuleButton = ({ rule, onClick }: { rule: Rule; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center space-x-2"
  >
    <div className="flex flex-wrap gap-1 max-w-[8rem]">
      {rule.before.map((obj, idx) => (
        <ShapeContainer key={idx}>
          <Shape type={obj.type} size="sm" className="bg-gray-400" />
        </ShapeContainer>
      ))}
    </div>
    <span>→</span>
    <div className="flex flex-wrap gap-1 max-w-[8rem]">
      {rule.after.map((obj, idx) => (
        <ShapeContainer key={idx}>
          <Shape type={obj.type} size="sm" className="bg-gray-400" />
        </ShapeContainer>
      ))}
    </div>
  </button>
);

export function RuleDisplaySolve({
  allRules,
  applicableRules,
  onApplyRule,
}: RuleDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Applicable Rules Section */}
      {applicableRules.length > 0 && (
        <div className="bg-white rounded-md shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Applicable Rules</h2>
          <div className="flex flex-wrap gap-4">
            {applicableRules.map((rule, idx) => (
              <RuleButton
                key={idx}
                rule={rule}
                onClick={() => onApplyRule(rule)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Available Rules Section */}
      <div className="bg-white rounded-md shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">All Available Rules</h2>
        <div className="flex flex-wrap gap-4">
          {allRules.length > 0 ? (
            allRules.map((rule, idx) => (
              <div key={idx} className="opacity-50">
                <RuleButton rule={rule} onClick={() => {}} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No rules available</p>
          )}
        </div>
      </div>
    </div>
  );
}
