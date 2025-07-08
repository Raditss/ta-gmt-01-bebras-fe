"use client";

import { MainNavbar } from "@/components/layout/Nav/main-navbar";
import { QuestionTypeEnum } from "@/types/question-type.type";
import React from "react";

export interface GeneratedSolverProps {
  type: QuestionTypeEnum;
}

export interface GeneratedBaseSolver {
  loading: boolean;
  error: string | null;
  onSubmit: () => Promise<void>;
}

export function GeneratedSolverWrapper({
  children,
  loading,
  error,
  type,
}: {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  type: QuestionTypeEnum;
}) {
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading {type} question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <MainNavbar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
