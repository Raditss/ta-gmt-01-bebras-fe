"use client"

import { useState } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"
import { QUESTION_TYPES } from "@/constants/questionTypes"

const categoryOptions: FilterOption[] = QUESTION_TYPES.map(type => ({
  id: type.id,
  label: type.label
}));

interface CategoryFilterProps {
  selectedCategories?: Record<string, boolean>;
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps = {}) {
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<Record<string, boolean>>(
    QUESTION_TYPES.reduce((acc, type) => ({
      ...acc,
      [type.id]: type.id === 'cfg'
    }), {})
  );

  const isControlled = selectedCategories !== undefined && onCategoryChange !== undefined;

  const handleCategoryChange = (categoryId: string) => {
    if (isControlled) {
      onCategoryChange!(categoryId);
    } else {
      setInternalSelectedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
    }
  };

  return (
    <FilterGroup
      options={categoryOptions}
      selectedOptions={isControlled ? selectedCategories! : internalSelectedCategories}
      onChange={handleCategoryChange}
      title="Categories"
    />
  );
}
