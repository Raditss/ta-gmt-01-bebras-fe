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
import { questionsApi } from '@/lib/api';
import { QuestionResponse } from '@/utils/validations/question.validation';
import { QuestionTypeResponse } from '@/utils/validations/question-type.validation';
import { questionTypeApi } from '@/lib/api/question-type.api';

export default function ProblemsPage() {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<QuestionTypeEnum, boolean>
  >({} as Record<QuestionTypeEnum, boolean>);
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch questions and question types in parallel
        const [questionsResponse, typesResponse] = await Promise.all([
          questionsApi.getQuestions(),
          questionTypeApi.getQuestionTypes()
        ]);
        setQuestions(questionsResponse);
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
        console.error('Error fetching data:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch data'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (questionTypeEnum: QuestionTypeEnum) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [questionTypeEnum]: !prev[questionTypeEnum]
    }));
  };

  const filteredQuestions = questions.filter((question) => {
    // If no categories are selected, show all questions
    if (Object.values(selectedCategories).every((selected) => !selected)) {
      return true;
    }
    // Show questions that match any selected category (by enum)
    return selectedCategories[
      getQuestionTypeByName(question.props.questionType.name)
    ];
  });

  // Show loading state during initial auth check
  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleGenerateQuestion = async (type: QuestionTypeEnum) => {
    try {
      setIsTypeModalOpen(false);
      router.push(`/problems/generated/${type}/solve`);
    } catch (error) {
      console.error('Failed to navigate to generated question:', error);
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
          <div className="md:w-1/4 space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search problems..."
                className="pl-8"
              />
            </div>

            <QuestionTypeFilter
              selectedQuestionTypes={selectedCategories}
              onQuestionTypeChange={handleCategoryChange}
            />

            {/* Generate Random Question Button - Outside filter box */}
            <div className="w-full max-w-xs mx-auto">
              <Button
                variant="default"
                className="w-full bg-indigo-200 hover:bg-indigo-300 text-indigo-900 shadow-lg"
                onClick={handleOpenGenerateModal}
              >
                Generate Random Question
              </Button>
            </div>
          </div>

          {/* Problem grid */}
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">Problems</h1>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">
                <p>{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-[#F8D15B] text-black hover:bg-[#E8C14B]"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuestions.map(
                  (question) => (
                    console.log(question),
                    (
                      <ProblemCard
                        key={question.props.id}
                        id={question.props.id.toString()}
                        title={question.props.title}
                        author={question.props.teacher.name}
                        type={
                          question.props.questionType.name as QuestionTypeEnum
                        }
                      />
                    )
                  )
                )}
              </div>
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
