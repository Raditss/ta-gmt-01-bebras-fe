import { Rule } from "@/model/decision-tree/question/model";
import { JSX } from "react";

interface TreeNode {
  type: "decision" | "leaf";
  attribute?: string;
  children?: Map<string, TreeNode>;
  ruleId?: number;
  attributeValue?: string; // For leaf nodes that represent attribute-value pairs
}

interface TreeProps {
  rules: Rule[];
  selections: Record<string, string>;
  onRuleSelect: (ruleId: number) => void;
  selectedRule: number | null;
}

const buildDecisionTree = (rules: Rule[]): TreeNode => {
  // Fixed hierarchical order for monster attributes
  const attributeOrder = ["body", "arm", "legs", "horns", "color"];

  // Helper function to find matching rule for a complete path
  const findMatchingRule = (conditions: Record<string, string>): number => {
    for (const rule of rules) {
      const matches = rule.conditions.every(
        (condition) => conditions[condition.attribute] === condition.value
      );
      if (matches) return rule.id;
    }
    return -1;
  };

  // Helper function to get possible values for an attribute at a given depth
  // considering only rules that are still possible given current conditions
  const getValidValuesForAttribute = (
    attribute: string,
    currentConditions: Record<string, string>
  ): string[] => {
    const validValues = new Set<string>();

    // Check each rule to see if it's still possible given current conditions
    rules.forEach((rule) => {
      // Check if this rule matches all current conditions
      const ruleMatches = Object.entries(currentConditions).every(
        ([attr, value]) => {
          const ruleCondition = rule.conditions.find(
            (c) => c.attribute === attr
          );
          return ruleCondition && ruleCondition.value === value;
        }
      );

      if (ruleMatches) {
        // If rule is still possible, add its value for the target attribute
        const attributeCondition = rule.conditions.find(
          (c) => c.attribute === attribute
        );
        if (attributeCondition) {
          validValues.add(attributeCondition.value);
        }
      }
    });

    return Array.from(validValues).sort();
  };

  const buildTreeRecursive = (
    attributeIndex: number,
    currentConditions: Record<string, string>
  ): TreeNode => {
    // If we've gone through all attributes, check for a matching rule
    if (attributeIndex >= attributeOrder.length) {
      const ruleId = findMatchingRule(currentConditions);
      return {
        type: "leaf",
        ruleId: ruleId !== -1 ? ruleId : undefined,
      };
    }

    const currentAttribute = attributeOrder[attributeIndex];

    // Get only the valid values for this attribute given current conditions
    const possibleValues = getValidValuesForAttribute(
      currentAttribute,
      currentConditions
    );

    // If no valid values, this path doesn't lead to any rules
    if (possibleValues.length === 0) {
      return {
        type: "leaf",
        ruleId: undefined,
      };
    }

    // Create decision node
    const node: TreeNode = {
      type: "decision",
      attribute: currentAttribute,
      children: new Map(),
    };

    // Create children only for valid values
    possibleValues.forEach((value: string) => {
      const childConditions = {
        ...currentConditions,
        [currentAttribute]: value,
      };

      const childNode = buildTreeRecursive(attributeIndex + 1, childConditions);

      // Only add the child if it leads to something meaningful
      if (childNode.type === "leaf" && childNode.ruleId !== undefined) {
        node.children!.set(value, childNode);
      } else if (
        childNode.type === "decision" &&
        childNode.children &&
        childNode.children.size > 0
      ) {
        node.children!.set(value, childNode);
      }
    });

    return node;
  };

  // Start building from the first attribute
  if (attributeOrder.length === 0) {
    return { type: "leaf", ruleId: undefined };
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

  const renderNode = (node: TreeNode, depth: number = 0): JSX.Element => {
    const currentPath = Object.keys(selections).length;
    const isOnActivePath = depth <= currentPath;

    if (node.type === "leaf") {
      const hasRule = node.ruleId !== undefined;
      const isSelected = selectedRule === node.ruleId;

      return (
        <div className="flex flex-col items-center">
          <button
            onClick={() => hasRule && onRuleSelect(node.ruleId!)}
            disabled={!hasRule}
            className={`px-2 py-1 rounded border text-xs min-w-16 ${
              isSelected
                ? "bg-blue-500 text-white border-blue-600"
                : hasRule
                ? "bg-green-100 border-green-300 hover:bg-green-200"
                : "bg-gray-100 border-gray-300 text-gray-500"
            } ${isOnActivePath ? "ring-2 ring-yellow-400" : ""}`}
          >
            {hasRule ? `Rule ${node.ruleId}` : "No Match"}
          </button>
        </div>
      );
    }

    // For decision nodes
    const hasSelection = selections[node.attribute!] !== undefined;
    const selectedValue = selections[node.attribute!];
    const shouldHighlight = isOnActivePath && hasSelection;

    return (
      <div className="flex flex-col items-center space-y-2">
        {/* Attribute Node */}
        <div
          className={`px-3 py-1 rounded border text-center text-sm font-medium min-w-20 ${
            shouldHighlight
              ? "bg-yellow-200 border-yellow-500 ring-2 ring-yellow-400"
              : isOnActivePath
              ? "bg-blue-100 border-blue-300"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <span className="capitalize">{node.attribute}</span>
        </div>

        {/* Connecting line down */}
        {node.children && node.children.size > 0 && (
          <div className="border-l border-gray-300 h-2"></div>
        )}

        {/* Children branches */}
        {node.children && node.children.size > 0 && (
          <div className="flex space-x-6">
            {Array.from(node.children.entries()).map(([value, childNode]) => {
              const isSelectedPath = selectedValue === value;
              const showChild = !hasSelection || isSelectedPath;

              return (
                <div
                  key={value}
                  className={`flex flex-col items-center space-y-1 ${
                    !showChild ? "opacity-30" : ""
                  }`}
                >
                  {/* Edge label */}
                  <div
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      isSelectedPath
                        ? "bg-green-200 text-green-800 border border-green-400"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {value}
                  </div>

                  {/* Connecting line */}
                  <div className="border-l border-gray-300 h-2"></div>

                  {/* Child node */}
                  {showChild && renderNode(childNode, depth + 1)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto p-4 bg-gray-50 rounded-lg">
      <div className="min-w-max flex justify-center">
        <div className="flex flex-col items-center">
          <div className="mb-3 px-3 py-1 bg-blue-100 border border-blue-300 rounded text-sm">
            <span className="font-semibold text-blue-700">
              Monster Decision Tree
            </span>
          </div>
          <div className="border-l border-gray-300 h-2"></div>
          {renderNode(tree)}
        </div>
      </div>
    </div>
  );
}
