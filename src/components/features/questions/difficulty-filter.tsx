"use client"

import { useState } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"

const difficultyOptions: FilterOption[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
]

interface DifficultyFilterProps {
  selectedDifficulties?: Record<string, boolean>;
  onDifficultyChange?: (difficultyId: string) => void;
}

export function DifficultyFilter({ selectedDifficulties, onDifficultyChange }: DifficultyFilterProps = {}) {
  const [internalSelectedDifficulties, setInternalSelectedDifficulties] = useState({
    easy: true,
    medium: true,
    hard: true,
  });

  const isControlled = selectedDifficulties !== undefined && onDifficultyChange !== undefined;

  const handleDifficultyChange = (difficultyId: string) => {
    if (isControlled) {
      onDifficultyChange!(difficultyId);
    } else {
      setInternalSelectedDifficulties((prev) => ({
        ...prev,
        [difficultyId]: !prev[difficultyId as keyof typeof prev],
      }));
    }
  };

  return (
    <FilterGroup
      options={difficultyOptions}
      selectedOptions={isControlled ? selectedDifficulties! : internalSelectedDifficulties}
      onChange={handleDifficultyChange}
    />
  );
}
