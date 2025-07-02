"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProblemCard } from "@/components/problem-card";
import { CategoryFilter } from "@/components/category-filter";
import { DifficultyFilter } from "@/components/difficulty-filter";
import { MainNavbar } from "@/components/main-navbar";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/constants/questionTypes";
import { QuestionTypeModal } from "@/components/question-type-modal";
import { api } from "@/lib/api";
import Link from "next/link";
import { Settings } from "lucide-react";

interface QuestionTypeData {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionTypeResponse {
  props: QuestionTypeData;
}

interface Teacher {
  id: number;
  name: string;
}

interface Question {
  props: {
    id: number;
    content: string;
    questionTypeId: number;
    teacherId: number;
    isPublished: boolean;
    questionType: QuestionTypeData;
    createdAt: string;
    updatedAt: string;
    teacher: Teacher;
  };
}

export default function ProblemsPage() {
  const [mounted, setMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    Record<string, boolean>
  >({});
  const { isAuthenticated, token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If not authenticated, redirect to login
    if (mounted && !isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, router, isAuthLoading]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !token) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch questions and question types in parallel
        const [questionsResponse, typesResponse] = await Promise.all([
          api.getQuestions(),
          api.getQuestionTypes(),
        ]);
        setQuestions(questionsResponse);

        // Initialize all categories as selected
        const initialSelectedCategories = Object.fromEntries(
          typesResponse.map((type: QuestionTypeResponse) => [
            type.props.name.toLowerCase().replace(/\s+/g, ""),
            true,
          ])
        );
        setSelectedCategories(initialSelectedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, token]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const filteredQuestions = questions.filter((question) => {
    const categoryName = question.props.questionType.name
      .toLowerCase()
      .replace(/\s+/g, "");
    // If no categories are selected, show all questions
    if (Object.values(selectedCategories).every((selected) => !selected)) {
      return true;
    }
    // Show questions that match any selected category
    return Object.entries(selectedCategories).some(
      ([id, selected]) => selected && id === categoryName
    );
  });

  // Show loading state during initial auth check
  if (!mounted || isAuthLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show nothing if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleGenerateQuestion = async (type: QuestionType) => {
    try {
      setIsTypeModalOpen(false);
      router.push(`/problems/generated/${type}/solve`);
    } catch (error) {
      console.error("Failed to navigate to generated question:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <MainNavbar />

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

            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Difficulty</h3>
              <DifficultyFilter />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              asChild
            >
              <Link href="/profile/edit">
                <Settings className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </Button>
          </div>

          {/* Problem grid */}
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">Coding Problems</h1>

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
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuestions.map((question) => (
                    <ProblemCard
                      key={`${question.props.id}-${question.props.questionTypeId}`}
                      title={question.props.content}
                      author={question.props.teacher.name}
                      difficulty="Medium" // TODO: Add difficulty when available
                      category={question.props.questionType.name}
                      id={question.props.id.toString()}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    variant="default"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    onClick={() => setIsTypeModalOpen(true)}
                  >
                    Generate Random Question
                  </Button>
                </div>
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
