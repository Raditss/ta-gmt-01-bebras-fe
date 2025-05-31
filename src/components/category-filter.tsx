"use client"

import { useState, useEffect } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"

interface CategoryFilterProps {
  selectedCategories?: Record<string, boolean>;
  onCategoryChange?: (categoryId: string) => void;
  categories?: string[];
}

export function CategoryFilter({ selectedCategories, onCategoryChange, categories }: CategoryFilterProps = {}) {
  const categoryOptions: FilterOption[] = categories ? 
    categories
      .filter((cat): cat is string => cat !== undefined && cat !== null)
      .map(cat => ({ id: cat.toLowerCase().replace(/\s+/g, ''), label: cat })) :
    [
      { id: "cipher", label: "Cipher" },
      { id: "binaryTree", label: "Binary Tree" },
      { id: "balanced", label: "Balanced" },
      { id: "algorithms", label: "Algorithms" },
      { id: "dataStructures", label: "Data Structures" },
      { id: "dynamicProgramming", label: "Dynamic Programming" },
    ];

  const [internalSelectedCategories, setInternalSelectedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize internal state when categories change
    setInternalSelectedCategories(
      Object.fromEntries(categoryOptions.map(opt => [opt.id, false]))
    );
  }, [categories]);

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

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <FilterGroup
      options={categoryOptions}
      selectedOptions={isControlled ? selectedCategories! : internalSelectedCategories}
      onChange={handleCategoryChange}
    />
  );
}
