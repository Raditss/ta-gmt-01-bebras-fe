'use client';

import { ReactNode } from 'react';

export interface BaseSolverProps {
  questionId: string;
}

export function SolverWrapper({
  children,
  loading,
  error
}: {
  children: ReactNode;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-lg text-foreground">Loading question...</p>
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
    <div className="flex flex-col min-h-screen bg-background">{children}</div>
  );
}
