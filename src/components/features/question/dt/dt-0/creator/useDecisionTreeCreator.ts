import { useCallback, useEffect, useState } from 'react';
import { DecisionTreeCreateModel } from '@/models/dt-0/dt-0.create.model';
import { Condition, Rule } from '@/models/dt-0/dt-0.model.type';
import {
  MonsterPartOptionType,
  MonsterPartType
} from '@/components/features/question/dt/monster-part.type';

interface UseDecisionTreeCreatorProps {
  question: DecisionTreeCreateModel;
  markAsChanged: () => void;
}

export const useDecisionTreeCreator = ({
  question,
  markAsChanged
}: UseDecisionTreeCreatorProps) => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRuleSelections, setCurrentRuleSelections] = useState<
    Record<string, string>
  >({});
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [duplicateRuleError, setDuplicateRuleError] = useState<string | null>(
    null
  );

  // Load existing rules when question changes
  useEffect(() => {
    if (question) {
      setRules(question.rules || []);
    }
  }, [question]);

  // Update question when rules change
  useEffect(() => {
    if (question) {
      question.rules = rules;
    }
  }, [rules, question]);

  // Validate current rule selections
  const isCurrentRuleValid = useCallback(() => {
    const requiredParts = [
      MonsterPartType.BODY,
      MonsterPartType.ARM,
      MonsterPartType.LEG,
      // MonsterPartType.HORN,
      MonsterPartType.COLOR
    ];
    return requiredParts.every((part) => currentRuleSelections[part]);
  }, [currentRuleSelections]);

  // Create conditions from current selections
  const createConditionsFromSelections = useCallback((): Condition[] => {
    return [
      {
        attribute: 'body',
        operator: '=',
        value: currentRuleSelections[MonsterPartType.BODY] || ''
      },
      {
        attribute: 'arms',
        operator: '=',
        value: currentRuleSelections[MonsterPartType.ARM] || ''
      },
      {
        attribute: 'legs',
        operator: '=',
        value: currentRuleSelections[MonsterPartType.LEG] || ''
      },
      // {
      //   attribute: 'horns',
      //   operator: '=',
      //   value: currentRuleSelections[MonsterPartType.HORN]?.value || ''
      // },
      {
        attribute: 'color',
        operator: '=',
        value: currentRuleSelections[MonsterPartType.COLOR] || ''
      }
    ];
  }, [currentRuleSelections]);

  // Check for duplicate rules
  const checkForDuplicateRule = useCallback(
    (conditions: Condition[], excludeRuleId?: number): number | null => {
      const duplicateRule = rules.find((rule) => {
        if (excludeRuleId && rule.id === excludeRuleId) {
          return false;
        }

        if (rule.conditions.length !== conditions.length) {
          return false;
        }

        const sortConditions = (conds: Condition[]) =>
          [...conds].sort((a, b) => a.attribute.localeCompare(b.attribute));

        const sortedExisting = sortConditions(rule.conditions);
        const sortedNew = sortConditions(conditions);

        return sortedExisting.every((existingCondition, index) => {
          const newCondition = sortedNew[index];
          return (
            existingCondition.attribute === newCondition.attribute &&
            existingCondition.operator === newCondition.operator &&
            existingCondition.value === newCondition.value
          );
        });
      });

      return duplicateRule?.id || null;
    },
    [rules]
  );

  // Handle monster part selection
  const handleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setCurrentRuleSelections((prev) => ({
        ...prev,
        [category]: value.value
      }));
      setDuplicateRuleError(null);
    },
    []
  );

  // Add new rule
  const addRule = useCallback(() => {
    if (!isCurrentRuleValid()) return;

    const conditions = createConditionsFromSelections();
    const duplicateRuleId = checkForDuplicateRule(conditions);

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const newRule: Rule = {
      id: Date.now(),
      conditions
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    setCurrentRuleSelections({});
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
    markAsChanged();
  }, [
    rules,
    createConditionsFromSelections,
    checkForDuplicateRule,
    isCurrentRuleValid,
    markAsChanged
  ]);

  // Edit existing rule
  const editRule = useCallback(
    (ruleId: number) => {
      const rule = rules.find((r) => r.id === ruleId);
      if (!rule) return;

      const selections: Record<string, string> = {};

      rule.conditions.forEach((condition) => {
        selections[condition.attribute] = condition.value;
      });

      setCurrentRuleSelections(selections);
      setEditingRuleId(ruleId);
      setIsCreatingRule(true);
    },
    [rules]
  );

  // Update existing rule
  const updateRule = useCallback(() => {
    if (!isCurrentRuleValid() || editingRuleId === null) return;

    const conditions = createConditionsFromSelections();
    const duplicateRuleId = checkForDuplicateRule(conditions, editingRuleId);

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const updatedRule: Rule = {
      id: editingRuleId,
      conditions
    };

    const updatedRules = rules.map((rule) =>
      rule.id === editingRuleId ? updatedRule : rule
    );

    setRules(updatedRules);
    setCurrentRuleSelections({});
    setEditingRuleId(null);
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
    markAsChanged();
  }, [
    rules,
    createConditionsFromSelections,
    checkForDuplicateRule,
    isCurrentRuleValid,
    editingRuleId,
    markAsChanged
  ]);

  // Delete rule
  const deleteRule = useCallback(
    (ruleId: number) => {
      const updatedRules = rules.filter((rule) => rule.id !== ruleId);
      setRules(updatedRules);

      if (selectedRuleId === ruleId) {
        setSelectedRuleId(null);
      }

      markAsChanged();
    },
    [rules, selectedRuleId, markAsChanged]
  );

  // Cancel rule creation/editing
  const cancelRule = useCallback(() => {
    setCurrentRuleSelections({});
    setEditingRuleId(null);
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
  }, []);

  // Start creating a new rule
  const startCreatingRule = useCallback(() => {
    setIsCreatingRule(true);
    setEditingRuleId(null);
    setCurrentRuleSelections({});
    setDuplicateRuleError(null);
  }, []);

  return {
    // State
    rules,
    currentRuleSelections,
    isCreatingRule,
    editingRuleId,
    selectedRuleId,
    duplicateRuleError,

    // Computed
    isCurrentRuleValid: isCurrentRuleValid(),

    // Actions
    handleSelection,
    addRule,
    editRule,
    updateRule,
    deleteRule,
    cancelRule,
    startCreatingRule,
    setSelectedRuleId
  };
};
