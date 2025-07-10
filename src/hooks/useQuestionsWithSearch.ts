import { useState, useEffect, useCallback } from 'react';
import { questionsApi } from '@/lib/api/questions.api';
import { QuestionResponse } from '@/utils/validations/question.validation';
import {
  QuestionTypeEnum,
  getQuestionTypeByName
} from '@/types/question-type.type';

const QUESTIONS_PER_PAGE = 15;

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

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term or categories change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategories]);

  // Fetch questions when page, search term, or categories change
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const skip = (currentPage - 1) * QUESTIONS_PER_PAGE;
      const response = await questionsApi.getQuestions({
        skip,
        take: QUESTIONS_PER_PAGE,
        search: debouncedSearchTerm || undefined
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
  }, [currentPage, debouncedSearchTerm]);

  // Filter questions by selected categories
  const filteredQuestions = questions.filter((question) => {
    // If no categories are selected, show all questions
    if (Object.values(selectedCategories).every((selected) => !selected)) {
      return true;
    }
    // Show questions that match any selected category
    return selectedCategories[
      getQuestionTypeByName(question.props.questionType.name)
    ];
  });

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
    questions: filteredQuestions,
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
