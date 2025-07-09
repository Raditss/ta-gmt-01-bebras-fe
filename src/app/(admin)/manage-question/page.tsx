"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen } from "lucide-react";

const MOCK_QUESTIONS = [
  {
    id: 1,
    title: "CFG Transformation: 6 → 3 states",
    author: "Teacher Alice",
    type: "context-free-grammar",
    status: "PENDING",
  },
  {
    id: 2,
    title: "Cipher N",
    author: "Teacher Bob",
    type: "cipher-n",
    status: "APPROVED",
  },
  {
    id: 3,
    title: "Decision Tree",
    author: "Teacher Alice",
    type: "decision-tree",
    status: "TAKEDOWN",
  },
  {
    id: 4,
    title: "Ring Cipher",
    author: "Teacher Dana",
    type: "ring-cipher",
    status: "PENDING",
  },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  TAKEDOWN: "bg-red-100 text-red-800",
};

export default function ManageQuestionPage() {
  const [questions] = useState(MOCK_QUESTIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const questionTypes = Array.from(new Set(questions.map(q => q.type)));
  const statusTypes = ["PENDING", "APPROVED", "TAKEDOWN"];

  const filteredQuestions = questions.filter(q => {
    const matchesTitle = q.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? q.type === typeFilter : true;
    const matchesStatus = statusFilter ? q.status === statusFilter : true;
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
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Types</option>
                {questionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Statuses</option>
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
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
              {filteredQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>{q.title}</TableCell>
                  <TableCell>{q.author}</TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[q.status as keyof typeof STATUS_COLORS]}`}>{q.status}</span>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" disabled>Approve</Button>
                    <Button size="sm" variant="destructive" disabled>Takedown</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
