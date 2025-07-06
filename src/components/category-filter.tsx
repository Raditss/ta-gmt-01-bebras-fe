"use client"

import { useState, useEffect } from "react"
import { FilterGroup, FilterOption } from "@/components/ui/filter-group"
import { api } from "@/lib/api"

interface CategoryFilterProps {
  selectedCategories?: Record<string, boolean>;
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps = {}) {
  const [categoryOptions, setCategoryOptions] = useState<FilterOption[]>([]);
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const questionTypes = await api.getQuestionTypes();
        const options = questionTypes.map(type => ({
          id: type.id.toString(),
          label: type.name
        }));
        setCategoryOptions(options);
        
        // Initialize all categories as selected
        const initialSelection = options.reduce((acc, option) => {
          acc[option.id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setInternalSelectedCategories(initialSelection);
      } catch (error) {
        console.error('Failed to fetch question types:', error);
        // Fallback to hardcoded values
        const fallbackOptions = [
          { id: "1", label: "Context-Free Grammar" },
          { id: "2", label: "Multiple Choice" },
          { id: "3", label: "True/False" },
          { id: "4", label: "Short Answer" },
        ];
        setCategoryOptions(fallbackOptions);
        setInternalSelectedCategories({
          "1": true,
          "2": true,
          "3": true,
          "4": true,
        });
      }
    };

    fetchQuestionTypes();
  }, []);

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
    />
  );
}
