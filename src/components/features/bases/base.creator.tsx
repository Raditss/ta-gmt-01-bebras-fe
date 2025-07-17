'use client';

import { NavigationAlertDialog } from '@/components/features/question/navigation-alert-dialog';
import { Question } from '@/types/question.type';
import { ReactNode } from 'react';

export interface BaseCreatorProps {
  initialDataQuestion: Question;
}

export interface CreatorWrapperProps {
  children: ReactNode;
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  showNavigationDialog: boolean;
  onSaveAndLeave: () => Promise<void>;
  onLeaveWithoutSaving: () => void;
  onStayOnPage: () => void;
  onSetShowDialog: (show: boolean) => void;
}

export function CreatorWrapper({
  children,
  loading,
  error,
  hasUnsavedChanges: _,
  showNavigationDialog,
  onSaveAndLeave,
  onLeaveWithoutSaving,
  onStayOnPage,
  onSetShowDialog
}: CreatorWrapperProps) {
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
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationAlertDialog
        open={showNavigationDialog}
        onOpenChange={onSetShowDialog}
        onSaveAndLeave={onSaveAndLeave}
        onLeaveWithoutSaving={onLeaveWithoutSaving}
        onCancel={onStayOnPage}
      />

      <main className="flex-1">{children}</main>
    </div>
  );
}
