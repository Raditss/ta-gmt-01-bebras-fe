import { useCallback, useEffect, useState } from 'react';
import { AnomalyMonsterCreateModel } from '@/models/anomaly-monster/anomaly-monster-create.model';
import {
  Monster,
  MonsterCondition
} from '@/models/anomaly-monster/anomaly-monster.model.type';
import {
  MonsterPartOptionType,
  MonsterPartType,
  MonsterPartValue
} from '@/components/features/question/anomaly-monster/monster-part.type';

interface UseDecisionTreeCreatorProps {
  question: AnomalyMonsterCreateModel;
  markAsChanged: () => void;
}

export const useAnomalyMonsterTreeCreator = ({
  question,
  markAsChanged
}: UseDecisionTreeCreatorProps) => {
  // Tree rules state
  const [rules, setRules] = useState<Monster[]>([]);
  const [currentRuleSelections, setCurrentRuleSelections] = useState<
    Record<string, string>
  >({});
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<number | null>(null);
  const [selectedRuleId, setSelectedRuleId] = useState<number | null>(null);
  const [duplicateRuleError, setDuplicateRuleError] = useState<string | null>(
    null
  );

  // Choices state
  const [choices, setChoices] = useState<Monster[]>([]);
  const [currentChoiceSelections, setCurrentChoiceSelections] = useState<
    Record<string, string>
  >({});
  const [isCreatingChoice, setIsCreatingChoice] = useState(false);
  const [editingChoiceId, setEditingChoiceId] = useState<number | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [duplicateChoiceError, setDuplicateChoiceError] = useState<
    string | null
  >(null);

  // Load existing data when question changes
  useEffect(() => {
    if (question) {
      setRules(question.monsterTree || []);
      setChoices(question.monsterChoices || []);
    }
  }, [question]);

  // Update question when rules change
  useEffect(() => {
    if (question) {
      question.monsterTree = rules;
    }
  }, [rules, question]);

  // Update question when choices change
  useEffect(() => {
    if (question) {
      question.monsterChoices = choices;
    }
  }, [choices, question]);

  // Validate current rule selections
  const isCurrentRuleValid = useCallback(() => {
    const requiredParts = [
      MonsterPartType.BODY,
      MonsterPartType.ARM,
      MonsterPartType.LEG,
      MonsterPartType.COLOR
    ];
    return requiredParts.every((part) => currentRuleSelections[part]);
  }, [currentRuleSelections]);

  // Validate current choice selections
  const isCurrentChoiceValid = useCallback(() => {
    const requiredParts = [
      MonsterPartType.BODY,
      MonsterPartType.ARM,
      MonsterPartType.LEG,
      MonsterPartType.COLOR
    ];
    return requiredParts.every((part) => currentChoiceSelections[part]);
  }, [currentChoiceSelections]);

  // Create conditions from current selections
  const createConditionsFromSelections = useCallback(
    (selections: Record<string, string>): MonsterCondition[] => {
      return [
        {
          attribute: MonsterPartType.BODY,
          value: (selections[MonsterPartType.BODY] || '') as MonsterPartValue
        },
        {
          attribute: MonsterPartType.ARM,
          value: (selections[MonsterPartType.ARM] || '') as MonsterPartValue
        },
        {
          attribute: MonsterPartType.LEG,
          value: (selections[MonsterPartType.LEG] || '') as MonsterPartValue
        },
        {
          attribute: MonsterPartType.COLOR,
          value: (selections[MonsterPartType.COLOR] || '') as MonsterPartValue
        }
      ];
    },
    []
  );

  // Check for duplicate monsters in a given array
  const checkForDuplicateMonster = useCallback(
    (
      conditions: MonsterCondition[],
      monsterArray: Monster[],
      excludeId?: number
    ): number | null => {
      const duplicateMonster = monsterArray.find((monster) => {
        if (excludeId && monster.id === excludeId) {
          return false;
        }

        if (monster.conditions.length !== conditions.length) {
          return false;
        }

        const sortConditions = (conds: MonsterCondition[]) =>
          [...conds].sort((a, b) => a.attribute.localeCompare(b.attribute));

        const sortedExisting = sortConditions(monster.conditions);
        const sortedNew = sortConditions(conditions);

        return sortedExisting.every((existingCondition, index) => {
          const newCondition = sortedNew[index];
          return (
            existingCondition.attribute === newCondition.attribute &&
            existingCondition.value === newCondition.value
          );
        });
      });

      return duplicateMonster?.id || null;
    },
    []
  );

  // Handle monster part selection for rules
  const handleRuleSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setCurrentRuleSelections((prev) => ({
        ...prev,
        [category]: value.value
      }));
      setDuplicateRuleError(null);
    },
    []
  );

  // Handle monster part selection for choices
  const handleChoiceSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartOptionType) => {
      setCurrentChoiceSelections((prev) => ({
        ...prev,
        [category]: value.value
      }));
      setDuplicateChoiceError(null);
    },
    []
  );

  // Add new rule
  const addRule = useCallback(() => {
    if (!isCurrentRuleValid()) return;

    const conditions = createConditionsFromSelections(currentRuleSelections);
    const duplicateRuleId = checkForDuplicateMonster(conditions, rules);

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const newRule: Monster = {
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
    checkForDuplicateMonster,
    isCurrentRuleValid,
    markAsChanged,
    currentRuleSelections
  ]);

  // Add new choice
  const addChoice = useCallback(() => {
    if (!isCurrentChoiceValid()) return;

    const conditions = createConditionsFromSelections(currentChoiceSelections);
    const duplicateChoiceId = checkForDuplicateMonster(conditions, choices);

    if (duplicateChoiceId) {
      const choiceIndex =
        choices.findIndex((c) => c.id === duplicateChoiceId) + 1;
      setDuplicateChoiceError(
        `This choice already exists as Choice #${choiceIndex}. Please modify the monster characteristics to create a unique choice.`
      );
      return;
    }

    const newChoice: Monster = {
      id: Date.now(),
      conditions
    };

    const updatedChoices = [...choices, newChoice];
    setChoices(updatedChoices);
    setCurrentChoiceSelections({});
    setIsCreatingChoice(false);
    setDuplicateChoiceError(null);
    markAsChanged();
  }, [
    choices,
    createConditionsFromSelections,
    checkForDuplicateMonster,
    isCurrentChoiceValid,
    markAsChanged,
    currentChoiceSelections
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

  // Edit existing choice
  const editChoice = useCallback(
    (choiceId: number) => {
      const choice = choices.find((c) => c.id === choiceId);
      if (!choice) return;

      const selections: Record<string, string> = {};
      choice.conditions.forEach((condition) => {
        selections[condition.attribute] = condition.value;
      });

      setCurrentChoiceSelections(selections);
      setEditingChoiceId(choiceId);
      setIsCreatingChoice(true);
    },
    [choices]
  );

  // Update existing rule
  const updateRule = useCallback(() => {
    if (!isCurrentRuleValid() || editingRuleId === null) return;

    const conditions = createConditionsFromSelections(currentRuleSelections);
    const duplicateRuleId = checkForDuplicateMonster(
      conditions,
      rules,
      editingRuleId
    );

    if (duplicateRuleId) {
      const ruleIndex = rules.findIndex((r) => r.id === duplicateRuleId) + 1;
      setDuplicateRuleError(
        `This rule already exists as Rule #${ruleIndex}. Please modify the monster characteristics to create a unique rule.`
      );
      return;
    }

    const updatedRule: Monster = {
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
    checkForDuplicateMonster,
    isCurrentRuleValid,
    editingRuleId,
    markAsChanged,
    currentRuleSelections
  ]);

  // Update existing choice
  const updateChoice = useCallback(() => {
    if (!isCurrentChoiceValid() || editingChoiceId === null) return;

    const conditions = createConditionsFromSelections(currentChoiceSelections);
    const duplicateChoiceId = checkForDuplicateMonster(
      conditions,
      choices,
      editingChoiceId
    );

    if (duplicateChoiceId) {
      const choiceIndex =
        choices.findIndex((c) => c.id === duplicateChoiceId) + 1;
      setDuplicateChoiceError(
        `This choice already exists as Choice #${choiceIndex}. Please modify the monster characteristics to create a unique choice.`
      );
      return;
    }

    const updatedChoice: Monster = {
      id: editingChoiceId,
      conditions
    };

    const updatedChoices = choices.map((choice) =>
      choice.id === editingChoiceId ? updatedChoice : choice
    );

    setChoices(updatedChoices);
    setCurrentChoiceSelections({});
    setEditingChoiceId(null);
    setIsCreatingChoice(false);
    setDuplicateChoiceError(null);
    markAsChanged();
  }, [
    choices,
    createConditionsFromSelections,
    checkForDuplicateMonster,
    isCurrentChoiceValid,
    editingChoiceId,
    markAsChanged,
    currentChoiceSelections
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

  // Delete choice
  const deleteChoice = useCallback(
    (choiceId: number) => {
      const updatedChoices = choices.filter((choice) => choice.id !== choiceId);
      setChoices(updatedChoices);

      if (selectedChoiceId === choiceId) {
        setSelectedChoiceId(null);
      }

      markAsChanged();
    },
    [choices, selectedChoiceId, markAsChanged]
  );

  // Cancel rule creation/editing
  const cancelRule = useCallback(() => {
    setCurrentRuleSelections({});
    setEditingRuleId(null);
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
  }, []);

  // Cancel choice creation/editing
  const cancelChoice = useCallback(() => {
    setCurrentChoiceSelections({});
    setEditingChoiceId(null);
    setIsCreatingChoice(false);
    setDuplicateChoiceError(null);
  }, []);

  // Start creating a new rule
  const startCreatingRule = useCallback(() => {
    setIsCreatingRule(true);
    setEditingRuleId(null);
    setCurrentRuleSelections({});
    setDuplicateRuleError(null);
  }, []);

  // Start creating a new choice
  const startCreatingChoice = useCallback(() => {
    setIsCreatingChoice(true);
    setEditingChoiceId(null);
    setCurrentChoiceSelections({});
    setDuplicateChoiceError(null);
  }, []);

  return {
    // Tree Rules State
    rules,
    currentRuleSelections,
    isCreatingRule,
    editingRuleId,
    selectedRuleId,
    duplicateRuleError,
    isCurrentRuleValid: isCurrentRuleValid(),

    // Tree Rules Actions
    handleRuleSelection,
    addRule,
    editRule,
    updateRule,
    deleteRule,
    cancelRule,
    startCreatingRule,
    setSelectedRuleId,

    // Choices State
    choices,
    currentChoiceSelections,
    isCreatingChoice,
    editingChoiceId,
    selectedChoiceId,
    duplicateChoiceError,
    isCurrentChoiceValid: isCurrentChoiceValid(),

    // Choices Actions
    handleChoiceSelection,
    addChoice,
    editChoice,
    updateChoice,
    deleteChoice,
    cancelChoice,
    startCreatingChoice,
    setSelectedChoiceId
  };
};
