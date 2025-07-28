import { useCallback, useEffect, useState } from 'react';
import { ContagionProtocolCreateModel } from '@/models/contagion-protocol/contagion-protocol.create.model';
import {
  ContagionProtocolMonsterBodyEnum,
  ContagionProtocolMonsterBodyType,
  ContagionProtocolMonsterColorEnum,
  ContagionProtocolMonsterColorType,
  ContagionProtocolMonsterMouthEnum,
  ContagionProtocolMonsterMouthType,
  ContagionProtocolTreeEdge,
  ContagionProtocolTreeNode,
  getBodyLabel,
  getColorLabel,
  getMouthLabel,
  Monster
} from '@/models/contagion-protocol/contagion-protocol.model.type';

interface UseContagionProtocolCreatorProps {
  question: ContagionProtocolCreateModel | null;
  markAsChanged: () => void;
}

interface TreeBranch {
  id: string;
  name: string;
  colorNode: ContagionProtocolTreeNode;
  bodyNode: ContagionProtocolTreeNode;
  mouthNode: ContagionProtocolTreeNode;
}

interface TreeValidation {
  isValid: boolean;
  hasBranches: boolean;
  branchCount: number;
  issues: string[];
}

interface MonsterValidation {
  isValid: boolean;
  hasMonsters: boolean;
  monsterCount: number;
  issues: string[];
}

interface ContentValidation {
  tree: TreeValidation;
  monsters: MonsterValidation;
  isOverallValid: boolean;
}

const INITIAL_BRANCH_FORM = {
  name: '',
  colorValue:
    ContagionProtocolMonsterColorEnum.RED as ContagionProtocolMonsterColorType,
  bodyValue:
    ContagionProtocolMonsterBodyEnum.CUBE as ContagionProtocolMonsterBodyType,
  mouthValue:
    ContagionProtocolMonsterMouthEnum.SAD as ContagionProtocolMonsterMouthType
};

export const INITIAL_MONSTER_FORM = {
  name: '',
  color:
    ContagionProtocolMonsterColorEnum.RED as ContagionProtocolMonsterColorType,
  body: ContagionProtocolMonsterBodyEnum.CUBE as ContagionProtocolMonsterBodyType,
  mouth:
    ContagionProtocolMonsterMouthEnum.SAD as ContagionProtocolMonsterMouthType
};

type MonsterFormType = {
  name: string;
  color: ContagionProtocolMonsterColorType;
  body: ContagionProtocolMonsterBodyType;
  mouth: ContagionProtocolMonsterMouthType;
};

const ROOT_NODE_ID = 'root';
const ROOT_NODE = {
  id: ROOT_NODE_ID,
  label: 'Mulai',
  attribute: 'Color',
  value: ContagionProtocolMonsterColorEnum.BLUE
} as ContagionProtocolTreeNode;

