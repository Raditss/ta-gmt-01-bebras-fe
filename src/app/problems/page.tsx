"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProblemCard } from "@/components/problem-card"
import { CategoryFilter } from "@/components/category-filter"
import { DifficultyFilter } from "@/components/difficulty-filter"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { QuestionType } from "@/constants/questionTypes"
import { QuestionTypeModal } from "@/components/question-type-modal"
import { questionService } from "@/services/questionService"

// Mock problems data
const MOCK_PROBLEMS = [
  {
    id: "1",
    title: "Exploring the world of cipher with a wonder of the new and efficient algorithm",
    author: "KnightProgrammer",
    difficulty: "Easy" as const,
    category: "Cipher",
  },
  {
    id: "2",
    title: "Exploring the world of cipher with a wonder of the new and efficient algorithm",
    author: "KnightProgrammer",
    difficulty: "Medium" as const,
    category: "Cipher",
  },
  {
    id: "3",
    title: "Exploring the world of cipher with a wonder of the new and efficient algorithm",
    author: "KnightProgrammer",
    difficulty: "Hard" as const,
    category: "Cipher",
  },
  {
    id: "4",
    title: "Balancing binary trees for optimal search performance",
    author: "TreeMaster",
    difficulty: "Medium" as const,
    category: "Binary Tree",
  },
  {
    id: "5",
    title: "Implementing efficient sorting algorithms for large datasets",
    author: "SortingWizard",
    difficulty: "Hard" as const,
    category: "Algorithms",
  },
  {
    id: "6",
    title: "Building a simple encryption system using modular arithmetic",
    author: "CryptoGenius",
    difficulty: "Easy" as const,
    category: "Cipher",
  },
]

export default function ProblemsPage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If not authenticated, redirect to login
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  // Show nothing during SSR or if not authenticated
  if (!mounted || !isAuthenticated) {
    return null
  }

  const handleGenerateQuestion = async (type: QuestionType) => {
    try {
      setIsTypeModalOpen(false);
      router.push(`/problems/generated/${type}/solve`);
    } catch (error) {
      console.error('Failed to navigate to generated question:', error);
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
              <Input type="search" placeholder="Search problems..." className="pl-8" />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Categories</h3>
              <CategoryFilter />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Difficulty</h3>
              <DifficultyFilter />
            </div>
          </div>

          {/* Problem grid */}
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">Coding Problems</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_PROBLEMS.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  title={problem.title}
                  author={problem.author}
                  difficulty={problem.difficulty}
                  category={problem.category}
                  id={problem.id}
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} CodeLeaf. All rights reserved.</p>
        </div>
      </footer>

      <QuestionTypeModal
        open={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        onSelectType={handleGenerateQuestion}
      />
    </div>
  )
}
