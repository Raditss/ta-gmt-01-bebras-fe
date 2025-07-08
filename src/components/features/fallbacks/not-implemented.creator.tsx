"use client";

import React from "react";
import { BaseCreatorProps } from "@/components/features/bases/base.creator";

export default function NotImplementedCreator({
  questionId,
  initialData,
}: BaseCreatorProps) {
  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">
            Question Type Not Yet Implemented
          </h2>
          <p className="text-gray-700 mb-4">
            This question type is not yet supported.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Question ID: {questionId}
          </p>
          {initialData && (
            <details className="text-left">
              <summary className="cursor-pointer font-medium">
                Initial Data
              </summary>
              <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
                {JSON.stringify(initialData, null, 2)}
              </pre>
            </details>
          )}
          <button
            onClick={() => (window.location.href = "/add-problem")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded mt-4"
          >
            Back to Add Problem
          </button>
        </div>
      </div>
    </div>
  );
}
