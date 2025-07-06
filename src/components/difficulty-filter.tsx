"use client"

import { useState, useEffect } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"
import { api } from "@/lib/api"

interface DifficultyFilterProps {
  selectedDifficulties?: Record<string, boolean>;
  onDifficultyChange?: (difficultyId: string) => void;
}

export function DifficultyFilter({ selectedDifficulties, onDifficultyChange }: DifficultyFilterProps = {}) {
  const [difficultyOptions, setDifficultyOptions] = useState<FilterOption[]>([]);
  const [internalSelectedDifficulties, setInternalSelectedDifficulties] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        const difficulties = await api.getDifficulties();
        const options = difficulties.map(d => ({
          id: d.value.toLowerCase(),
          label: d.label
        }));
        setDifficultyOptions(options);
        
        // Initialize all difficulties as selected
        const initialSelection = options.reduce((acc, option) => {
          acc[option.id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setInternalSelectedDifficulties(initialSelection);
      } catch (error) {
        console.error('Failed to fetch difficulties:', error);
        // Fallback to hardcoded values
        const fallbackOptions = [
          { id: "easy", label: "Easy" },
          { id: "medium", label: "Medium" },
          { id: "hard", label: "Hard" },
        ];
        setDifficultyOptions(fallbackOptions);
        setInternalSelectedDifficulties({
          easy: true,
          medium: true,
          hard: true,
        });
      }
    };

    fetchDifficulties();
  }, []);

  const isControlled = selectedDifficulties !== undefined && onDifficultyChange !== undefined;

  const handleDifficultyChange = (difficultyId: string) => {
    if (isControlled) {
      onDifficultyChange!(difficultyId);
    } else {
      setInternalSelectedDifficulties((prev) => ({
        ...prev,
        [difficultyId]: !prev[difficultyId],
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
