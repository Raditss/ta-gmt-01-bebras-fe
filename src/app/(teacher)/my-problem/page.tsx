"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { questionsApi } from "@/lib/api";
import { QuestionResponse } from "@/utils/validations/question.validation";
import Link from "next/link";

const SORTABLE_COLUMNS = ["title", "type", "points", "status"] as const;
type SortColumn = typeof SORTABLE_COLUMNS[number];

type SortState = {
  column: SortColumn;
  direction: "asc" | "desc";
};

export default function MyProblemPage() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState<SortState>({ column: "title", direction: "asc" });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const allQuestions = await questionsApi.getQuestions();
        setQuestions(allQuestions);
      } catch (err) {
        setError("Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Get unique question types for filter dropdown
  const questionTypes = Array.from(new Set(questions.map(q => q.props.questionType.name)));

  // Filter questions by search and type
  const filteredQuestions = questions.filter(q => {
    const matchesTitle = q.props.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? q.props.questionType.name === typeFilter : true;
    return matchesTitle && matchesType;
  });

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const { column, direction } = sort;
    let aValue: string | number = "", bValue: string | number = "";
    if (column === "title") {
      aValue = a.props.title?.toLowerCase() ?? "";
      bValue = b.props.title?.toLowerCase() ?? "";
    } else if (column === "type") {
      aValue = a.props.questionType.name?.toLowerCase() ?? "";
      bValue = b.props.questionType.name?.toLowerCase() ?? "";
    } else if (column === "points") {
      aValue = a.props.points ?? 0;
      bValue = b.props.points ?? 0;
    } else if (column === "status") {
      aValue = a.props.isPublished ? "Published" : "Draft";
      bValue = b.props.isPublished ? "Published" : "Draft";
    }
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: SortColumn) => {
    setSort(prev => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  };

  const sortArrow = (column: SortColumn) => {
    if (sort.column !== column) return null;
    return sort.direction === "asc" ? "▲" : "▼";
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Created Problems</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="w-full md:w-auto flex justify-end">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Types</option>
            {questionTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("title")}>Title {sortArrow("title")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("type")}>Type {sortArrow("type")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("points")}>Points {sortArrow("points")}</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => handleSort("status")}>Status {sortArrow("status")}</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.map((q) => (
              <TableRow key={q.props.id}>
                <TableCell>{q.props.title}</TableCell>
                <TableCell>{q.props.questionType.name}</TableCell>
                <TableCell>{q.props.points}</TableCell>
                <TableCell>{q.props.isPublished ? "Published" : "Draft"}</TableCell>
                <TableCell>
                  <Link href={`/problems/${q.props.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Link href={`/teacher/edit-problem/${q.props.id}`}>
                    <Button size="sm" variant="ghost" className="ml-2">Edit</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
