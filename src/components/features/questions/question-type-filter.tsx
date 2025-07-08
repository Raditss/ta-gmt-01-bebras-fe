"use client";

import {useEffect, useState} from "react";
import { FilterGroup, FilterOption } from "@/components/ui/filter-group";
import {questionTypeApi} from "@/lib/api/question-type.api";
import { QuestionTypeEnum, getQuestionTypeByName } from "@/types/question-type.type";

interface QuestionTypeFilterProps {
  selectedQuestionTypes?: Record<QuestionTypeEnum, boolean>;
  onQuestionTypeChange?: (categoryEnum: QuestionTypeEnum) => void;
}

export function QuestionTypeFilter({
  selectedQuestionTypes,
  onQuestionTypeChange,
}: QuestionTypeFilterProps = {}) {
  const [categoryOptions, setCategoryOptions] = useState<FilterOption[]>([])
  const [enumToId, setEnumToId] = useState<Record<string, number>>({});
  const [idToEnum, setIdToEnum] = useState<Record<number, string>>({});
  const [internalSelectedCategories, setInternalSelectedCategories] = useState<Record<QuestionTypeEnum, boolean>>({} as Record<QuestionTypeEnum, boolean>);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const options = await questionTypeApi.getQuestionTypes();
        const optionsFilter = options.map((type) => ({
          id: type.props.id,
          label: type.props.name,
        }));
        const enumIdMap: Record<string, number> = {};
        const idEnumMap: Record<number, string> = {};
        options.forEach((type) => {
          const enumVal = getQuestionTypeByName(type.props.name);
          enumIdMap[enumVal] = type.props.id;
          idEnumMap[type.props.id] = enumVal;
        });
        setEnumToId(enumIdMap);
        setIdToEnum(idEnumMap);
        setCategoryOptions(optionsFilter);
        setInternalSelectedCategories(
          selectedQuestionTypes
            ? Object.keys(selectedQuestionTypes).reduce((acc, key) => {
                acc[key as QuestionTypeEnum] = selectedQuestionTypes[key as QuestionTypeEnum];
                return acc;
              }, {} as Record<QuestionTypeEnum, boolean>)
            : {} as Record<QuestionTypeEnum, boolean>
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const isControlled =
    selectedQuestionTypes !== undefined && onQuestionTypeChange !== undefined;

  const handleCategoryChange = (questionTypeEnum: QuestionTypeEnum) => {
    if (isControlled) {
      onQuestionTypeChange!(questionTypeEnum);
    } else {
      setInternalSelectedCategories(
        (prev) => ({
          ...prev,
          [questionTypeEnum]: !prev[questionTypeEnum],
        })
      )
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 w-full max-w-xs mx-auto">
      <h2 className="text-xl font-extrabold mb-4 text-left">Filter</h2>
      <div>
        <h3 className="text-xl font-bold mb-4 text-left">Question Type</h3>
        <FilterGroup
          options={categoryOptions}
          selectedOptions={(() => {
            const selected: Record<number, boolean> = {};
            const source = isControlled ? selectedQuestionTypes! : internalSelectedCategories;
            Object.entries(source).forEach(([enumKey, value]) => {
              const id = enumToId[enumKey];
              if (id !== undefined) selected[id] = value;
            });
            return selected;
          })()}
          onChange={(id) => {
            const enumKey = idToEnum[id] as QuestionTypeEnum;
            if (enumKey) handleCategoryChange(enumKey);
          }}
        />
      </div>
    </div>
  );
}
