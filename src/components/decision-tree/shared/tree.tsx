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

  // Extract all unique attributes and their possible values from rules
  const attributeValues: Record<string, Set<string>> = {};

  rules.forEach((rule) => {
    rule.conditions.forEach((condition) => {
      if (!attributeValues[condition.attribute]) {
        attributeValues[condition.attribute] = new Set();
      }
      attributeValues[condition.attribute].add(condition.value);
    });
  });

  // Convert to arrays and sort for consistent ordering
  const attributes = Object.keys(attributeValues).sort();
  const valueMap: Record<string, string[]> = {};
  attributes.forEach((attr) => {
    valueMap[attr] = Array.from(attributeValues[attr]).sort();
  });

  // Build a tree that properly branches for each value
  const buildTreeRecursive = (
    attributeIndex: number,
    currentConditions: Record<string, string>
  ): TreeNode => {
    // If we've exhausted all attributes, this is a leaf
    if (attributeIndex >= attributes.length) {
      return {
        type: "leaf",
        ruleId: findMatchingRule(currentConditions),
      };
    }

    const currentAttribute = attributes[attributeIndex];
    const possibleValues = valueMap[currentAttribute];

    // Create a chain of binary decisions for each value
    const buildValueChain = (valueIndex: number): TreeNode => {
      if (valueIndex >= possibleValues.length) {
        // No more values to check, this means no match for this attribute
        return {
          type: "leaf",
          ruleId: -1,
        };
      }

      const currentValue = possibleValues[valueIndex];

      return {
        type: "decision",
        attribute: currentAttribute,
        value: currentValue,
        yes: buildTreeRecursive(attributeIndex + 1, {
          ...currentConditions,
          [currentAttribute]: currentValue,
        }),
        no: buildValueChain(valueIndex + 1), // Try the next value
      };
    };

    return buildValueChain(0);
  };

  // Start building from the first attribute
  if (attributes.length === 0) {
    return { type: "leaf", ruleId: -1 };
  }

  return buildTreeRecursive(0, {});
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

    // Node is on path if parent is on path AND either:
    // 1. No selection has been made for this attribute yet, OR
    // 2. Selection matches this node's value
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
            className={`px-1 py-0.5 rounded border text-xs min-w-12 ${
              isSelected
                ? "bg-blue-500 text-white border-blue-600"
                : isValidRule
                ? "bg-green-100 border-green-300 hover:bg-green-200"
                : "bg-gray-100 border-gray-300 text-gray-500"
            } ${isOnPath ? "ring-1 ring-yellow-400" : ""}`}
          >
            {isValidRule ? `R${node.ruleId}` : "X"}
          </button>
        </div>
      );
    }

    // For decision nodes, check if current selection matches
    const hasSelection = selections[node.attribute!] !== undefined;
    const matchesCondition = selections[node.attribute!] === node.value;
    const shouldHighlight = isOnPath && hasSelection && matchesCondition;

    return (
      <div className="flex flex-col items-center space-y-2">
        {/* Decision Node */}
        <div
          className={`px-2 py-0.5 rounded border text-center text-xs min-w-20 ${
            shouldHighlight
              ? "bg-yellow-200 border-yellow-500 ring-1 ring-yellow-400"
              : "bg-orange-100 border-orange-300"
          }`}
        >
          <span className="font-medium capitalize">
            {node.attribute}={node.value}?
          </span>
        </div>

        {/* Connecting line down */}
        <div className="border-l border-gray-300 h-1"></div>

        {/* Branches */}
        <div className="flex space-x-4">
          {/* Yes Branch */}
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-xs text-green-600 font-semibold">Y</span>
            {/* Branch line */}
            <div className="flex flex-col items-center">
              <div className="border-l border-gray-300 h-1"></div>
              <div className="border-b border-gray-300 w-3"></div>
              <div className="border-l border-gray-300 h-1"></div>
            </div>
            {node.yes &&
              renderNode(
                node.yes,
                depth + 1,
                isOnPath && (!hasSelection || matchesCondition)
              )}
          </div>

          {/* No Branch */}
          <div className="flex flex-col items-center space-y-0.5">
            <span className="text-xs text-red-600 font-semibold">N</span>
            {/* Branch line */}
            <div className="flex flex-col items-center">
              <div className="border-l border-gray-300 h-1"></div>
              <div className="border-b border-gray-300 w-3"></div>
              <div className="border-l border-gray-300 h-1"></div>
            </div>
            {node.no &&
              renderNode(
                node.no,
                depth + 1,
                isOnPath && (!hasSelection || !matchesCondition)
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto p-3 bg-gray-50 rounded-lg">
      <div className="min-w-max flex justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-2 px-2 py-1 bg-blue-100 border border-blue-300 rounded text-xs">
            <span className="font-semibold text-blue-700">START</span>
          </div>
          <div className="border-l border-gray-300 h-2"></div>
          {renderNode(tree)}
        </div>
      </div>
    </div>
  );
}
