'use client';

import React from 'react';
import { QuestionTypeEnum } from '@/types/question-type.type';

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
  type
}: {
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  type: QuestionTypeEnum;
}) {
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-lg text-foreground">
              Loading {type} question...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center p-6 bg-card rounded-lg shadow-sm border">
            <p className="text-lg text-destructive mb-2">
              Error Loading Question
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
