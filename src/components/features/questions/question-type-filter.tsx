"use client";

import {useEffect, useState} from "react";
import { FilterGroup, FilterOption } from "@/components/ui/filter-group";
import {questionTypeApi} from "@/lib/api/question-type.api";

interface QuestionTypeFilterProps {
  selectedQuestionTypes?: Record<number, boolean>;
  onQuestionTypeChange?: (categoryId: number) => void;
}

export function QuestionTypeFilter({
  selectedQuestionTypes,
  onQuestionTypeChange,
}: QuestionTypeFilterProps = {}) {
  const [categoryOptions, setCategoryOptions] = useState<FilterOption[]>([])
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const options = await questionTypeApi.getQuestionTypes();
        const optionsFilter = options.map((type) => ({
          id: type.props.id,
          label: type.props.name,
        }));

        setCategoryOptions(optionsFilter);
        setInternalSelectedCategories(
          selectedQuestionTypes
            ? Object.keys(selectedQuestionTypes).reduce((acc, key) => {
                acc[Number(key)] = selectedQuestionTypes[Number(key)];
                return acc;
              }, {} as Record<number, boolean>)
            : {}
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const isControlled =
    selectedQuestionTypes !== undefined && onQuestionTypeChange !== undefined;

  const handleCategoryChange = (questionTypeId: number) => {
    if (isControlled) {
      onQuestionTypeChange!(questionTypeId);
    } else {
      setInternalSelectedCategories(
        (prev) => ({
          ...prev,
          [questionTypeId]: !prev[questionTypeId],
        }
        ))
    }
  };

  return (
    <FilterGroup
      options={categoryOptions}
      selectedOptions={
        isControlled ? selectedQuestionTypes! : internalSelectedCategories
      }
      onChange={handleCategoryChange}
    />
  );
}
