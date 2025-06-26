import { Rule } from "@/model/decision-tree/question/model";
import { JSX } from "react";

interface TreeNode {
  type: "decision" | "leaf";
  attribute?: string;
  value?: string;
  yes?: TreeNode;
  no?: TreeNode;
  ruleId?: number;
  isMatch?: boolean;
}

interface TreeProps {
  rules: Rule[];
  selections: Record<string, string>;
  onRuleSelect: (ruleId: number) => void;
  selectedRule: number | null;
}

const buildDecisionTree = (rules: Rule[]): TreeNode => {
  // Helper function to find matching rule for a combination
  const findMatchingRule = (conditions: Record<string, string>): number => {
    for (const rule of rules) {
      const matches = rule.conditions.every(
        (condition) => conditions[condition.attribute] === condition.value
      );
      if (matches) return rule.id;
    }
    return -1;
  };

  // Build tree for hat colors
  const buildHatTree = (): TreeNode => {
    return {
      type: "decision",
      attribute: "hat",
      value: "red",
      yes: {
        type: "decision",
        attribute: "jacket",
        value: "blue",
        yes: {
          type: "decision",
          attribute: "shirt",
          value: "white",
          yes: {
            type: "leaf",
            ruleId: findMatchingRule({
              hat: "red",
              jacket: "blue",
              shirt: "white",
            }),
          },
          no: {
            type: "leaf",
            ruleId: findMatchingRule({
              hat: "red",
              jacket: "blue",
              shirt: "other",
            }),
          },
        },
        no: {
          type: "decision",
          attribute: "jacket",
          value: "green",
          yes: {
            type: "decision",
            attribute: "shirt",
            value: "white",
            yes: {
              type: "leaf",
              ruleId: findMatchingRule({
                hat: "red",
                jacket: "green",
                shirt: "white",
              }),
            },
            no: {
              type: "leaf",
              ruleId: findMatchingRule({
                hat: "red",
                jacket: "green",
                shirt: "other",
              }),
            },
          },
          no: { type: "leaf", ruleId: -1 }, // Other jacket colors
        },
      },
      no: {
        type: "decision",
        attribute: "hat",
        value: "green",
        yes: {
          type: "decision",
          attribute: "jacket",
          value: "blue",
          yes: {
            type: "decision",
            attribute: "shirt",
            value: "white",
            yes: {
              type: "leaf",
              ruleId: findMatchingRule({
                hat: "green",
                jacket: "blue",
                shirt: "white",
              }),
            },
            no: {
              type: "leaf",
              ruleId: findMatchingRule({
                hat: "green",
                jacket: "blue",
                shirt: "other",
              }),
            },
          },
          no: {
            type: "decision",
            attribute: "jacket",
            value: "green",
            yes: {
              type: "decision",
              attribute: "shirt",
              value: "white",
              yes: {
                type: "leaf",
                ruleId: findMatchingRule({
                  hat: "green",
                  jacket: "green",
                  shirt: "white",
                }),
              },
              no: {
                type: "leaf",
                ruleId: findMatchingRule({
                  hat: "green",
                  jacket: "green",
                  shirt: "other",
                }),
              },
            },
            no: { type: "leaf", ruleId: -1 }, // Other jacket colors
          },
        },
        no: { type: "leaf", ruleId: -1 }, // Other hat colors
      },
    };
  };

  return buildHatTree();
};

export function DecisionTree({
  rules,
  selections,
  onRuleSelect,
  selectedRule,
}: TreeProps) {
  const tree = buildDecisionTree(rules);

  const getPathToNode = (
    node: TreeNode,
    currentSelections: Record<string, string>,
    parentOnPath: boolean = true
  ): boolean => {
    if (node.type === "leaf") {
      return parentOnPath;
    }

    if (!node.attribute || !node.value) return false;

    // Check if this decision node matches current selections
    const hasSelection = currentSelections[node.attribute] !== undefined;
    const matchesSelection = currentSelections[node.attribute] === node.value;

    return parentOnPath && (!hasSelection || matchesSelection);
  };

  const renderNode = (
    node: TreeNode,
    depth: number = 0,
    parentOnPath: boolean = true
  ): JSX.Element => {
    const isOnPath = getPathToNode(node, selections, parentOnPath);

    if (node.type === "leaf") {
      const isSelected = selectedRule === node.ruleId;
      const isValidRule = node.ruleId !== -1;

      return (
        <div className="flex flex-col items-center">
          <button
            onClick={() => isValidRule && onRuleSelect(node.ruleId!)}
            disabled={!isValidRule}
            className={`px-2 py-1 rounded border-2 transition-all min-w-16 text-xs ${
              isSelected
                ? "bg-blue-500 text-white border-blue-600"
                : isValidRule
                ? "bg-green-100 border-green-300 hover:bg-green-200"
                : "bg-gray-100 border-gray-300 text-gray-500"
            } ${isOnPath ? "ring-2 ring-yellow-400 ring-opacity-70" : ""}`}
          >
            {isValidRule ? `Rule ${node.ruleId}` : "No Match"}
          </button>
        </div>
      );
    }

    // For decision nodes, check if current selection matches
    const hasSelection = selections[node.attribute!] !== undefined;
    const matchesCondition = selections[node.attribute!] === node.value;
    const shouldHighlight = isOnPath && hasSelection && matchesCondition;

    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Decision Node */}
        <div
          className={`px-3 py-1 rounded-full border-2 transition-all min-w-24 text-center ${
            shouldHighlight
              ? "bg-yellow-200 border-yellow-500 ring-2 ring-yellow-400"
              : "bg-orange-100 border-orange-300"
          }`}
        >
          <span className="text-xs font-medium capitalize">
            {node.attribute} = {node.value}?
          </span>
        </div>

        {/* Connecting line down */}
        <div className="border-l-2 border-gray-300 h-2"></div>

        {/* Branches */}
        <div className="flex space-x-8">
          {/* Yes Branch */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs text-green-600 font-bold">YES</span>
            {/* Branch line */}
            <div className="flex flex-col items-center">
              <div className="border-l-2 border-gray-300 h-2"></div>
              <div className="border-b-2 border-gray-300 w-6"></div>
              <div className="border-l-2 border-gray-300 h-2"></div>
            </div>
            {node.yes &&
              renderNode(
                node.yes,
                depth + 1,
                isOnPath && hasSelection && matchesCondition
              )}
          </div>

          {/* No Branch */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-xs text-red-600 font-bold">NO</span>
            {/* Branch line */}
            <div className="flex flex-col items-center">
              <div className="border-l-2 border-gray-300 h-2"></div>
              <div className="border-b-2 border-gray-300 w-6"></div>
              <div className="border-l-2 border-gray-300 h-2"></div>
            </div>
            {node.no &&
              renderNode(
                node.no,
                depth + 1,
                isOnPath && hasSelection && !matchesCondition
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto p-6 bg-gray-50 rounded-lg">
      <div className="min-w-max flex justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 px-4 py-2 bg-blue-100 border-2 border-blue-300 rounded-lg">
            <span className="text-sm font-bold text-blue-700">START</span>
          </div>
          <div className="border-l-2 border-gray-300 h-4"></div>
          {renderNode(tree)}
        </div>
      </div>
    </div>
  );
}
