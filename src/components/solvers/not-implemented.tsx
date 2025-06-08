"use client"

import { BaseSolverProps, SolverWrapper } from './base-solver';

export default function NotImplemented({ questionId }: BaseSolverProps) {
  return (
    <SolverWrapper loading={false} error={null}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-lg">This question type is not yet implemented.</p>
        <p className="text-sm mt-2">Question ID: {questionId}</p>
      </div>
    </SolverWrapper>
  );
} 