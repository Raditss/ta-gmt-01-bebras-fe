"use client"

import { useParams } from 'next/navigation';
import { QuestionType } from '@/constants/questionTypes';
import { BaseCreatorProps } from '@/components/creators/base-creator';
import React from 'react';
import CfgCreator from '@/components/creators/cfg-creator';
import DecisionTreeCreator from '@/components/creators/decision-tree-creator';
import DecisionTree2Creator from '@/components/creators/decision-tree-2-creator';

// Abstract mapping of question types to their creator components
const creators: Partial<Record<QuestionType, React.ComponentType<BaseCreatorProps>>> = {
  'cfg': CfgCreator,
  'decision-tree': DecisionTreeCreator,
  'decision-tree-2': DecisionTree2Creator,
};

// Error boundary for creator components
class CreatorErrorBoundary extends React.Component<
  { children: React.ReactNode; questionId: string; type: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; questionId: string; type: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Creator Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Creator Error Boundary details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen bg-yellow-400">
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-bold text-red-600 mb-4">Creation Error</h2>
              <p className="text-gray-700 mb-4">
                Failed to load question with ID: {this.props.questionId}
              </p>
              <p className="text-gray-600 mb-4">
                Type: {this.props.type}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Error: {this.state.error?.message}
              </p>
              <button 
                onClick={() => window.location.href = '/add-problem'} 
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
              >
                Back to Add Problem
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function CreateQuestionPage() {
  const params = useParams();
  const type = params?.type as QuestionType;
  const id = params?.id as string;
  const [initialData, setInitialData] = React.useState<BaseCreatorProps['initialData']>(undefined);
  const [mounted, setMounted] = React.useState(false);
  


  // Extract initial data on client side only
  React.useEffect(() => {
    setMounted(true);
    
    // Only extract data for new questions (id === 'new')
    if (id === 'new') {
      const urlParams = new URLSearchParams(window.location.search);
      
      const title = urlParams.get('title');
      const description = urlParams.get('description');
      const difficulty = urlParams.get('difficulty') as 'Easy' | 'Medium' | 'Hard';
      const category = urlParams.get('category');
      const points = urlParams.get('points');
      const estimatedTime = urlParams.get('estimatedTime');
      const author = urlParams.get('author');

      const extractedData = title ? {
        title,
        description: description || '',
        difficulty: difficulty || 'Easy',
        category: category || '',
        points: points ? parseInt(points) : 100,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : 30,
        author: author || ''
      } : undefined;

      setInitialData(extractedData);
    } else {
      setInitialData(undefined);
    }
  }, [id]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-yellow-400">
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the appropriate creator component for this question type
  const CreatorComponent = creators[type];
  
  if (!CreatorComponent) {
    return (
      <CreatorErrorBoundary questionId={id} type={type}>
        <div className="flex flex-col min-h-screen bg-yellow-400">
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h2 className="text-xl font-bold text-orange-600 mb-4">Not Implemented</h2>
              <p className="text-gray-700 mb-4">
                Question type &quot;{type}&quot; is not yet implemented.
              </p>
              <p className="text-gray-600 mb-4">
                Please check the available question types.
              </p>
              <button 
                onClick={() => window.location.href = '/add-problem'} 
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
              >
                Back to Add Problem
              </button>
            </div>
          </div>
        </div>
      </CreatorErrorBoundary>
    );
  }

  return (
    <CreatorErrorBoundary questionId={id} type={type}>
      <CreatorComponent questionId={id} initialData={initialData} />
    </CreatorErrorBoundary>
  );
} 