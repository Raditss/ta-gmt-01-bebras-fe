import { useCallback, useEffect, useState } from 'react';
import { AnomalyMonsterCreateModel } from '@/models/anomaly-monster/anomaly-monster-create.model';
import {
  Branch,
  Monster,
  MonsterCondition
} from '@/models/anomaly-monster/anomaly-monster.model.type';
import {
  BodyType,
  ColorType,
  MonsterPartEnum,
  MonsterPartType,
  MonsterPartValue,
  MouthType
} from '@/components/features/question/anomaly-monster/monster.type';

interface UseDecisionTreeCreatorProps {
  question: AnomalyMonsterCreateModel;
  markAsChanged: () => void;
}

export const useAnomalyMonsterTreeCreator = ({
  question,
  markAsChanged
}: UseDecisionTreeCreatorProps) => {
  // Tree rules state
  const [rules, setRules] = useState<Branch[]>([]);
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
  const [currentChoiceName, setCurrentChoiceName] = useState<string>('');
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
      MonsterPartEnum.COLOR,
      MonsterPartEnum.BODY,
      MonsterPartEnum.MOUTH
    ];
    return requiredParts.every((part) => currentRuleSelections[part]);
  }, [currentRuleSelections]);

  // Validate current choice selections
  const isCurrentChoiceValid = useCallback(() => {
    const requiredParts = [
      MonsterPartEnum.COLOR,
      MonsterPartEnum.BODY,
      MonsterPartEnum.MOUTH
    ];
    if (currentChoiceName.length === 0) return false;
    return requiredParts.every((part) => currentChoiceSelections[part]);
  }, [currentChoiceName, currentChoiceSelections]);

  // Create conditions from current selections
  const createConditionsFromSelections = useCallback(
    (selections: Record<string, string>): MonsterCondition[] => {
      return [
        {
          attribute: MonsterPartEnum.COLOR,
          value: (selections[MonsterPartEnum.COLOR] || '') as ColorType
        },
        {
          attribute: MonsterPartEnum.BODY,
          value: (selections[MonsterPartEnum.BODY] || '') as BodyType
        },
        {
          attribute: MonsterPartEnum.MOUTH,
          value: (selections[MonsterPartEnum.MOUTH] || '') as MouthType
        }
      ];
    },
    []
  );

  // Check for duplicate monsters in a given array
  const checkForDuplicateMonster = useCallback(
    (
      conditions: MonsterCondition[],
      monsterArray: Branch[],
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
    (category: MonsterPartType, value: MonsterPartValue) => {
      setCurrentRuleSelections((prev) => ({
        ...prev,
        [category]: value
      }));
      setDuplicateRuleError(null);
    },
    []
  );

  // Handle monster part selection for choices
  const handleChoiceSelection = useCallback(
    (category: MonsterPartType, value: MonsterPartValue) => {
      setCurrentChoiceSelections((prev) => ({
        ...prev,
        [category]: value
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
        `Cabang ini telah dibuat pada Cabang ke-${ruleIndex}. Silahkan ubah cabang ini agar menjadi unik terhadap cabang lain`
      );
      return;
    }

    const newRule: Branch = {
      id: Date.now(),
      conditions
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    setCurrentRuleSelections({});
    setIsCreatingRule(false);
    setDuplicateRuleError(null);
    markAsChanged();
    setSelectedRuleId(null);
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
      name: currentChoiceName,
      conditions
    };

    const updatedChoices = [...choices, newChoice];
    setChoices(updatedChoices);
    setCurrentChoiceSelections({});
    setIsCreatingChoice(false);
    setDuplicateChoiceError(null);
    setCurrentChoiceName('');
    markAsChanged();
  }, [
    isCurrentChoiceValid,
    createConditionsFromSelections,
    currentChoiceSelections,
    checkForDuplicateMonster,
    choices,
    currentChoiceName,
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
      setCurrentChoiceName(choice.name);
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

    const updatedRule: Branch = {
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
    setSelectedRuleId(null);
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
      name: currentChoiceName,
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
    setCurrentChoiceName('');
    markAsChanged();
  }, [
    isCurrentChoiceValid,
    editingChoiceId,
    createConditionsFromSelections,
    currentChoiceSelections,
    checkForDuplicateMonster,
    choices,
    currentChoiceName,
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
    setSelectedRuleId(null);
  }, []);

  // Cancel choice creation/editing
  const cancelChoice = useCallback(() => {
    setCurrentChoiceSelections({});
    setEditingChoiceId(null);
    setIsCreatingChoice(false);
    setDuplicateChoiceError(null);
    setSelectedChoiceId(null);
    setCurrentChoiceName('');
  }, []);

  // Start creating a new rule
  const startCreatingRule = useCallback(() => {
    setIsCreatingRule(true);
    setEditingRuleId(null);
    setCurrentRuleSelections({});
    setDuplicateRuleError(null);
    setSelectedRuleId(null);
  }, []);

  // Start creating a new choice
  const startCreatingChoice = useCallback(() => {
    setIsCreatingChoice(true);
    setEditingChoiceId(null);
    setCurrentChoiceSelections({});
    setDuplicateChoiceError(null);
    setSelectedChoiceId(null);
    setCurrentChoiceName('');
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
    currentChoiceName,
    setCurrentChoiceName,

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
