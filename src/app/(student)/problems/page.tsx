'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProblemCard } from '@/components/features/questions/problem-card';
import { QuestionTypeFilter } from '@/components/features/questions/question-type-filter';
import { useRouter } from 'next/navigation';
import {
  QuestionTypeEnum,
  getQuestionTypeByName
} from '@/types/question-type.type';
import { QuestionTypeModal } from '@/components/features/questions/question-type-modal';
import { QuestionTypeResponse } from '@/utils/validations/question-type.validation';
import { questionTypeApi } from '@/lib/api/question-type.api';
import { questionsApi } from '@/lib/api/questions.api';
import { useQuestionsWithSearch } from '@/hooks/useQuestionsWithSearch';
import { Pagination } from '@/components/ui/pagination';

export default function ProblemsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<QuestionTypeEnum, boolean>
  >({} as Record<QuestionTypeEnum, boolean>);
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  // Use the new hook for questions with search and pagination
  const {
    questions,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    refresh
  } = useQuestionsWithSearch({
    selectedCategories,
    isActive: true,
    isPublished: true
  });

  useEffect(() => {
    setMounted(true);
    const fetchQuestionTypes = async () => {
      try {
        const typesResponse = await questionTypeApi.getQuestionTypes();
        // Initialize all categories as selected (by enum)
        const initialSelectedCategories = Object.fromEntries(
          typesResponse.map((type: QuestionTypeResponse) => [
            getQuestionTypeByName(type.props.name),
            true
          ])
        );
        setSelectedCategories(
          initialSelectedCategories as Record<QuestionTypeEnum, boolean>
        );
      } catch (error) {
        console.error('Error fetching question types:', error);
      }
    };
    fetchQuestionTypes();
  }, []);

  const handleCategoryChange = (questionTypeEnum: QuestionTypeEnum) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [questionTypeEnum]: !prev[questionTypeEnum]
    }));
  };

  // Don't hide the entire page during initial mount - just disable controls

  const handleGenerateQuestion = async (type: QuestionTypeEnum) => {
    console.log('handleGenerateQuestion called with type:', type);

    try {
      setIsTypeModalOpen(false);

      // Show loading state while generating
      console.log('Generating question for type:', type);

      // Call backend to generate the question
      console.log('Calling questionsApi.generateQuestion...');
      const generatedQuestion = await questionsApi.generateQuestion(type);
      console.log('Generated question received:', generatedQuestion);

      // Store the generated question in sessionStorage for the solve page
      sessionStorage.setItem(
        'generatedQuestion',
        JSON.stringify(generatedQuestion)
      );
      console.log('Question stored in sessionStorage');

      // Navigate to the generated question solver
      const targetUrl = `/problems/generated/${type}/solve`;
      console.log('Navigating to:', targetUrl);
      router.push(targetUrl);
    } catch (error) {
      console.error('Failed to generate question:', error);
      console.error('Error details:', error);
      // Reopen modal on error
      setIsTypeModalOpen(true);
      // You could show an error toast here
      alert(
        `Failed to generate question: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleOpenGenerateModal = () => {
    setIsTypeModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4 md:sticky md:top-20 md:self-start space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search problems..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!mounted}
              />
            </div>

            <QuestionTypeFilter
              selectedQuestionTypes={selectedCategories}
              onQuestionTypeChange={!mounted ? () => {} : handleCategoryChange}
            />

            {/* Generate Random Question Button - Outside filter box */}
            <div className="w-full max-w-xs mx-auto">
              <Button
                variant="default"
                className="w-full bg-indigo-200 hover:bg-indigo-300 text-indigo-900 shadow-lg"
                onClick={handleOpenGenerateModal}
                disabled={!mounted}
              >
                Generate Random Question
              </Button>
            </div>
          </div>

          {/* Problem grid */}
          <div className="md:w-3/4 min-h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Problems</h1>
              {totalPages > 0 && (
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            {!mounted || isLoading ? (
              <div className="flex justify-center items-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8 min-h-[500px] flex flex-col justify-center items-center">
                <p>{error}</p>
                <Button
                  onClick={refresh}
                  className="mt-4 bg-[#F8D15B] text-black hover:bg-[#E8C14B]"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {questions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No problems found matching your search criteria.</p>
                    {searchTerm && (
                      <Button
                        onClick={() => setSearchTerm('')}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {questions.map((question) => (
                        <ProblemCard
                          key={question.props.id}
                          id={question.props.id.toString()}
                          title={question.props.title}
                          author={question.props.teacher.name}
                          type={
                            question.props.questionType.name as QuestionTypeEnum
                          }
                        />
                      ))}
                    </div>

                    {/* Pagination Component */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPreviousPage={hasPreviousPage}
                      onPageChange={goToPage}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
        </div>
      </footer>

      <QuestionTypeModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={handleGenerateQuestion}
      />
    </div>
  );
}
