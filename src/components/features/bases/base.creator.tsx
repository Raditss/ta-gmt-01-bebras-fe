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
  hasUnsavedChanges,
  showNavigationDialog,
  onSaveAndLeave,
  onLeaveWithoutSaving,
  onStayOnPage,
  onSetShowDialog
}: CreatorWrapperProps) {
  console.log('hasUnsavedChanges', hasUnsavedChanges);
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <NavigationAlertDialog
        open={showNavigationDialog}
        onOpenChange={onSetShowDialog}
        onSaveAndLeave={onSaveAndLeave}
        onLeaveWithoutSaving={onLeaveWithoutSaving}
        onCancel={onStayOnPage}
      />

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
