import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

type CreatorErrorBoundaryProps = {
  children: ReactNode;
  questionId: string;
  type: string;
};

function ErrorFallback({
                         questionId,
                         type,
                       }: { questionId: string; type: string }) {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Creation Error
          </h2>
          <p className="text-gray-700 mb-4">
            Failed to load question with ID: {questionId}
          </p>
          <p className="text-gray-600 mb-4">Type: {type}</p>
          <button
            onClick={() => (window.location.href = "/add-problem")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Back to Add Problem
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateQuestionErrorBoundary({
                                       children,
                                       questionId,
                                       type,
                                     }: CreatorErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback questionId={questionId} type={type} />}
    >
      {children}
    </ErrorBoundary>
  );
}
