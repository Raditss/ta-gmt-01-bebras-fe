"use client"

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Award, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface CreationSubmissionModalProps {
  isOpen: boolean;
  isConfirming: boolean;
  questionData?: {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    points: number;
    estimatedTime: number;
    author: string;
  } | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  onClose: () => void;
}

export function CreationSubmissionModal({
  isOpen,
  isConfirming,
  questionData,
  onConfirm,
  onCancel,
  onClose
}: CreationSubmissionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      setSubmitted(true);
      // Auto-close after showing success for 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl text-green-800">
              Question Published Successfully!
            </DialogTitle>
            <DialogDescription className="text-green-600">
              Your question has been published and is now available to students.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (isConfirming && questionData) {
    return (
      <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Confirm Question Submission
            </DialogTitle>
            <DialogDescription>
              Please review your question details before publishing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">{questionData.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>Author: {questionData.author}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>Category: {questionData.category}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span>Difficulty: {questionData.difficulty}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-500" />
                  <span>Points: {questionData.points}</span>
                </div>
                
                <div className="flex items-center gap-2 col-span-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Estimated Time: {questionData.estimatedTime} minutes</span>
                </div>
              </div>

              {questionData.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-700">
                    <strong>Description:</strong> {questionData.description}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Once published, this question will be available to all students and cannot be easily modified. 
                Make sure all rules, states, and content are correct.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
} 