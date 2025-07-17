'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';
import { questionsApi } from '@/lib/api/questions.api';
import { QuestionResponse } from '@/utils/validations/question.validation';

// Helper function to determine question status
const getQuestionStatus = (
  isActive: boolean,
  _isPublished: boolean
): string => {
  if (isActive) return 'ACTIVE';
  return 'PUBLISHED';
};

export default function ManageQuestionPage() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await questionsApi.getQuestionsByAdmin();
        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions for admin:', error);
      }
    }
    fetchQuestions();
  }, []);

  const handleToggleStatus = async (question: QuestionResponse) => {
    if (updatingId === question.props.id) return;

    setUpdatingId(question.props.id);
    try {
      const updatedQuestion = await questionsApi.updateQuestionByAdmin(
        {
          questionTypeId: question.props.questionTypeId,
          title: question.props.title,
          content: question.props.content,
          isPublished: question.props.isPublished,
          isActive: !question.props.isActive,
          points: question.props.points,
          estimatedTime: question.props.estimatedTime
        },
        question.props.id
      );

      // Update the questions list with the updated question
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.props.id === question.props.id ? updatedQuestion : q
        )
      );
    } catch (error) {
      console.error('Failed to update question status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const questionTypes = Array.from(
    new Set(questions.map((q) => q.props.questionType.name))
  );
  const statusTypes = ['PUBLISHED', 'ACTIVE'];

  const filteredQuestions = questions.filter((q) => {
    const matchesTitle = q.props.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter
      ? q.props.questionType.name === typeFilter
      : true;
    const questionStatus = getQuestionStatus(
      q.props.isActive,
      q.props.isPublished
    );
    const matchesStatus = statusFilter ? questionStatus === statusFilter : true;
    return matchesTitle && matchesType && matchesStatus;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold">Manage Questions</h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
            <Input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Types</option>
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Statuses</option>
                {statusTypes.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => {
                const status = getQuestionStatus(
                  q.props.isActive,
                  q.props.isPublished
                );
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'PUBLISHED':
                      return 'bg-blue-100 text-blue-800';
                    case 'ACTIVE':
                      return 'bg-green-100 text-green-800';
                    default:
                      return 'bg-gray-100 text-gray-800';
                  }
                };

                const isUpdating = updatingId === q.props.id;

                return (
                  <TableRow key={q.props.id}>
                    <TableCell>{q.props.title}</TableCell>
                    <TableCell>{q.props.teacher?.name || '-'}</TableCell>
                    <TableCell>{q.props.questionType.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleToggleStatus(q)}
                        disabled={isUpdating}
                        variant={q.props.isActive ? 'destructive' : 'default'}
                      >
                        {isUpdating
                          ? 'Updating...'
                          : q.props.isActive
                            ? 'Deactivate'
                            : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
