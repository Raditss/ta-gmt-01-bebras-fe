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
import { questionsApi } from '@/lib/api';
import { QuestionResponse } from '@/utils/validations/question.validation';
import Link from 'next/link';

const _SORTABLE_COLUMNS = ['title', 'type', 'points', 'status'] as const;
type SortColumn = (typeof _SORTABLE_COLUMNS)[number];

type SortState = {
  column: SortColumn;
  direction: 'asc' | 'desc';
};

type TabType = 'draft' | 'published';

export default function MyProblemPage() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('draft');
  const [sort, setSort] = useState<SortState>({
    column: 'title',
    direction: 'asc'
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO
        // get question by this teacher
        const allQuestions = await questionsApi.getQuestionsByTeacher();
        setQuestions(allQuestions.data);
      } catch (_err) {
        setError('Gagal memuat soal');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Get unique question types for filter dropdown
  const questionTypes = Array.from(
    new Set(questions.map((q) => q.props.questionType.name))
  );

  // Filter questions by search, type, and active tab
  const filteredQuestions = questions.filter((q) => {
    const matchesTitle = q.props.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = typeFilter
      ? q.props.questionType.name === typeFilter
      : true;
    const matchesTab =
      activeTab === 'draft' ? !q.props.isPublished : q.props.isPublished;
    return matchesTitle && matchesType && matchesTab;
  });

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const { column, direction } = sort;
    let aValue: string | number = '',
      bValue: string | number = '';
    if (column === 'title') {
      aValue = a.props.title?.toLowerCase() ?? '';
      bValue = b.props.title?.toLowerCase() ?? '';
    } else if (column === 'type') {
      aValue = a.props.questionType.name?.toLowerCase() ?? '';
      bValue = b.props.questionType.name?.toLowerCase() ?? '';
    } else if (column === 'points') {
      aValue = a.props.points ?? 0;
      bValue = b.props.points ?? 0;
    } else if (column === 'status') {
      aValue = a.props.isPublished ? 'Dipublikasi' : 'Draft';
      bValue = b.props.isPublished ? 'Dipublikasi' : 'Draft';
    }
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: SortColumn) => {
    setSort((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { column, direction: 'asc' };
    });
  };

  const sortArrow = (column: SortColumn) => {
    if (sort.column !== column) return null;
    return sort.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Soal yang Saya Buat</h1>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('draft')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'draft'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Draft
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'published'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dipublikasi
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="Cari berdasarkan judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="w-full md:w-auto flex justify-end">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Semua Jenis</option>
            {questionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Memuat...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('title')}
              >
                Judul {sortArrow('title')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('type')}
              >
                Jenis {sortArrow('type')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('points')}
              >
                Poin {sortArrow('points')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort('status')}
              >
                Status {sortArrow('status')}
              </TableHead>
              {activeTab === 'draft' && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.map((q) => (
              <TableRow key={q.props.id}>
                <TableCell>{q.props.title}</TableCell>
                <TableCell>{q.props.questionType.name}</TableCell>
                <TableCell>{q.props.points}</TableCell>
                <TableCell>
                  {q.props.isPublished ? 'Dipublikasi' : 'Draft'}
                </TableCell>
                {activeTab === 'draft' && (
                  <TableCell>
                    <Link
                      href={`/add-problem/create/${q.props.questionType.name}/${q.props.id}`}
                    >
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {sortedQuestions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada soal {activeTab === 'draft' ? 'draft' : 'yang dipublikasi'}.
        </div>
      )}
    </div>
  );
}