export const useContagionProtocolCreator = ({
  question,
  markAsChanged
}: UseContagionProtocolCreatorProps) => {
  // Tree Management State
  const [nodes, setNodes] = useState<ContagionProtocolTreeNode[]>([]);
  const [edges, setEdges] = useState<ContagionProtocolTreeEdge[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [branchForm, setBranchForm] = useState<{
    colorValue: ContagionProtocolMonsterColorType;
    bodyValue: ContagionProtocolMonsterBodyType;
    mouthValue: ContagionProtocolMonsterMouthType;
  }>(INITIAL_BRANCH_FORM);

  // Monster Management State
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(
    null
  );
  const [showMonsterForm, setShowMonsterForm] = useState(false);
  const [editingMonster, setEditingMonster] = useState<Monster | null>(null);
  const [monsterForm, setMonsterForm] = useState<{
    name: string;
    color: ContagionProtocolMonsterColorType;
    body: ContagionProtocolMonsterBodyType;
    mouth: ContagionProtocolMonsterMouthType;
  } | null>(null);

  // Validation State
  const [contentValidation, setContentValidation] = useState<ContentValidation>(
    {
      tree: { isValid: false, hasBranches: false, branchCount: 0, issues: [] },
      monsters: {
        isValid: false,
        hasMonsters: false,
        monsterCount: 0,
        issues: []
      },
      isOverallValid: false
    }
  );

  // Derive branches from nodes and edges
  const getBranches = useCallback((): TreeBranch[] => {
    const branches: TreeBranch[] = [];
    const processedNodes = new Set<string>();

    nodes.forEach((node) => {
      if (node.attribute === 'Color' && !processedNodes.has(node.id)) {
        const colorNode = node;
        const bodyEdge = edges.find((e) => e.source === colorNode.id);
        if (bodyEdge) {
          const bodyNode = nodes.find((n) => n.id === bodyEdge.target);
          if (bodyNode) {
            const mouthEdge = edges.find((e) => e.source === bodyNode.id);
            if (mouthEdge) {
              const mouthNode = nodes.find((n) => n.id === mouthEdge.target);
              if (mouthNode) {
                branches.push({
                  id: colorNode.id.replace('_color', ''),
                  name:
                    colorNode.label.split(':')[0] || `Branch ${colorNode.id}`,
                  colorNode,
                  bodyNode,
                  mouthNode
                });
                processedNodes.add(colorNode.id);
                processedNodes.add(bodyNode.id);
                processedNodes.add(mouthNode.id);
              }
            }
          }
        }
      }
    });

    return branches;
  }, [nodes, edges]);

  // Validation Functions
  const validateTreeContent = useCallback((): TreeValidation => {
    const branches = getBranches();
    const issues: string[] = [];

    if (branches.length === 0) {
      issues.push('Tidak ada cabang pohon keputusan');
    }

    // Check for incomplete branches
    const incompleteNodes = nodes.filter((node) => {
      const isPartOfBranch = branches.some(
        (branch) =>
          branch.colorNode.id === node.id ||
          branch.bodyNode.id === node.id ||
          branch.mouthNode.id === node.id
      );
      return !isPartOfBranch;
    });

    if (incompleteNodes.length > 0) {
      issues.push(
        `${incompleteNodes.length} node tidak terhubung dalam cabang lengkap`
      );
    }

    return {
      isValid: branches.length > 0 && incompleteNodes.length === 0,
      hasBranches: branches.length > 0,
      branchCount: branches.length,
      issues
    };
  }, [getBranches, nodes]);

  const validateMonsterContent = useCallback((): MonsterValidation => {
    const issues: string[] = [];

    if (monsters.length === 0) {
      issues.push('Tidak ada monster yang dibuat');
    }

    // Check for monsters with empty names
    const invalidMonsters = monsters.filter((monster) => !monster.name.trim());
    if (invalidMonsters.length > 0) {
      issues.push(`${invalidMonsters.length} monster memiliki nama kosong`);
    }

    // Check for duplicate monster names
    const monsterNames = monsters.map((m) => m.name.trim().toLowerCase());
    const duplicateNames = monsterNames.filter(
      (name, index) => monsterNames.indexOf(name) !== index
    );
    if (duplicateNames.length > 0) {
      issues.push('Terdapat nama monster yang duplikat');
    }

    return {
      isValid:
        monsters.length > 0 &&
        invalidMonsters.length === 0 &&
        duplicateNames.length === 0,
      hasMonsters: monsters.length > 0,
      monsterCount: monsters.length,
      issues
    };
  }, [monsters]);

  const updateContentValidation = useCallback(() => {
    const treeValidation = validateTreeContent();
    const monsterValidation = validateMonsterContent();

    setContentValidation({
      tree: treeValidation,
      monsters: monsterValidation,
      isOverallValid: treeValidation.isValid && monsterValidation.isValid
    });
  }, [validateTreeContent, validateMonsterContent]);

  // Load existing data when question changes
  useEffect(() => {
    if (question) {
      setNodes(question.tree.nodes || []);
      setEdges(question.tree.edges || []);
      setMonsters(question.monsters || []);
    }
  }, [question]);

  // Update validation when content changes
  useEffect(() => {
    updateContentValidation();
  }, [nodes, edges, monsters, updateContentValidation]);

  // Update model when data changes
  useEffect(() => {
    if (question && (nodes.length > 0 || monsters.length > 0)) {
      // Ensure root-to-color edges for all color nodes
      const contentData = {
        tree: { nodes: nodes, edges: edges },
        monsters
      };
      question.populateFromContentString(JSON.stringify(contentData));
      markAsChanged();
    }
  }, [nodes, edges, monsters, question, markAsChanged]);

  // Tree Management Functions
  const createBranch = useCallback(() => {
    const colorNodeId = `Color_${branchForm.colorValue}`;
    const bodyNodeId = `Color_${branchForm.colorValue}-Body_${branchForm.bodyValue}`;
    const mouthNodeId = `Color_${branchForm.colorValue}-Body_${branchForm.bodyValue}-Mouth_${branchForm.mouthValue}`;

    const colorNode: ContagionProtocolTreeNode = {
      id: colorNodeId,
      label: `Berwarna ${getColorLabel(branchForm.colorValue)}`,
      attribute: 'Color',
      value: branchForm.colorValue
    };

    const bodyNode: ContagionProtocolTreeNode = {
      id: bodyNodeId,
      label: `Berbadan ${getBodyLabel(branchForm.bodyValue)}`,
      attribute: 'Body',
      value: branchForm.bodyValue
    };

    const mouthNode: ContagionProtocolTreeNode = {
      id: mouthNodeId,
      label: `Mulut ${getMouthLabel(branchForm.mouthValue)}`,
      attribute: 'Mouth',
      value: branchForm.mouthValue
    };

    setEdges((prev) => {
      const newEdges = [
        { source: colorNodeId, target: bodyNodeId },
        { source: bodyNodeId, target: mouthNodeId }
      ];

      // Check if an edge already exists
      const edgeExists = (edge: { source: string; target: string }) =>
        prev.some((e) => e.source === edge.source && e.target === edge.target);

      // Filter out duplicates
      const uniqueNewEdges = newEdges.filter((edge) => !edgeExists(edge));

      return [...prev, ...uniqueNewEdges];
    });

    setNodes((prev) => {
      // Avoid duplicate color/body/mouth nodes
      const ids = [colorNodeId, bodyNodeId, mouthNodeId];
      const filtered = prev.filter((n) => !ids.includes(n.id));
      return [...filtered, colorNode, bodyNode, mouthNode];
    });

    setBranchForm(INITIAL_BRANCH_FORM);
    setShowBranchForm(false);
    setSelectedBranchId(null);

    return true;
  }, [branchForm]);

  const editBranch = useCallback(
    (branchId: string) => {
      const branches = getBranches();
      const branch = branches.find((b) => b.id === branchId);
      if (branch) {
        setEditingBranchId(branchId);
        setSelectedBranchId(branchId);
        setBranchForm({
          colorValue: branch.colorNode
            .value as ContagionProtocolMonsterColorType,
          bodyValue: branch.bodyNode.value as ContagionProtocolMonsterBodyType,
          mouthValue: branch.mouthNode
            .value as ContagionProtocolMonsterMouthType
        });
        setShowBranchForm(true);
        return true;
      }
      return false;
    },
    [getBranches]
  );

  const updateBranch = useCallback(() => {
    if (!editingBranchId) return false;

    const branches = getBranches();
    const branch = branches.find((b) => b.id === editingBranchId);
    if (!branch) return false;

    const updatedColorNode: ContagionProtocolTreeNode = {
      ...branch.colorNode,
      label: `Berwarna ${getColorLabel(branchForm.colorValue)}`,
      value: branchForm.colorValue
    };

    const updatedBodyNode: ContagionProtocolTreeNode = {
      ...branch.bodyNode,
      label: `Berbadan ${getBodyLabel(branchForm.bodyValue)}`,
      value: branchForm.bodyValue
    };

    const updatedMouthNode: ContagionProtocolTreeNode = {
      ...branch.mouthNode,
      label: `Mulut ${getMouthLabel(branchForm.mouthValue)}`,
      value: branchForm.mouthValue
    };

    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === branch.colorNode.id) return updatedColorNode;
        if (n.id === branch.bodyNode.id) return updatedBodyNode;
        if (n.id === branch.mouthNode.id) return updatedMouthNode;
        return n;
      })
    );

    setEditingBranchId(null);
    setBranchForm(INITIAL_BRANCH_FORM);
    setShowBranchForm(false);
    setSelectedBranchId(null);

    return true;
  }, [editingBranchId, branchForm, getBranches]);

  const deleteBranch = useCallback(
    (branchId: string) => {
      const branches = getBranches();
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return false;

      const nodeIdsToRemove = [
        branch.colorNode.id,
        branch.bodyNode.id,
        branch.mouthNode.id
      ];

      setNodes((prev) => prev.filter((n) => !nodeIdsToRemove.includes(n.id)));
      setEdges((prev) =>
        prev.filter(
          (e) =>
            !nodeIdsToRemove.includes(e.source) &&
            !nodeIdsToRemove.includes(e.target)
        )
      );

      if (selectedBranchId === branchId) setSelectedBranchId(null);
      return true;
    },
    [getBranches, selectedBranchId]
  );

  const deleteEdge = useCallback((sourceId: string, targetId: string) => {
    setEdges((prev) =>
      prev.filter((e) => !(e.source === sourceId && e.target === targetId))
    );
  }, []);

  // Monster Management Functions
  const createMonster = useCallback(() => {
    if (!monsterForm) return false;
    if (!monsterForm.name.trim()) return false;

    const monster: Monster = {
      id: Date.now().toString(),
      name: monsterForm.name.trim(),
      traits: {
        color: monsterForm.color,
        body: monsterForm.body,
        mouth: monsterForm.mouth
      }
    };

    setMonsters((prev) => [...prev, monster]);
    setMonsterForm(null);
    setShowMonsterForm(false);
    setSelectedMonsterId(null);

    return true;
  }, [monsterForm]);

  const editMonster = useCallback((monster: Monster) => {
    setEditingMonster(monster);
    setSelectedMonsterId(monster.id);
    setMonsterForm({
      name: monster.name,
      color: monster.traits.color,
      body: monster.traits.body,
      mouth: monster.traits.mouth
    });
    setShowMonsterForm(true);
  }, []);

  const updateMonster = useCallback(() => {
    if (!monsterForm) return false;
    if (!editingMonster || !monsterForm.name.trim()) return false;

    const updatedMonster: Monster = {
      ...editingMonster,
      name: monsterForm.name.trim(),
      traits: {
        color: monsterForm.color,
        body: monsterForm.body,
        mouth: monsterForm.mouth
      }
    };

    setMonsters((prev) =>
      prev.map((m) => (m.id === editingMonster.id ? updatedMonster : m))
    );

    setEditingMonster(null);
    setMonsterForm(null);
    setShowMonsterForm(false);
    setSelectedMonsterId(null);

    return true;
  }, [editingMonster, monsterForm]);

  const deleteMonster = useCallback(
    (monsterId: string) => {
      setMonsters((prev) => prev.filter((m) => m.id !== monsterId));
      if (selectedMonsterId === monsterId) setSelectedMonsterId(null);
      return true;
    },
    [selectedMonsterId]
  );

  // Form Management Functions
  const cancelForms = useCallback(() => {
    setShowBranchForm(false);
    setShowMonsterForm(false);
    setEditingBranchId(null);
    setEditingMonster(null);
    setBranchForm(INITIAL_BRANCH_FORM);
    setMonsterForm(null);
    setSelectedMonsterId(null);
    setSelectedBranchId(null);
  }, []);

  const updateBranchForm = useCallback(
    (updates: Partial<typeof branchForm>) => {
      setBranchForm((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const updateMonsterForm = useCallback((updates: Partial<MonsterFormType>) => {
    setMonsterForm((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  // Utility Functions
  const isContentValid = useCallback(() => {
    return contentValidation.isOverallValid;
  }, [contentValidation.isOverallValid]);

  const getSelectedMonster = useCallback(() => {
    return monsters.find((m) => m.id === selectedMonsterId) || null;
  }, [monsters, selectedMonsterId]);

  // Utility for preview tree (for CytoscapeTree)
  const getPreviewTree = useCallback(() => {
    // Add root node and edges to all color nodes
    const colorNodes = nodes.filter((n) => n.attribute === 'Color');
    const rootEdges = colorNodes.map((colorNode) => ({
      source: ROOT_NODE_ID,
      target: colorNode.id
    }));
    return {
      nodes: [ROOT_NODE, ...nodes],
      edges: [...rootEdges, ...edges]
    };
  }, [nodes, edges]);

  // Get current computed values
  const branches = getBranches();

  return {
    // Tree State
    nodes,
    edges,
    branches,
    selectedBranchId,
    showBranchForm,
    editingBranchId,
    branchForm,

    // Monster State
    monsters,
    selectedMonsterId,
    showMonsterForm,
    editingMonster,
    monsterForm,

    // Validation
    contentValidation,
    isContentValid: isContentValid(),

    // Tree Actions
    treeActions: {
      createBranch,
      editBranch,
      updateBranch,
      deleteBranch,
      deleteEdge,
      setSelectedBranchId,
      setShowBranchForm,
      updateBranchForm
    },

    // Monster Actions
    monsterActions: {
      createMonster,
      editMonster,
      updateMonster,
      deleteMonster,
      setSelectedMonsterId,
      setShowMonsterForm,
      updateMonsterForm,
      setMonsterForm
    },

    // Form Actions
    formActions: {
      cancelForms
    },

    // Utilities
    utils: {
      getSelectedMonster,
      getBranches,
      getPreviewTree
    }
  };
};
