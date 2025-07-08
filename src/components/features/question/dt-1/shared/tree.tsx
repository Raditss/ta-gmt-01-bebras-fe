import { Rule, Finish } from "@/models/dt-1/dt-1.solve.model";
import { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface TreeNode {
  type: "decision" | "rule" | "finish";
  attribute?: string;
  children?: Map<string, TreeNode>;
  ruleId?: number;
  finishId?: number;
  finishName?: string;
  isGoal?: boolean;
  value?: string;
}

interface TreeProps {
  rules: Rule[];
  finishes: Finish[];
  goals: number[];
  selections: Record<string, string>;
  onRuleSelect: (ruleId: number) => void;
  selectedRules: number[];
}

interface EChartsNode {
  name: string;
  value?: string;
  children?: EChartsNode[];
  itemStyle?: {
    color?: string;
    borderColor?: string;
    borderWidth?: number;
  };
  label?: {
    color?: string;
    fontWeight?: string;
  };
  lineStyle?: {
    color?: string;
    width?: number;
  };

  // Custom properties for our logic
  nodeType?: "decision" | "leaf";
  ruleId?: number;
  finishId?: number;
  isSelected?: boolean;
  isOnPath?: boolean;
  isGoal?: boolean;
  isSelectable?: boolean;
}

const buildDecisionTree = (
  rules: Rule[],
  finishes: Finish[],
  goals: number[]
): TreeNode => {
  const attributeOrder = ["body", "arms", "legs", "horns", "color"];

  const findMatchingRules = (conditions: Record<string, string>): Rule[] => {
    return rules.filter((rule) =>
      rule.conditions.every(
        (condition) => conditions[condition.attribute] === condition.value
      )
    );
  };

  const getValidValuesForAttribute = (
    attribute: string,
    currentConditions: Record<string, string>
  ): string[] => {
    const validValues = new Set<string>();

    rules.forEach((rule) => {
      const ruleMatches = Object.entries(currentConditions).every(
        ([attr, value]) => {
          const ruleCondition = rule.conditions.find(
            (c) => c.attribute === attr
          );
          return ruleCondition && ruleCondition.value === value;
        }
      );

      if (ruleMatches) {
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
    if (attributeIndex >= attributeOrder.length) {
      // At the end of decision path, create rule nodes that lead to finish nodes
      const matchingRules = findMatchingRules(currentConditions);

      if (matchingRules.length === 0) {
        return { type: "finish", finishName: "No Match" };
      }

      if (matchingRules.length === 1) {
        // Single rule - create rule node with finish child
        const rule = matchingRules[0];
        const finish = finishes.find((f) => f.id === rule.finish);

        const ruleNode: TreeNode = {
          type: "rule",
          ruleId: rule.id,
          children: new Map(),
        };

        const finishNode: TreeNode = {
          type: "finish",
          finishId: rule.finish,
          finishName: finish?.name || `Finish ${rule.finish}`,
          isGoal: goals.includes(rule.finish),
        };

        ruleNode.children!.set(
          finish?.name || `Finish ${rule.finish}`,
          finishNode
        );
        return ruleNode;
      } else {
        // Multiple rules - create decision node for rule selection
        const ruleDecisionNode: TreeNode = {
          type: "decision",
          attribute: "rule",
          children: new Map(),
        };

        matchingRules.forEach((rule) => {
          const finish = finishes.find((f) => f.id === rule.finish);

          const ruleNode: TreeNode = {
            type: "rule",
            ruleId: rule.id,
            children: new Map(),
          };

          const finishNode: TreeNode = {
            type: "finish",
            finishId: rule.finish,
            finishName: finish?.name || `Finish ${rule.finish}`,
            isGoal: goals.includes(rule.finish),
          };

          ruleNode.children!.set(
            finish?.name || `Finish ${rule.finish}`,
            finishNode
          );
          ruleDecisionNode.children!.set(`Rule ${rule.id}`, ruleNode);
        });

        return ruleDecisionNode;
      }
    }

    const currentAttribute = attributeOrder[attributeIndex];
    const possibleValues = getValidValuesForAttribute(
      currentAttribute,
      currentConditions
    );

    if (possibleValues.length === 0) {
      return { type: "finish", finishName: "No Match" };
    }

    const node: TreeNode = {
      type: "decision",
      attribute: currentAttribute,
      children: new Map(),
    };

    possibleValues.forEach((value: string) => {
      const childConditions = {
        ...currentConditions,
        [currentAttribute]: value,
      };
      const childNode = buildTreeRecursive(attributeIndex + 1, childConditions);

      if (
        (childNode.type === "finish" || childNode.type === "rule") &&
        (childNode.ruleId !== undefined ||
          childNode.finishId !== undefined ||
          childNode.finishName !== undefined)
      ) {
        childNode.value = value;
        node.children!.set(value, childNode);
      } else if (
        childNode.type === "decision" &&
        childNode.children &&
        childNode.children.size > 0
      ) {
        childNode.value = value;
        node.children!.set(value, childNode);
      }
    });

    return node;
  };

  return buildTreeRecursive(0, {});
};

// Convert to ECharts format
const convertToEChartsFormat = (
  tree: TreeNode,
  selections: Record<string, string>,
  selectedRules: number[],
  goals: number[],
  path: string[] = []
): EChartsNode => {
  const checkIfOnPath = (currentPath: string[]): boolean => {
    return currentPath.every((condition) => {
      const [attr, value] = condition.split("=");
      return selections[attr] === value;
    });
  };

  // Handle different node types
  if (tree.type === "finish") {
    const isGoal = tree.isGoal || false;
    const isOnPath = checkIfOnPath(path);

    return {
      name: tree.finishName || "Unknown Finish",
      nodeType: "leaf",
      finishId: tree.finishId,
      isOnPath,
      isGoal,
      itemStyle: {
        color: isGoal ? "#dcfce7" : "#f3f4f6",
        borderColor: isGoal ? "#16a34a" : "#9ca3af",
        borderWidth: 2,
      },
      label: {
        color: isGoal ? "#15803d" : "#6b7280",
        fontWeight: "bold",
      },
    };
  }

  if (tree.type === "rule") {
    const isOnPath = checkIfOnPath(path);
    const children: EChartsNode[] = [];

    // Process finish node children
    if (tree.children) {
      tree.children.forEach((childNode) => {
        const childPath = [...path, `rule=${tree.ruleId}`];
        const child = convertToEChartsFormat(
          childNode,
          selections,
          selectedRules,
          goals,
          childPath
        );
        children.push(child);
      });
    }

    return {
      name: `Rule ${tree.ruleId}`,
      children,
      nodeType: "decision", // Rule nodes have children, so they're not leaf nodes
      ruleId: tree.ruleId,
      isOnPath,
      itemStyle: {
        color: isOnPath ? "#fbbf24" : "#e5e7eb",
        borderColor: isOnPath ? "#f59e0b" : "#9ca3af",
        borderWidth: 2,
      },
      label: {
        color: isOnPath ? "#92400e" : "#6b7280",
        fontWeight: "bold",
      },
    };
  }

  // Only decision nodes have children and attributes
  const children: EChartsNode[] = [];

  if (tree.type === "decision" && tree.children && tree.attribute) {
    const hasSelection = selections[tree.attribute] !== undefined;
    const selectedValue = selections[tree.attribute];

    tree.children.forEach((childNode, value) => {
      const childPath = [...path, `${tree.attribute}=${value}`];
      const child = convertToEChartsFormat(
        childNode,
        selections,
        selectedRules,
        goals,
        childPath
      );

      // Format: "Attribute: Value" - shows the decision being made
      if (tree.attribute && tree.attribute !== "rule") {
        const attributeLabel =
          tree.attribute.charAt(0).toUpperCase() + tree.attribute.slice(1);
        child.name = `${attributeLabel}: ${value}`;
      } else {
        child.name = value; // For rule nodes, just show the rule name
      }

      const isSelectedPath = selectedValue === value;

      child.lineStyle = {
        color: isSelectedPath
          ? "#16a34a"
          : hasSelection
          ? "#cbd5e1"
          : "#6b7280",
        width: isSelectedPath ? 3 : 2,
      };

      children.push(child);
    });

    return {
      name:
        path.length === 0
          ? "Start"
          : tree.attribute === "rule"
          ? "Rules"
          : tree.attribute.charAt(0).toUpperCase() + tree.attribute.slice(1),
      children,
      nodeType: "decision",
      isOnPath: checkIfOnPath(path),
      itemStyle: {
        color: hasSelection ? "#fef3c7" : "#dbeafe",
        borderColor: hasSelection ? "#f59e0b" : "#3b82f6",
        borderWidth: 2,
      },
      label: {
        color: hasSelection ? "#92400e" : "#1e40af",
        fontWeight: "bold",
      },
    };
  }

  // Fallback for unexpected node types
  return {
    name: "Unknown",
    nodeType: "decision",
    itemStyle: { color: "#f3f4f6", borderColor: "#9ca3af", borderWidth: 2 },
    label: { color: "#6b7280", fontWeight: "bold" },
  };
};

export function DecisionTree2({
  rules,
  finishes,
  goals,
  selections,
  onRuleSelect,
  selectedRules,
}: TreeProps) {
  const option = useMemo(() => {
    const tree = buildDecisionTree(rules, finishes, goals);
    const data = convertToEChartsFormat(tree, selections, selectedRules, goals);

    return {
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const data = params.data;
          if (!data) return params.name || "Unknown";

          if (data.nodeType === "leaf") {
            let tooltip = "";

            if (data.ruleId) {
              tooltip += `<strong>Rule ${data.ruleId}</strong><br/>`;
            }

            if (data.finishId) {
              const finishName =
                finishes.find((f) => f.id === data.finishId)?.name || "Unknown";
              tooltip += `Finish: ${finishName}<br/>`;
            }

            if (data.isGoal) {
              tooltip += `<span style="color: #16a34a;">⭐ Goal Finish</span><br/>`;
            }

            return tooltip || data.name || "Unknown";
          }

          return params.name || "Unknown";
        },
      },
      series: [
        {
          type: "tree",
          data: [data],
          top: "5%",
          left: "7%",
          bottom: "5%",
          right: "20%",
          symbolSize: 7,
          label: {
            position: "top",
            verticalAlign: "bottom",
            align: "center",
            fontSize: 11,
            distance: 10,
          },
          leaves: {
            label: {
              position: "top",
              verticalAlign: "bottom",
              align: "center",
              distance: 10,
            },
          },
          emphasis: {
            focus: "descendant",
          },
          expandAndCollapse: false,
          animationDuration: 550,
          animationDurationUpdate: 750,
          layout: "orthogonal",
          orient: "LR", // Left to Right
          roam: true, // Enable zoom and pan
        },
      ],
    };
  }, [rules, finishes, goals, selections, selectedRules]);

  const onEvents = useMemo(
    () => ({
      click: (params: { data?: EChartsNode }) => {
        if (params.data?.nodeType === "leaf" && params.data?.ruleId) {
          onRuleSelect(params.data.ruleId);
        }
      },
    }),
    [onRuleSelect]
  );

  const getStatusText = (): string => {
    const selectionCount = Object.keys(selections).length;
    if (selectionCount === 0) {
      return "Select monster parts to see available paths • Click on leaf nodes to toggle rule selection";
    }

    const selectedText = Object.entries(selections)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ");

    const goalRulesText =
      selectedRules.length > 0
        ? ` • Selected ${selectedRules.length} rule(s)`
        : "";

    return `Selected: ${selectedText}${goalRulesText}`;
  };

  return (
    <div className="w-full border rounded-lg bg-white p-4">
      <div className="mb-2 text-sm font-semibold text-gray-700">
        Decision Tree - Find All Goal Paths
      </div>
      <div className="mb-3 text-xs text-gray-500">{getStatusText()}</div>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 border border-blue-700 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 border border-green-700 rounded"></div>
          <span>Selectable (Goal Path)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 rounded"></div>
          <span>On Current Path</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
          <span>Goal Finish</span>
        </div>
      </div>

      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: "500px", width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
