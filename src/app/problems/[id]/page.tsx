"use client"

import { useEffect, useState } from "react"
import { MainNavbar } from "@/components/main-navbar"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Award, User } from "lucide-react"
import Link from "next/link"
import { questionService } from "@/services/questionService"
import { QuestionType, QUESTION_TYPES } from "@/constants/questionTypes"

interface QuestionInfo {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  author: string;
  estimatedTime: number;
  points: number;
}

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questionInfo, setQuestionInfo] = useState<QuestionInfo | null>(null)

  useEffect(() => {
    setMounted(true)
    // If not authenticated, redirect to login
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, mounted, router])

  // Fetch question info
  useEffect(() => {
    const fetchQuestionInfo = async () => {
      try {
        const info = await questionService.getQuestionInfo(id)
        setQuestionInfo(info)
      } catch (err) {
        setError('Failed to load question information')
      } finally {
        setLoading(false)
      }
    }

    if (mounted && isAuthenticated) {
      fetchQuestionInfo()
    }
  }, [id, mounted, isAuthenticated])

  // Show nothing during SSR or if not authenticated
  if (!mounted || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !questionInfo) {
    return <div className="flex justify-center items-center min-h-screen">Error loading question</div>;
  }

  const questionTypeInfo = QUESTION_TYPES.find(qt => qt.type === questionInfo.type);

  return (
    <div className="flex flex-col min-h-screen">
      <MainNavbar />

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link href="/problems">
              <Button variant="ghost" className="pl-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Problems
              </Button>
            </Link>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="outline" className="bg-gray-100">
                  {questionTypeInfo?.label || questionInfo.type}
                </Badge>
                <Badge 
                  className={`${
                    questionInfo.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800' 
                      : questionInfo.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {questionInfo.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-2xl">Problem #{id}: {questionInfo.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">{questionInfo.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">Estimated time: {questionInfo.estimatedTime} mins</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">{questionInfo.points} points</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Problem Description</h3>
                <p>{questionInfo.description}</p>

                <Link href={`/problems/${id}/solve`}>
                  <Button variant="default" className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black">
                    Solve!
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} CodeLeaf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
