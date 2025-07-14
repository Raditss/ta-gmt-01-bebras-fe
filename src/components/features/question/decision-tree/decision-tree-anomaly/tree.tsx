import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Rule } from '@/models/decision-tree-anomaly/decision-tree-anomaly.model.type';

interface TreeNode {
  type: 'decision' | 'leaf';
  attribute?: string;
  children?: Map<string, TreeNode>;
  ruleId?: number;
  value?: string;
}

interface TreeProps {
  rules: Rule[];
  selections: Record<string, string>;
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
  nodeType?: 'decision' | 'leaf';
  ruleId?: number;
  isSelected?: boolean;
  isOnPath?: boolean;
}

const buildDecisionTree = (rules: Rule[]): TreeNode => {
  const attributeOrder = [
    'body',
    'arms',
    'legs',
    // 'horns',
    'color'
  ];

  const findMatchingRule = (conditions: Record<string, string>): number => {
    for (const rule of rules) {
      const matches = rule.conditions.every(
        (condition) => conditions[condition.attribute] === condition.value
      );
      if (matches) return rule.id;
    }
    return -1;
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
      const ruleId = findMatchingRule(currentConditions);
      return {
        type: 'leaf',
        ruleId: ruleId !== -1 ? ruleId : undefined
      };
    }

    const currentAttribute = attributeOrder[attributeIndex];
    const possibleValues = getValidValuesForAttribute(
      currentAttribute,
      currentConditions
    );

    if (possibleValues.length === 0) {
      return { type: 'leaf', ruleId: undefined };
    }

    const node: TreeNode = {
      type: 'decision',
      attribute: currentAttribute,
      children: new Map()
    };

    possibleValues.forEach((value: string) => {
      const childConditions = {
        ...currentConditions,
        [currentAttribute]: value
      };
      const childNode = buildTreeRecursive(attributeIndex + 1, childConditions);

      if (childNode.type === 'leaf' && childNode.ruleId !== undefined) {
        childNode.value = value;
        node.children!.set(value, childNode);
      } else if (
        childNode.type === 'decision' &&
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
  path: string[] = []
): EChartsNode => {
  const checkIfOnPath = (currentPath: string[]): boolean => {
    return currentPath.every((condition) => {
      const [attr, value] = condition.split('=');
      return selections[attr] === value;
    });
  };

  if (tree.type === 'leaf') {
    const hasRule = tree.ruleId !== undefined;

    // For leaf nodes, we need to show the final decision that led here
    // Extract the last decision from the path
    let leafName = hasRule ? `Rule #${tree.ruleId}` : 'No Rule';
    if (path.length > 0) {
      const lastDecision = path[path.length - 1];
      const [attr, value] = lastDecision.split('=');
      const attrLabel = attr.charAt(0).toUpperCase() + attr.slice(1);
      leafName = `${attrLabel}: ${value} → ${leafName}`;
    }

    return {
      name: leafName,
      nodeType: 'leaf',
      ruleId: tree.ruleId,
      isOnPath: checkIfOnPath(path),
      itemStyle: {
        color: hasRule ? '#dcfce7' : '#f3f4f6',
        borderColor: hasRule ? '#16a34a' : '#9ca3af',
        borderWidth: 2
      },
      label: {
        color: hasRule ? '#15803d' : '#6b7280',
        fontWeight: 'bold'
      }
    };
  }

  const children: EChartsNode[] = [];
  const hasSelection = selections[tree.attribute!] !== undefined;
  const selectedValue = selections[tree.attribute!];

  tree.children?.forEach((childNode, value) => {
    const childPath = [...path, `${tree.attribute}=${value}`];
    const child = convertToEChartsFormat(childNode, selections, childPath);

    // Format: "Attribute: Value" - shows the decision being made
    const attributeLabel =
      tree.attribute!.charAt(0).toUpperCase() + tree.attribute!.slice(1);
    child.name = `${attributeLabel}: ${value}`;

    const isSelectedPath = selectedValue === value;

    child.lineStyle = {
      color: isSelectedPath ? '#16a34a' : hasSelection ? '#cbd5e1' : '#6b7280',
      width: isSelectedPath ? 3 : 2
    };

    children.push(child);
  });

  return {
    name:
      path.length === 0
        ? 'Start'
        : tree.attribute!.charAt(0).toUpperCase() + tree.attribute!.slice(1),
    children,
    nodeType: 'decision',
    isOnPath: checkIfOnPath(path),
    itemStyle: {
      color: hasSelection ? '#fef3c7' : '#dbeafe',
      borderColor: hasSelection ? '#f59e0b' : '#3b82f6',
      borderWidth: 2
    },
    label: {
      color: hasSelection ? '#92400e' : '#1e40af',
      fontWeight: 'bold'
    }
  };
};

export function DecisionTreeAnomalyTree({ rules, selections }: TreeProps) {
  const option = useMemo(() => {
    const tree = buildDecisionTree(rules);
    const data = convertToEChartsFormat(tree, selections);

    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',
          data: [data],
          top: '5%',
          left: '7%',
          bottom: '5%',
          right: '20%',
          symbolSize: 7,
          label: {
            position: 'top',
            verticalAlign: 'bottom',
            align: 'center',
            fontSize: 12,
            distance: 10
            // rotate: 90
          },
          leaves: {
            label: {
              position: 'top',
              verticalAlign: 'bottom',
              align: 'center',
              distance: 10
              // rotate: 90
            }
          },
          expandAndCollapse: false,
          animationDuration: 550,
          animationDurationUpdate: 750,
          layout: 'orthogonal',
          orient: 'LR' // Left to Right
          // roam: true // Enable zoom and pan
        }
      ]
    };
  }, [rules, selections]);

  return (
    <div className="w-full border rounded-lg bg-white p-4">
      <div className="mb-2 text-sm font-semibold text-gray-700">
        Monster Decision Tree
      </div>
      <div className="mb-3 text-xs text-gray-500">
        {Object.keys(selections).length > 0
          ? `Selected: ${Object.entries(selections)
              .map(([k, v]) => `${k}=${v}`)
              .join(', ')}`
          : 'Use mouse wheel to zoom • Drag to pan'}
      </div>
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
