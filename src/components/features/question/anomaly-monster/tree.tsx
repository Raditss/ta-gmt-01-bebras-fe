import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Branch } from '@/models/anomaly-monster/anomaly-monster.model.type';
import {
  MonsterPartEnum,
  MonsterPartType,
  MonsterPartValue
} from '@/components/features/question/anomaly-monster/monster.type';

interface TreeNode {
  type: 'decision' | 'leaf';
  attribute?: string;
  children?: Map<string, TreeNode>;
  ruleId?: number;
  value?: string;
}

interface TreeProps {
  rules: Branch[];
  selections: Record<string, string>;
  height?: string;
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

export const getLabel = (
  type: MonsterPartType,
  value: MonsterPartValue
): string => {
  switch (type) {
    case MonsterPartEnum.COLOR:
      switch (value) {
        case 'Red':
          return 'Berwarna Merah';
        case 'Green':
          return 'Berwarna Hijau';
        case 'Blue':
          return 'Berwarna Biru';
        default:
          return value;
      }
    case MonsterPartEnum.BODY:
      switch (value) {
        case 'Orb':
          return 'Berbentuk Bulat';
        case 'Cube':
          return 'Berbentuk Kotak';
        default:
          return value;
      }
    case MonsterPartEnum.MOUTH:
      switch (value) {
        case 'Fangs':
          return 'Bertaring';
        case 'Closedteeth':
          return 'Tidak Bertaring';
        default:
          return 'Tidak diketahui';
      }
    default:
      return value;
  }
};

const getLabelColor = (value: MonsterPartValue): string | undefined => {
  switch (value) {
    case 'Red':
      return '#ef4444'; // Red
    case 'Green':
      return '#22c55e'; // Green
    case 'Blue':
      return '#3b82f6'; // Blue
    default:
      return undefined; // Default color for unknown values
  }
};

const buildDecisionTree = (rules: Branch[]): TreeNode => {
  const attributeOrder = [
    MonsterPartEnum.COLOR,
    MonsterPartEnum.BODY,
    MonsterPartEnum.MOUTH
    // MonsterPartEnum.ARM,
    // MonsterPartEnum.LEG
    // 'horns',
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

const getCurrentPath = (selections: Record<string, string>) => {
  const path: string[] = [];
  const order = [
    MonsterPartEnum.COLOR,
    MonsterPartEnum.BODY,
    MonsterPartEnum.MOUTH
  ];
  for (const key of order) {
    const value = selections[key];
    if (value) {
      path.push(`${key}=${value}`);
    } else {
      break;
    }
  }
  return path;
};

// Convert to ECharts format
const convertToEChartsFormat = (
  tree: TreeNode,
  selections: Record<string, string>,
  path: string[] = [],
  currentPath: string[]
): EChartsNode => {
  const checkIfOnPath = (currentNodePath: string[]): boolean => {
    return currentNodePath.every(
      (condition, i) => condition === currentPath[i]
    );
  };

  if (tree.type === 'leaf') {
    const hasRule = tree.ruleId !== undefined;
    let leafName = hasRule ? `Rule #${tree.ruleId}` : 'No Rule';

    if (path.length > 0) {
      const lastDecision = path[path.length - 1];
      const [attr, value] = lastDecision.split('=');
      const attrLabel = attr.charAt(0).toUpperCase() + attr.slice(1);
      leafName = `${attrLabel}: ${value} → ${leafName}`;
    }

    const isOnExactPath = checkIfOnPath(path);

    return {
      name: leafName,
      nodeType: 'leaf',
      ruleId: tree.ruleId,
      isOnPath: isOnExactPath,
      itemStyle: {
        color: hasRule ? '#000000' : '#f3f4f6',
        borderColor: isOnExactPath ? '#16a34a' : '#9ca3af',
        borderWidth: 2
      },
      label: {
        color: isOnExactPath ? '#15803d' : '#6b7280',
        fontWeight: isOnExactPath ? 'bold' : 'normal'
      }
    };
  }

  const children: EChartsNode[] = [];

  tree.children?.forEach((childNode, value) => {
    const childPath = [...path, `${tree.attribute}=${value}`];
    const child = convertToEChartsFormat(
      childNode,
      selections,
      childPath,
      currentPath
    );

    const isOnExactPath = checkIfOnPath(childPath);

    child.name = `${getLabel(tree.attribute as MonsterPartType, value as MonsterPartValue)}`;

    child.lineStyle = {
      color: isOnExactPath ? '#16a34a' : '#d1d5db',
      width: isOnExactPath ? 3 : 1
    };

    child.label = {
      ...(child.label || {}),
      color: getLabelColor(value as MonsterPartValue) ?? '#000000',
      fontWeight: 'bold'
    };

    children.push(child);
  });

  const isOnExactPath = checkIfOnPath(path);

  return {
    name: path.length === 0 ? 'Start' : tree.attribute!,
    children,
    nodeType: 'decision',
    isOnPath: isOnExactPath,
    itemStyle: {
      color: isOnExactPath ? '#000000' : '#dbeafe',
      borderColor: isOnExactPath ? '#f59e0b' : '#3b82f6',
      borderWidth: 2
    },
    label: {
      color: '#000000',
      fontWeight: 'bold'
    }
  };
};

export function DecisionTreeAnomalyTree({
  rules,
  selections,
  height = '400px'
}: TreeProps) {
  const option = useMemo(() => {
    const tree = buildDecisionTree(rules);
    const currentPath = getCurrentPath(selections);
    const data = convertToEChartsFormat(tree, selections, [], currentPath);

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
            fontSize: 11,
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
    <div className="w-full flex-1 border rounded-lg bg-white p-4">
      <div className="mb-2 text-lg text-center font-semibold text-gray-700">
        Pohon Keputusan Monster yang Normal
      </div>
      {/*<div className="mb-3 text-xs text-gray-500">*/}
      {/*  {Object.keys(selections).length > 0*/}
      {/*    ? `Selected: ${Object.entries(selections)*/}
      {/*        .map(([k, v]) => `${k}=${v}`)*/}
      {/*        .join(', ')}`*/}
      {/*    : 'Use mouse wheel to zoom • Drag to pan'}*/}
      {/*</div>*/}
      <ReactECharts
        option={option}
        style={{ height: height, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
