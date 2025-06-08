"use client"

import { useParams } from 'next/navigation';
import { QuestionType } from '@/constants/questionTypes';
import dynamic from 'next/dynamic';
import { BaseCreatorProps } from '@/components/creators/base-creator';
import React from 'react';

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

// Import creators for different question types
import CfgCreator from '@/components/creators/cfg-creator';

const creators: Partial<Record<QuestionType, React.ComponentType<BaseCreatorProps>>> = {
  'cfg': CfgCreator
};

export default function CreateQuestionPage() {
  const params = useParams();
  const type = params?.type as QuestionType;
  const id = params?.id as string;
  const [initialData, setInitialData] = React.useState<any>(undefined);
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

  const Creator = creators[type];
  if (!Creator) {
    const DefaultCreator = creators['cfg'];
    if (!DefaultCreator) {
      return (
        <CreatorErrorBoundary questionId={id} type={type}>
          <div className="flex flex-col min-h-screen bg-yellow-400">
            <div className="flex-1 flex justify-center items-center">
              <p className="text-lg">Unsupported question type: {type}</p>
            </div>
          </div>
        </CreatorErrorBoundary>
      );
    }
    return (
      <CreatorErrorBoundary questionId={id} type={type}>
        <DefaultCreator questionId={id} initialData={initialData} />
      </CreatorErrorBoundary>
    );
  }

  return (
    <CreatorErrorBoundary questionId={id} type={type}>
      <Creator questionId={id} initialData={initialData} />
    </CreatorErrorBoundary>
  );
} 