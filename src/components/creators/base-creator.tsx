"use client"

import { MainNavbar } from '@/components/main-navbar';
import { NavigationAlertDialog } from '@/components/ui/navigation-alert-dialog';

export interface BaseCreatorProps {
  questionId: string;
  initialData?: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    points: number;
    estimatedTime: number;
    author: string;
  };
}

export interface BaseCreator {
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  onSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
}

export interface CreatorWrapperProps {
  children: React.ReactNode;
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
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <MainNavbar />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-lg">Loading question...</p>
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
      <NavigationAlertDialog
        open={showNavigationDialog}
        onOpenChange={onSetShowDialog}
        onSaveAndLeave={onSaveAndLeave}
        onLeaveWithoutSaving={onLeaveWithoutSaving}
        onCancel={onStayOnPage}
      />
      
      <MainNavbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
} 