"use client"

import { useState } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"

const categoryOptions: FilterOption[] = [
  { id: "cipher", label: "Cipher" },
  { id: "binaryTree", label: "Binary Tree" },
  { id: "balanced", label: "Balanced" },
  { id: "algorithms", label: "Algorithms" },
  { id: "dataStructures", label: "Data Structures" },
  { id: "dynamicProgramming", label: "Dynamic Programming" },
]

interface CategoryFilterProps {
  selectedCategories?: Record<string, boolean>;
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps = {}) {
  const [internalSelectedCategories, setInternalSelectedCategories] = useState({
    cipher: true,
    binaryTree: false,
    balanced: false,
    algorithms: false,
    dataStructures: false,
    dynamicProgramming: false,
  });

  const isControlled = selectedCategories !== undefined && onCategoryChange !== undefined;

  const handleCategoryChange = (categoryId: string) => {
    if (isControlled) {
      onCategoryChange!(categoryId);
    } else {
      setInternalSelectedCategories((prev) => ({
        ...prev,
        [categoryId]: !prev[categoryId as keyof typeof prev],
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
