import { useState, useEffect, useCallback } from 'react';
import { questionsApi } from '@/lib/api/questions.api';
import { QuestionResponse } from '@/utils/validations/question.validation';
import { QuestionTypeEnum } from '@/types/question-type.type';

const QUESTIONS_PER_PAGE = 15;
const SEARCH_DEBOUNCE_MS = 500;
const FILTER_DEBOUNCE_MS = 300;

interface UseQuestionsWithSearchProps {
  selectedCategories: Record<QuestionTypeEnum, boolean>;
}

export function useQuestionsWithSearch({
  selectedCategories
}: UseQuestionsWithSearchProps) {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounced values
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedSelectedCategories, setDebouncedSelectedCategories] =
    useState(selectedCategories);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce the selected categories to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSelectedCategories(selectedCategories);
    }, FILTER_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [selectedCategories]);

  // Reset to page 1 when search term or categories change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, debouncedSelectedCategories]);

  // Convert selected categories to array of types for API
  const getSelectedTypes = useCallback((): QuestionTypeEnum[] => {
    const selectedTypes = Object.entries(debouncedSelectedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([type, _]) => type as QuestionTypeEnum);

    // If no types are selected, return empty array to show all
    // If some types are selected, return only selected ones
    return selectedTypes;
  }, [debouncedSelectedCategories]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const skip = (currentPage - 1) * QUESTIONS_PER_PAGE;
      const selectedTypes = getSelectedTypes();

      const response = await questionsApi.getQuestions({
        skip,
        take: QUESTIONS_PER_PAGE,
        search: debouncedSearchTerm || undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined
      });

      setQuestions(response.data);
      setTotalQuestions(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch questions'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, getSelectedTypes]);

  // Fetch questions when page, search term, or categories change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPreviousPage]);

  return {
    questions, // Now using API-filtered results instead of client-side filtering
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    totalQuestions,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refresh: () => fetchQuestions()
  };
}
