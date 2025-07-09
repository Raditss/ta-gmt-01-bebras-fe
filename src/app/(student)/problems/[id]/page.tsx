'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Award, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { questionService } from '@/lib/services/question.service';
import { Question } from '@/types/question.type';

export default function ProblemDetailPage({
  params
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

  // Fetch question info
  useEffect(() => {
    const fetchQuestionInfo = async () => {
      try {
        const question = await questionService.getQuestionById(id);
        setQuestion(question);
      } catch (_err) {
        console.error('Error fetching question info:', _err);
        setError('Failed to load question information');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionInfo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error loading question
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
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
                  {question.questionType.name}
                </Badge>
              </div>
              <CardTitle className="text-2xl">
                Problem #{id}: {question.title}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">{question.teacher.name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Estimated time: {question.estimatedTime} mins
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm">{question.points} points</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3>Problem Description</h3>
                <p>{question.questionType.description}</p>

                <Link href={`/problems/${id}/solve`}>
                  <Button
                    variant="default"
                    className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
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
          <p>© {new Date().getFullYear()} Solvio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
